
import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/matchmaking';
import { recordSwipeAction } from '@/services/MatchmakingService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { X, Heart, Bookmark } from 'lucide-react';
import Loader from './ui/loader';

interface SwipeMatchContainerProps {
  profiles: UserProfile[];
  onSwipeLeft?: (profile: UserProfile) => void;
  onSwipeRight?: (profile: UserProfile) => void;
  onSave?: (profile: UserProfile) => void;
  onEmpty?: () => void;
  isLoading?: boolean;
  onFindMore?: () => void;
}

const SwipeMatchContainer: React.FC<SwipeMatchContainerProps> = ({
  profiles,
  onSwipeLeft,
  onSwipeRight,
  onSave,
  onEmpty,
  isLoading = false,
  onFindMore
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [swiping, setSwiping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Reset index when new profiles are loaded
    if (profiles.length > 0) {
      setCurrentIndex(0);
    }
  }, [profiles]);

  useEffect(() => {
    // Call onEmpty when there are no more profiles to show
    if (currentIndex >= profiles.length && profiles.length > 0 && onEmpty) {
      onEmpty();
    }
  }, [currentIndex, profiles.length, onEmpty]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (currentIndex >= profiles.length) return;
    
    const threshold = 100;
    const swipeDirection = info.offset.x > threshold ? 'right' : info.offset.x < -threshold ? 'left' : '';
    
    if (swipeDirection) {
      setDirection(swipeDirection);
      setSwiping(true);
      
      setTimeout(() => {
        if (swipeDirection === 'left') {
          handleSwipe('pass');
        } else if (swipeDirection === 'right') {
          handleSwipe('like');
        }
        
        setDirection('');
        setSwiping(false);
      }, 300);
    }
  };

  const handleSwipe = (action: 'like' | 'pass' | 'save') => {
    if (currentIndex >= profiles.length || !user?.id) return;
    
    const currentProfile = profiles[currentIndex];
    
    if (action === "like" || action === "pass") {
      // Record swipe action in database
      recordSwipeAction(user.id, currentProfile.id, action)
        .then(() => {
          if (action === "like") {
            onSwipeRight?.(currentProfile);
            toast.success(`You liked ${currentProfile.name}!`);
          } else {
            onSwipeLeft?.(currentProfile);
            toast.info(`Skipped ${currentProfile.name}`);
          }
        })
        .catch(err => {
          console.error("Failed to record swipe:", err);
          toast.error("Failed to save your choice");
        });
      
      // Move to next profile
      setCurrentIndex(prevIndex => prevIndex + 1);
    } 
    else if (action === "save") {
      // Save profile for later
      recordSwipeAction(user.id, currentProfile.id, action)
        .then(() => {
          onSave?.(currentProfile);
          toast.success(`Saved ${currentProfile.name} to favorites!`);
        })
        .catch(err => {
          console.error("Failed to save profile:", err);
          toast.error("Failed to save profile");
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-muted/30 rounded-lg p-6 text-center">
        <Loader />
        <h3 className="text-lg font-medium mt-4 mb-2">Finding Connections</h3>
        <p className="text-muted-foreground">
          Looking for professionals that match your criteria
        </p>
      </div>
    );
  }
  
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-muted/30 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No Matches Available</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find any connections for you right now. Try adjusting your preferences or check back later.
        </p>
        <Button variant="outline" onClick={onFindMore}>
          Refresh
        </Button>
      </div>
    );
  }
  
  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-muted/30 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">You're All Caught Up!</h3>
        <p className="text-muted-foreground mb-4">
          You've viewed all potential connections for now. Check back later for new matches.
        </p>
        <Button variant="outline" onClick={onFindMore}>
          Find More
        </Button>
      </div>
    );
  }
  
  const currentProfile = profiles[currentIndex];
  const backgroundImageUrl = currentProfile.imageUrl?.startsWith('http') 
    ? `url(${currentProfile.imageUrl})` 
    : 'none';
  
  const noImageGradient = currentProfile.imageUrl?.startsWith('http') 
    ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent' 
    : 'bg-gradient-to-br from-blue-400 to-indigo-600';
  
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-background">
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{
          x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
          opacity: direction ? 0 : 1,
          rotateZ: direction === 'left' ? -10 : direction === 'right' ? 10 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="h-full w-full bg-cover bg-center rounded-lg relative overflow-hidden"
          style={{ backgroundImage: backgroundImageUrl }}
        >
          <div className={`absolute inset-0 ${noImageGradient}`}></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                <p className="text-white/90 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {currentProfile.location}
                  {currentProfile.distance && (
                    <span className="ml-2">• {Math.round(currentProfile.distance)}km away</span>
                  )}
                </p>
              </div>
              
              <div className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                {currentProfile.matchScore ? `${Math.round(currentProfile.matchScore)}%` : 'Match'}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-white/80 mb-2">{currentProfile.bio || `${currentProfile.name} is a ${currentProfile.experienceLevel || ''} ${currentProfile.userType || 'professional'} in ${currentProfile.industry || 'your industry'}.`}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {currentProfile.industry && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {currentProfile.industry}
                  </span>
                )}
                {currentProfile.experienceLevel && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {currentProfile.experienceLevel}
                  </span>
                )}
                {currentProfile.skills?.slice(0, 2).map((skill, i) => (
                  <span key={i} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {direction === 'left' && (
            <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-1 rounded-full transform rotate-12 text-lg font-bold border-2 border-white">
              PASS
            </div>
          )}
          {direction === 'right' && (
            <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-1 rounded-full transform -rotate-12 text-lg font-bold border-2 border-white">
              LIKE
            </div>
          )}
        </div>
      </motion.div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-white border-red-400 text-red-500 shadow-lg"
          onClick={() => handleSwipe('pass')}
          disabled={swiping}
        >
          <X size={24} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-white border-blue-400 text-blue-500 shadow-lg"
          onClick={() => handleSwipe('save')}
          disabled={swiping}
        >
          <Bookmark size={24} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-14 w-14 rounded-full bg-white border-green-400 text-green-500 shadow-lg"
          onClick={() => handleSwipe('like')}
          disabled={swiping}
        >
          <Heart size={24} />
        </Button>
      </div>
      
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-white/30 h-1 rounded-full w-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full"
            style={{ width: `${(currentIndex / profiles.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SwipeMatchContainer;
