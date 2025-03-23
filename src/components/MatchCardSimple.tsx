
import React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/matchmaking";

interface MatchCardSimpleProps {
  profile: UserProfile;
  onViewProfile: () => void;
  onMessage: () => void;
}

const MatchCardSimple = ({ profile, onViewProfile, onMessage }: MatchCardSimpleProps) => {
  return (
    <div className="rounded-lg border overflow-hidden bg-card">
      <div className="h-40 bg-muted relative">
        {profile.imageUrl ? (
          <img 
            src={profile.imageUrl} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
            <span className="text-4xl font-semibold text-blue-500">
              {profile.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{profile.name}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {profile.experienceLevel || "Professional"}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {profile.industry || "Industry not specified"} • {profile.location || "Location not specified"}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {profile.skills && profile.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onViewProfile} 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            View Profile
          </Button>
          <Button 
            onClick={onMessage} 
            size="sm" 
            className="flex-1"
          >
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCardSimple;
