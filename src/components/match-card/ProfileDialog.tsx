
import React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/matchmaking";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
  isConnected: boolean;
}

const ProfileDialog = ({ profile, isOpen, onOpenChange, onConnect, isConnected }: ProfileDialogProps) => {
  const initial = profile.name?.charAt(0) || "?";
  const matchPercentage = profile.matchScore !== undefined ? Math.floor(profile.matchScore) : 85;
  
  // Function to get the right color based on match percentage
  const getMatchScoreColor = () => {
    if (matchPercentage >= 90) return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (matchPercentage >= 75) return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
    if (matchPercentage >= 60) return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
    return "bg-gradient-to-r from-gray-600 to-gray-700 text-white";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white">{profile.name}{profile.age ? `, ${profile.age}` : ''}</DialogTitle>
          <DialogDescription className="text-gray-400">{profile.location}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-600 to-indigo-700'} h-48 rounded-md flex items-center justify-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-4xl font-light text-white shadow-lg animate-float">
              {initial}
            </div>
            <div className={`absolute top-4 right-4 ${getMatchScoreColor()} rounded-full px-3 py-1 text-xs font-bold shadow-lg`}>
              {matchPercentage}% Match
            </div>
          </div>
          
          {profile.bio && (
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              <h4 className="text-sm font-medium mb-2 text-white">About</h4>
              <p className="text-sm text-gray-300">{profile.bio}</p>
            </div>
          )}
          
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="text-sm font-medium mb-2 text-white">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {profile.interests?.map((interest, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full border border-purple-800/50"
                >
                  {interest}
                </span>
              )) || <span className="text-gray-400">No interests listed</span>}
            </div>
          </div>
          
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              <h4 className="text-sm font-medium mb-2 text-white">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-blue-900/40 text-blue-300 rounded-full border border-blue-800/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full" 
              onClick={() => {
                onConnect();
                onOpenChange(false);
              }}
              disabled={isConnected}
            >
              {isConnected ? "Already Connected" : "Connect"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
