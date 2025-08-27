import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useState, useRef } from "react";
import ParticleField from "@/components/ParticleField";

const Chat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:8000/conversation/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponseText(data.response_text);

      // Play the returned audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audio_output}`);
      audio.play();

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
    <div className="min-h-screen bg-gradient-space relative overflow-hidden flex flex-col">
      <ParticleField />

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">
        {/* AR Mate display placeholder */}
        <div className="w-64 h-64 bg-secondary/30 rounded-full mb-8 flex items-center justify-center">
          <p className="text-muted-foreground">AR Mate</p>
        </div>

        {/* Response text display */}
        <div className="w-full max-w-md min-h-24 bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-accent/20 shadow-glow mb-8 flex items-center justify-center">
          <p className="text-foreground text-center">
            {isLoading ? "Thinking..." : responseText || "I'm listening..."}
          </p>
        </div>

        {/* Microphone button */}
        <Button
          size="lg"
          className={`rounded-full w-20 h-20 transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-accent hover:bg-accent/90'}`}
          onClick={handleMicClick}
          disabled={isLoading}
        >
          <Mic className="w-8 h-8 text-white" />
        </Button>
        <p className="text-muted-foreground mt-4">
          {isLoading ? "Processing..." : (isRecording ? "Recording..." : "Tap to speak")}
        </p>
      </div>
    </div>
  );
};

export default Chat;
