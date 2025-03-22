
import React, { useState, useRef, useEffect } from "react";
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
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);
  
  const initial = profile.name?.charAt(0) || "?";
  const matchPercentage = profile.matchScore !== undefined ? Math.floor(profile.matchScore) : 85;
  
  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease'
    });
  };
  
  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
  };
  
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
    if (matchPercentage >= 90) return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (matchPercentage >= 75) return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
    if (matchPercentage >= 60) return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
    return "bg-gradient-to-r from-gray-600 to-gray-700 text-white";
  };
  
  return (
    <>
      <div 
        ref={cardRef}
        className={cn(
          "bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300",
          "opacity-0 animate-scale-in shadow-xl border border-gray-800/50 backdrop-blur-sm",
          "hover:shadow-indigo-500/10 hover:border-indigo-500/30"
        )}
        style={{ 
          animationDelay: `${delay}ms`, 
          animationFillMode: "forwards",
          ...tiltStyle 
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-600 to-indigo-800'} h-32 flex items-center justify-center relative overflow-hidden`}>
          {/* 3D floating avatar effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-3xl font-medium text-white shadow-lg animate-float transform-gpu">
            {initial}
          </div>
          <div className={`absolute top-3 right-3 ${getMatchScoreColor()} rounded-full px-3 py-1 text-xs font-bold flex items-center shadow-lg`}>
            {matchPercentage}% Match
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg text-white">{profile.name}{profile.age ? `, ${profile.age}` : ''}</h3>
              <div className="flex items-center text-sm text-blue-300 mt-1">
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
                className="text-xs px-2 py-1 bg-blue-900/40 text-blue-300 rounded-full border border-blue-800/50"
              >
                {skill}
              </span>
            ))}
            {profile.interests?.slice(0, profile.skills?.length ? 1 : 3).map((interest, index) => (
              <span 
                key={`interest-${index}`} 
                className="text-xs px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full border border-purple-800/50"
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
          
          {/* Floating action buttons with glass effect */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-1/3 rounded-full bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 backdrop-blur-sm"
              onClick={handleViewProfile}
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              Chat
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              className="w-1/3 rounded-full bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 backdrop-blur-sm"
              onClick={handleViewProfile}
            >
              <Phone className="mr-1 h-4 w-4" />
              Call
            </Button>
            <Button 
              size="sm" 
              className={`w-1/3 rounded-full backdrop-blur-sm ${isConnected 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'}`}
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
