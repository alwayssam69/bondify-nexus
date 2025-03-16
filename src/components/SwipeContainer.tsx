
import React, { useState, useEffect } from "react";
import SwipeCard from "@/components/SwipeCard";
import { UserProfile, recordSwipe } from "@/lib/matchmaking";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SwipeContainerProps {
  profiles: UserProfile[];
  onNewMatch: (profile: UserProfile) => void;
  onRefresh: () => void;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ 
  profiles, 
  onNewMatch,
  onRefresh
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSwipe = (profileId: string, action: 'like' | 'reject') => {
    // Record the swipe action
    recordSwipe("current-user", profileId, action);
    
    // Add to swiped profiles
    setSwipedProfiles(prev => new Set([...prev, profileId]));
    
    // Handle like action
    if (action === 'like') {
      // Simulate a match 30% of the time
      if (Math.random() < 0.3) {
        const matchedProfile = profiles.find(p => p.id === profileId);
        if (matchedProfile) {
          // Record the reciprocal swipe (other user likes current user)
          recordSwipe(profileId, "current-user", 'like');
          
          // Notify about new match
          toast.success(`You matched with ${matchedProfile.name}!`);
          onNewMatch(matchedProfile);
        }
      }
    }
    
    // Move to next profile
    setCurrentIndex(prev => prev + 1);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setCurrentIndex(0);
      setSwipedProfiles(new Set());
      setIsRefreshing(false);
    }, 1000);
  };

  const availableProfiles = profiles.filter(p => !swipedProfiles.has(p.id));
  const currentProfile = availableProfiles[currentIndex];
  const showRefreshButton = currentIndex >= availableProfiles.length || availableProfiles.length === 0;

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto relative py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {showRefreshButton ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No more profiles to show</h3>
          <p className="text-muted-foreground mb-6">Check back later or refresh to see if there are new matches!</p>
          <Button 
            onClick={handleRefresh} 
            className="px-6"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Find More Matches'}
          </Button>
        </div>
      ) : (
        <div className="relative h-[550px]">
          {/* Show up to 3 cards with the current card on top */}
          {availableProfiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              isActive={index === 0}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SwipeContainer;
