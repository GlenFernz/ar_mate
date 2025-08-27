import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import ParticleField from "@/components/ParticleField";

const Profile = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const avatars = [
    "👤", "😊", "😎", "👨‍💼",
    "🤓", "☀️", "👩‍🚀", "⚡"
  ];

  const handleContinue = () => {
    // Navigate to next step or main app
    console.log("Profile created:", { name, avatar: selectedAvatar });
    // You can navigate to another page or show success
  };

  return (
    <div className="min-h-screen bg-gradient-space relative overflow-hidden">
      <ParticleField />
      
      {/* Progress Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground text-sm">Step 1 of 2</span>
            <span className="text-accent text-sm font-medium">Profile</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-secondary/30 rounded-full h-1">
            <div className="bg-gradient-to-r from-accent to-primary h-1 rounded-full w-1/2 shadow-glow"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Profile Form Card */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-accent/20 shadow-glow">
            <h1 className="text-2xl font-bold text-accent text-center mb-8">
              Create Your Profile
            </h1>

            {/* Name Input */}
            <div className="mb-8">
              <label className="block text-foreground text-sm font-medium mb-3">
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/50 border-accent/20 text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent/20"
              />
            </div>

            {/* Avatar Selection */}
            <div className="mb-8">
              <label className="block text-foreground text-sm font-medium mb-4">
                Choose Avatar
              </label>
              
              {/* Avatar Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 ${
                      selectedAvatar === avatar
                        ? 'border-accent bg-accent/20 shadow-glow'
                        : 'border-accent/20 bg-secondary/30 hover:border-accent/40'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>

              {/* Photo Upload Option */}
              <div className="border-2 border-dashed border-accent/30 rounded-xl p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-muted-foreground text-sm mb-1">Or upload your photo</p>
                <p className="text-muted-foreground text-xs">(Coming soon)</p>
              </div>
            </div>

            {/* Continue Button */}
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleContinue}
              disabled={!name.trim()}
              className="w-full"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;