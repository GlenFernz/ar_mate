import { Button } from "@/components/ui/button";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticleField from "@/components/ParticleField";

const Index = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/welcome");
  };
  return (
    <div className="min-h-screen bg-gradient-space relative overflow-hidden">
      <ParticleField />
      
      {/* Hero Background Glow */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Orbiting Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-accent rounded-full shadow-glow animate-orbit" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Zap className="w-8 h-8 text-accent animate-pulse-glow" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent tracking-tight shadow-hero-glow">
              AR MATE
            </h1>
            <div className="relative">
              <Sparkles className="w-6 h-6 text-accent animate-pulse-glow" />
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-md mx-auto">
            Your AI companion, always here for you.
          </p>
          
          {/* CTA Button */}
          <Button 
            variant="hero" 
            size="lg" 
            className="group"
            onClick={handleStart}
          >
            Tap to Start
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
