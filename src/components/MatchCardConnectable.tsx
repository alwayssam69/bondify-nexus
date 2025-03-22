
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/lib/matchmaking";
import { toast } from "sonner";
import { Eye, Link, MessageCircle, MapPin, Briefcase } from "lucide-react";
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
  const matchPercentage = profile.matchScore !== undefined ? Math.floor(profile.matchScore) : 85;
  
  const handleConnect = () => {
    if (onConnect) {
      onConnect(profile.id);
    } else {
      toast.success(`Connection request sent to ${profile.name}!`);
    }
    setIsConnected(true);
  };
  
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(profile.id);
    } else {
      setIsDialogOpen(true);
    }
  };

  // Function to get the right color based on match percentage
  const getMatchScoreColor = () => {
    if (matchPercentage >= 90) return "bg-green-50 text-green-800";
    if (matchPercentage >= 75) return "bg-blue-50 text-blue-800";
    if (matchPercentage >= 60) return "bg-yellow-50 text-yellow-800";
    return "bg-gray-50 text-gray-800";
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
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Briefcase className="h-3.5 w-3.5 mr-1" />
                <span>{profile.industry || "Professional"}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{profile.location}</span>
                {profile.distance !== undefined && (
                  <span className="ml-1">• {Math.round(profile.distance)} km</span>
                )}
              </div>
            </div>
            <div className={`${getMatchScoreColor()} text-xs font-medium px-2.5 py-1 rounded-full`}>
              {matchPercentage}% Match
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {profile.skills?.slice(0, 2).map((skill, index) => (
              <span 
                key={`skill-${index}`} 
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {skill}
              </span>
            ))}
            {profile.interests?.slice(0, profile.skills?.length ? 1 : 3).map((interest, index) => (
              <span 
                key={`interest-${index}`} 
                className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
              >
                {interest}
              </span>
            ))}
            {(profile.skills?.length || 0) + (profile.interests?.length || 0) > 3 && (
              <span className="text-xs px-2 py-1 rounded-full text-muted-foreground">
                +{(profile.skills?.length || 0) + (profile.interests?.length || 0) - 3} more
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
                    className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
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
                      className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                className="w-full" 
                onClick={() => {
                  handleConnect();
                  setIsDialogOpen(false);
                }}
                disabled={isConnected}
              >
                {isConnected ? "Already Connected" : "Connect"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchCardConnectable;
