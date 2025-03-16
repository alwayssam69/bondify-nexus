
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/lib/matchmaking";
import { toast } from "sonner";
import { Eye, Link, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MatchCardConnectableProps {
  profile: UserProfile;
  delay?: number;
  onViewProfile?: (id: string) => void;
  onConnect?: (id: string) => void;
}

const MatchCardConnectable: React.FC<MatchCardConnectableProps> = ({
  profile,
  delay = 0,
  onViewProfile,
  onConnect,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const initial = profile.name.charAt(0);
  const matchPercentage = profile.matchScore ? Math.floor(profile.matchScore) : 85;
  
  const handleConnect = () => {
    if (onConnect) {
      onConnect(profile.id);
    }
    setIsConnected(true);
    toast.success(`Connection request sent to ${profile.name}!`);
  };
  
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(profile.id);
    } else {
      setIsDialogOpen(true);
    }
  };
  
  return (
    <>
      <div 
        className={cn(
          "card-glass rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform",
          "opacity-0 animate-scale-in shadow-md"
        )}
        style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      >
        <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-400 to-indigo-600'} h-48 flex items-center justify-center`}>
          <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-3xl font-light text-white">
            {initial}
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{profile.name}, {profile.age}</h3>
              <p className="text-sm text-muted-foreground">{profile.location}</p>
            </div>
            <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {matchPercentage}% Match
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full text-muted-foreground">
                +{profile.interests.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-1/2 rounded-lg"
              onClick={handleViewProfile}
            >
              <Eye className="mr-1 h-4 w-4" />
              Profile
            </Button>
            <Button 
              size="sm" 
              className={`w-1/2 rounded-lg ${isConnected ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? (
                <>
                  <Link className="mr-1 h-4 w-4" />
                  Connected
                </>
              ) : (
                <>
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Detailed Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{profile.name}, {profile.age}</DialogTitle>
            <DialogDescription>{profile.location}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-400 to-indigo-600'} h-48 rounded-md flex items-center justify-center`}>
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-3xl font-light text-white">
                {initial}
              </div>
            </div>
            
            {profile.bio && (
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-1">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-2">
              <div>
                <h4 className="text-sm font-medium">Match Score</h4>
                <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1">
                  {matchPercentage}% Match
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Looking for</h4>
                <div className="bg-secondary text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1">
                  {profile.relationshipGoal.charAt(0).toUpperCase() + profile.relationshipGoal.slice(1)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? 'Connected' : 'Connect Now'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchCardConnectable;
