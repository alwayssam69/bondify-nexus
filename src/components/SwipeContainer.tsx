import React, { Component } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/matchmaking';
import { recordSwipeAction } from '@/services/MatchmakingService';
import { toast } from 'sonner';

interface SwipeContainerProps {
  profiles: UserProfile[];
  onSwipeLeft?: (profile: UserProfile) => void;
  onSwipeRight?: (profile: UserProfile) => void;
  onSave?: (profile: UserProfile) => void;
  onEmpty?: () => void;
  currentUser: UserProfile;
  isLoading?: boolean;
}

interface SwipeContainerState {
  currentIndex: number;
  direction: string;
  swiping: boolean;
}

class SwipeContainer extends Component<SwipeContainerProps, SwipeContainerState> {
  constructor(props: SwipeContainerProps) {
    super(props);
    this.state = {
      currentIndex: 0,
      direction: '',
      swiping: false
    };
  }

  componentDidUpdate(prevProps: SwipeContainerProps) {
    // Reset index if profiles array changes
    if (prevProps.profiles !== this.props.profiles && this.props.profiles.length > 0) {
      this.setState({ currentIndex: 0 });
    }
    
    // Check if we've run out of profiles
    if (this.state.currentIndex >= this.props.profiles.length && this.props.profiles.length > 0) {
      this.props.onEmpty?.();
    }
  }

  handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { profiles } = this.props;
    const { currentIndex } = this.state;
    
    if (currentIndex >= profiles.length) return;
    
    const threshold = 100;
    const swipeDirection = info.offset.x > threshold ? 'right' : info.offset.x < -threshold ? 'left' : '';
    
    if (swipeDirection) {
      this.setState({ direction: swipeDirection, swiping: true });
      
      setTimeout(() => {
        if (swipeDirection === 'left') {
          this.handleSwipe('pass');
        } else if (swipeDirection === 'right') {
          this.handleSwipe('like');
        }
        
        this.setState({ direction: '', swiping: false });
      }, 300);
    }
  };

  handleSwipe = (action: "like" | "pass" | "save") => {
    const { profiles, onSwipeLeft, onSwipeRight, onSave, currentUser } = this.props;
    const { currentIndex } = this.state;
    
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    
    if (action === "like" || action === "pass") {
      // Record the swipe action in the database
      if (currentUser.id !== 'current-user') {
        recordSwipeAction(currentUser.id, currentProfile.id, action)
          .catch(err => console.error("Failed to record swipe:", err));
      }
      
      if (action === "like") {
        onSwipeRight?.(currentProfile);
        toast.success(`You liked ${currentProfile.name}!`);
      } else {
        onSwipeLeft?.(currentProfile);
      }
      
      this.setState({ currentIndex: currentIndex + 1 });
    } else if (action === "save") {
      onSave?.(currentProfile);
      if (currentUser.id !== 'current-user') {
        recordSwipeAction(currentUser.id, currentProfile.id, action)
          .catch(err => console.error("Failed to save profile:", err));
      }
      toast.success(`Saved ${currentProfile.name} to your favorites!`);
    }
  };

  render() {
    const { profiles, isLoading } = this.props;
    const { currentIndex, direction, swiping } = this.state;
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-muted/30 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Finding potential connections...</p>
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
          <Button variant="outline" onClick={() => window.location.reload()}>
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
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      );
    }
    
    const currentProfile = profiles[currentIndex];
    const backgroundImageUrl = currentProfile.imageUrl?.startsWith('http') 
      ? `url(${currentProfile.imageUrl})` 
      : 'none';
    
    // Generate a background gradient if no image is available
    const noImageGradient = currentProfile.imageUrl?.startsWith('http') 
      ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent' 
      : 'bg-gradient-to-br from-blue-400 to-indigo-600';
    
    return (
      <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-background">
        <motion.div
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={this.handleDragEnd}
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
            {/* Gradient background */}
            <div className={`absolute inset-0 ${noImageGradient}`}></div>
            
            {/* Profile content */}
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
            
            {/* Swipe indicators */}
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
        
        {/* Action buttons */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-14 w-14 rounded-full bg-white border-red-400 text-red-500 shadow-lg"
            onClick={() => this.handleSwipe('pass')}
            disabled={swiping}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-14 w-14 rounded-full bg-white border-blue-400 text-blue-500 shadow-lg"
            onClick={() => this.handleSwipe('save')}
            disabled={swiping}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-14 w-14 rounded-full bg-white border-green-400 text-green-500 shadow-lg"
            onClick={() => this.handleSwipe('like')}
            disabled={swiping}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Button>
        </div>
        
        {/* Progress indicator */}
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
  }
}

export default SwipeContainer;
