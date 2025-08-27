import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticleField from "@/components/ParticleField";

const Welcome = () => {
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/profile");
  };

  const handleTellMore = () => {
    setShowMessage(true);
  };

  return (
    <div className="min-h-screen bg-gradient-space relative overflow-hidden">
      <ParticleField />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-md mx-auto">
          {/* Robot Character */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Robot Body */}
              <div className="w-20 h-32 bg-secondary/80 rounded-2xl backdrop-blur-sm border border-accent/20 relative shadow-glow">
                {/* Robot Head */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-14 bg-secondary/90 rounded-2xl border border-accent/20 shadow-glow">
                  {/* Eyes */}
                  <div className="flex justify-center items-center h-full gap-2">
                    <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse-glow"></div>
                    <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse-glow"></div>
                  </div>
                  {/* Antenna */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-accent/60 rounded-full"></div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                </div>
                
                {/* Robot Arms */}
                <div className="absolute top-6 -left-3 w-2 h-10 bg-secondary/80 rounded-full border border-accent/20"></div>
                <div className="absolute top-6 -right-3 w-2 h-10 bg-secondary/80 rounded-full border border-accent/20"></div>
                
                {/* Robot Mouth */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full"></div>
                
                {/* Robot Chest Panel */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-secondary rounded border border-accent/20">
                  <div className="w-full h-0.5 bg-accent/50 mt-1"></div>
                </div>
                
                {/* Robot Legs */}
                <div className="absolute -bottom-4 left-1/4 w-2 h-6 bg-secondary/80 rounded-full border border-accent/20"></div>
                <div className="absolute -bottom-4 right-1/4 w-2 h-6 bg-secondary/80 rounded-full border border-accent/20"></div>
              </div>
            </div>
          </div>

          {/* Message Bubble */}
          <div className="mb-8 relative">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-accent/20 shadow-glow relative">
              <div className="text-foreground text-lg mb-2 flex items-center justify-center gap-2">
                <span>👋</span>
                <span>✨</span>
              </div>
              <p className="text-foreground text-base mb-2">
                Hi there, welcome to AI Mate!
              </p>
              <p className="text-foreground text-base mb-3">
                I'm so excited to meet you!
              </p>
              <div className="text-red-400 text-2xl">♥</div>
              
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[15px] border-l-transparent border-r-transparent border-t-card/80"></div>
              </div>
            </div>

            {showMessage && (
              <div className="mt-4 bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-accent/20 shadow-glow animate-fade-in">
                <p className="text-muted-foreground text-sm">
                  I'm your AI companion, designed to help, chat, and be there whenever you need me. 
                  Let's start this amazing journey together! 🚀
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="hero" 
              onClick={handleGetStarted}
              className="px-6"
            >
              Let's Go! 🚀
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTellMore}
              className="px-6 border-accent/30 text-accent hover:bg-accent/10"
            >
              Tell me more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;