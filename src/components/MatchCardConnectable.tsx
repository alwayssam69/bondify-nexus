
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/lib/matchmaking";
import { toast } from "sonner";
import { Eye, Link as LinkIcon, MessageCircle, MapPin, Briefcase, Phone } from "lucide-react";
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
    if (matchPercentage >= 90) return "bg-green-500 text-white";
    if (matchPercentage >= 75) return "bg-blue-500 text-white";
    if (matchPercentage >= 60) return "bg-amber-500 text-white";
    return "bg-gray-500 text-white";
  };
  
  return (
    <>
      <div 
        className={cn(
          "bg-gray-900 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300",
          "opacity-0 animate-scale-in shadow-lg border border-gray-800"
        )}
        style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      >
        <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-600 to-indigo-700'} h-32 flex items-center justify-center relative`}>
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-medium text-white">
            {initial}
          </div>
          <div className={`absolute top-3 right-3 ${getMatchScoreColor()} rounded-full px-2 py-1 text-xs font-bold flex items-center`}>
            {matchPercentage}% Match
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg text-white">{profile.name}, {profile.age}</h3>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Briefcase className="h-3.5 w-3.5 mr-1" />
                <span>{profile.industry || profile.userType || "Professional"}</span>
                {profile.location && (
                  <span className="mx-1">•</span>
                )}
                <span>{profile.location}</span>
              </div>
              {profile.distance !== undefined && (
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{Math.round(profile.distance)} km away</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {profile.skills?.slice(0, 2).map((skill, index) => (
              <span 
                key={`skill-${index}`} 
                className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full"
              >
                {skill}
              </span>
            ))}
            {profile.interests?.slice(0, profile.skills?.length ? 1 : 3).map((interest, index) => (
              <span 
                key={`interest-${index}`} 
                className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full"
              >
                {interest}
              </span>
            ))}
            {(profile.skills?.length || 0) + (profile.interests?.length || 0) > 3 && (
              <span className="text-xs px-2 py-1 rounded-full text-gray-400">
                +{(profile.skills?.length || 0) + (profile.interests?.length || 0) - 3} more
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-1/3 rounded-lg bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              onClick={handleViewProfile}
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              Chat
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              className="w-1/3 rounded-lg bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
              onClick={handleViewProfile}
            >
              <Phone className="mr-1 h-4 w-4" />
              Call
            </Button>
            <Button 
              size="sm" 
              className={`w-1/3 rounded-lg ${isConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? (
                <>
                  <LinkIcon className="mr-1 h-4 w-4" />
                  Connected
                </>
              ) : (
                <>
                  <LinkIcon className="mr-1 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">{profile.name}, {profile.age}</DialogTitle>
            <DialogDescription className="text-gray-400">{profile.location}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-600 to-indigo-700'} h-48 rounded-md flex items-center justify-center`}>
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-light text-white">
                {initial}
              </div>
              <div className={`absolute top-4 right-4 ${getMatchScoreColor()} rounded-full px-2 py-1 text-xs font-bold`}>
                {matchPercentage}% Match
              </div>
            </div>
            
            {profile.bio && (
              <div>
                <h4 className="text-sm font-medium mb-1 text-white">About</h4>
                <p className="text-sm text-gray-400">{profile.bio}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-1 text-white">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1 text-white">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
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
