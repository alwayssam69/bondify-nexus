
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/lib/matchmaking";
import { toast } from "sonner";
import MatchAvatar from "./MatchAvatar";
import ProfileInfo from "./ProfileInfo";
import ActionButtons from "./ActionButtons";
import ProfileDialog from "./ProfileDialog";

interface MatchCardConnectableProps {
  profile: UserProfile;
  delay?: number;
  onViewProfile?: (id: string) => void;
  onConnect?: (id: string) => void;
  onAction?: (action: "like" | "pass" | "save") => void;
}

const MatchCardConnectable: React.FC<MatchCardConnectableProps> = ({
  profile,
  delay = 0,
  onViewProfile,
  onConnect,
  onAction,
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
    } else if (onAction) {
      onAction("like");
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
        <MatchAvatar 
          initial={initial} 
          imageUrl={profile.imageUrl} 
          matchPercentage={matchPercentage} 
        />
        <ProfileInfo profile={profile} />
        <ActionButtons 
          onViewProfile={handleViewProfile}
          onConnect={handleConnect}
        />
      </div>
      
      <ProfileDialog 
        profile={profile}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConnect={handleConnect}
        isConnected={isConnected}
      />
    </>
  );
};

export default MatchCardConnectable;
