
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/matchmaking";
import { MessageSquare, UserPlus, MapPin, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MatchCardConnectableProps {
  profile: UserProfile;
  delay?: number;
  onViewProfile: () => void;
  onConnect: () => void;
  onPass?: () => void;
  onStartChat?: () => void;
  showChatButton?: boolean;
  showDistance?: boolean;
}

const MatchCardConnectable: React.FC<MatchCardConnectableProps> = ({ 
  profile, 
  delay = 0, 
  onViewProfile, 
  onConnect,
  onPass,
  onStartChat,
  showChatButton = false,
  showDistance = false
}: MatchCardConnectableProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Function to get image background based on profile data
  const getImageBackground = () => {
    if (profile.imageUrl && profile.imageUrl.startsWith('http')) {
      return `url(${profile.imageUrl})`;
    }
    
    // Default gradient based on industry
    const industryColors: Record<string, string> = {
      'technology': 'from-blue-400 to-indigo-600',
      'finance': 'from-green-400 to-teal-600',
      'healthcare': 'from-teal-400 to-cyan-600',
      'education': 'from-purple-400 to-indigo-600',
      'marketing': 'from-orange-400 to-red-600',
      'design': 'from-pink-400 to-rose-600',
      'business': 'from-amber-400 to-orange-600',
      'legal': 'from-slate-400 to-gray-600',
      'engineering': 'from-cyan-400 to-blue-600',
    };
    
    const colorClass = industryColors[profile.industry?.toLowerCase() || ''] || 'from-blue-400 to-indigo-600';
    return `bg-gradient-to-br ${colorClass}`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden rounded-xl h-full transition-all duration-200 hover:shadow-lg">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black opacity-60 rounded-xl"></div>
        
        <div 
          className={`absolute inset-0 ${profile.imageUrl ? '' : getImageBackground()}`}
          style={profile.imageUrl && profile.imageUrl.startsWith('http') ? { backgroundImage: `url(${profile.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        />
        
        <CardContent className="relative h-full flex flex-col justify-between p-0 z-20">
          {/* Profile preview section */}
          <div 
            className="h-64 cursor-pointer flex items-end p-5" 
            onClick={onViewProfile}
          >
            <div className="text-white">
              <h3 className="text-xl font-bold mb-1">{profile.name}, {profile.age}</h3>
              
              <div className="flex items-center text-sm text-gray-100 mb-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {profile.location}
                {showDistance && profile.distance && (
                  <span className="ml-1">({Math.round(profile.distance)}km away)</span>
                )}
              </div>
              
              <p className="text-sm text-gray-100 line-clamp-2">
                {profile.industry && profile.experienceLevel ? (
                  `${profile.industry} • ${profile.experienceLevel} level`
                ) : (
                  profile.bio && profile.bio.length > 100 ? 
                    profile.bio.substring(0, 97) + '...' : 
                    profile.bio
                )}
              </p>
            </div>
          </div>
          
          {/* Skills tags */}
          <div className="p-4 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.skills?.slice(0, 4).map((skill, i) => (
                <span 
                  key={i}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {profile.skills && profile.skills.length > 4 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  +{profile.skills.length - 4}
                </span>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between gap-2">
              {onPass && (
                <Button 
                  onClick={onPass} 
                  size="icon" 
                  variant="outline"
                  className="rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              
              <Button 
                onClick={onViewProfile} 
                variant="outline" 
                className="flex-1 text-sm hover:bg-gray-50"
              >
                View Profile
              </Button>
              
              <Button 
                onClick={onConnect} 
                size="icon" 
                className="rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Button>
              
              {showChatButton && onStartChat && (
                <Button 
                  onClick={onStartChat} 
                  size="icon" 
                  variant="outline"
                  className="rounded-full hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchCardConnectable;
