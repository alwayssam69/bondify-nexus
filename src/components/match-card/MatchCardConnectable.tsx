
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/matchmaking";
import { MessageSquare, UserPlus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MatchCardConnectableProps {
  profile: UserProfile;
  delay?: number;
  onViewProfile: () => void;
  onConnect: () => void;
  onStartChat?: () => void;
  showChatButton?: boolean;
  showDistance?: boolean;
}

const MatchCardConnectable = ({ 
  profile, 
  delay = 0, 
  onViewProfile, 
  onConnect,
  onStartChat,
  showChatButton = false,
  showDistance = false
}: MatchCardConnectableProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Functions to handle placeholder images for profiles
  const getProfileBackground = () => {
    if (profile.imageUrl && profile.imageUrl.startsWith('bg-')) {
      return profile.imageUrl;
    }
    return "bg-gradient-to-br from-blue-400 to-indigo-600";
  };

  const getInitials = () => {
    return profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "Unknown distance";
    return distance < 1 ? "< 1 km away" : `${Math.round(distance)} km away`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className="h-full"
    >
      <Card className="cursor-pointer h-full flex flex-col hover:shadow-lg transition-all duration-200 overflow-hidden group">
        <div className="relative h-24">
          <div className={cn(
            "absolute inset-0 w-full",
            getProfileBackground()
          )}>
            {profile.imageUrl && !profile.imageUrl.startsWith('bg-') ? (
              <img 
                src={profile.imageUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Match Score Badge */}
          {profile.matchScore && (
            <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-primary font-semibold text-xs rounded-full px-2 py-0.5 shadow-md">
              {profile.matchScore}% Match
            </div>
          )}
          
          <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-xl overflow-hidden border-4 border-background shadow-lg">
            {profile.imageUrl && !profile.imageUrl.startsWith('bg-') ? (
              <img 
                src={profile.imageUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={cn(
                "w-full h-full flex items-center justify-center text-xl font-bold text-white",
                getProfileBackground()
              )}>
                {getInitials()}
              </div>
            )}
          </div>
        </div>

        <CardContent className="pt-12 pb-4 flex flex-col h-full justify-between space-y-4">
          <div className="space-y-2">
            <div onClick={onViewProfile}>
              <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                {profile.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {profile.userType || "Professional"}{profile.industry ? ` • ${profile.industry}` : ""}
              </p>
            </div>
            
            {showDistance && profile.distance && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                {formatDistance(profile.distance)}
              </div>
            )}
            
            <div className="mt-2">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {profile.skills && profile.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {profile.skills && profile.skills.length > 3 && (
                  <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full">
                    +{profile.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onConnect}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Connect
            </Button>
            
            {showChatButton && onStartChat && (
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={onStartChat}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Chat
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchCardConnectable;
