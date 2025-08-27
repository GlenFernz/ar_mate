import { Button } from "@/components/ui/button";
import { Mic, History } from "lucide-react";
import { useState, useRef } from "react";
import ARView from "@/components/ARView";
import { Badge } from "@/components/ui/badge";
import SessionHistory from "@/components/SessionHistory";

const Chat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [animation, setAnimation] = useState("idle");
  const [emotion, setEmotion] = useState("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${backendUrl}/conversation/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponseText(data.response_text);
      setAnimation(data.animation);
      setEmotion(data.emotion);

      // Play the returned audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audio_output}`);
      audio.play();
      audio.onended = () => {
        setAnimation("idle");
        setEmotion("neutral");
      };

    } catch (error) {
      console.error("Error sending audio to backend:", error);
      setResponseText("Sorry, I couldn't understand that. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
          sendAudioToBackend(audioBlob);
          stream.getTracks().forEach(track => track.stop()); // Stop the mic access
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        setResponseText(""); // Clear previous response
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setResponseText("Could not access microphone. Please check permissions.");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <ARView animation={animation}>
        {/* 3D content will go here */}
      </ARView>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-4 pointer-events-none">
        <div className="w-full flex justify-end pointer-events-auto">
          <SessionHistory>
            <Button variant="ghost" size="icon" className="text-white">
              <History className="w-6 h-6" />
            </Button>
          </SessionHistory>
        </div>
        <div className="w-full max-w-md pointer-events-auto">
          {/* Emotion Badge */}
          <div className="flex justify-center mb-2">
            {emotion !== "neutral" && (
              <Badge variant="outline" className="border-accent/30 text-accent bg-card/80 backdrop-blur-sm">
                {
                  {
                    happy: "🙂 Happy",
                    sad: "😔 Sad",
                    angry: "😡 Angry",
                  }[emotion]
                }
              </Badge>
            )}
          </div>
          {/* Response text display */}
          <div className="min-h-24 bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-accent/20 shadow-glow mb-8 flex items-center justify-center">
            <p className="text-foreground text-center">
              {isLoading ? "Thinking..." : responseText || "I'm listening..."}
            </p>
          </div>

          {/* Microphone button */}
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              className={`rounded-full w-20 h-20 transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-accent hover:bg-accent/90'}`}
              onClick={handleMicClick}
              disabled={isLoading}
            >
              <Mic className="w-8 h-8 text-white" />
            </Button>
            <p className="text-white mt-4">
              {isLoading ? "Processing..." : (isRecording ? "Recording..." : "Tap to speak")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
