
import React, { useState, useEffect } from "react";
import SwipeCard from "@/components/SwipeCard";
import { UserProfile, recordSwipe } from "@/lib/matchmaking";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Globe } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SwipeContainerProps {
  profiles: UserProfile[];
  onNewMatch: (profile: UserProfile) => void;
  onRefresh: () => void;
  onSendIntro?: (profileId: string, message: string) => void;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ 
  profiles, 
  onNewMatch,
  onRefresh,
  onSendIntro = () => {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<Set<string>>(new Set());
  const [savedProfiles, setSavedProfiles] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [maxDistance, setMaxDistance] = useState(50);
  const [customLocation, setCustomLocation] = useState("");
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  
  // Get user's location on load if enabled
  useEffect(() => {
    if (locationEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location. Some matching features will be limited.");
        }
      );
    }
  }, [locationEnabled]);
  
  // Set up location refreshing every 15 minutes
  useEffect(() => {
    if (!locationEnabled) return;
    
    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position.coords);
            toast.info("Your location has been updated", { duration: 2000 });
          },
          (error) => {
            console.error("Error refreshing location:", error);
          }
        );
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(locationInterval);
  }, [locationEnabled]);
  
  // Filter profiles based on location
  const filteredProfiles = profiles.filter(profile => {
    // Skip location filtering if location is disabled
    if (!locationEnabled) return true;
    
    // Filter by distance if we have both user location and profile distance
    if (userLocation && profile.distance !== undefined) {
      return profile.distance <= maxDistance;
    }
    
    // If we have custom location and it matches profile location
    if (customLocation && profile.location) {
      return customLocation === profile.location;
    }
    
    return true;
  });

  const handleSwipe = (profileId: string, action: 'like' | 'reject' | 'save') => {
    // Record the swipe action
    if (action !== 'save') {
      recordSwipe("current-user", profileId, action);
    }
    
    // Add to swiped profiles
    setSwipedProfiles(prev => new Set([...prev, profileId]));
    
    // Handle save action
    if (action === 'save') {
      setSavedProfiles(prev => new Set([...prev, profileId]));
      return;
    }
    
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
  
  const handleSendIntro = (profileId: string, message: string) => {
    // Pass the intro message to the parent component
    onSendIntro(profileId, message);
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

  const availableProfiles = filteredProfiles.filter(p => !swipedProfiles.has(p.id));
  const currentProfile = availableProfiles[currentIndex];
  const showRefreshButton = currentIndex >= availableProfiles.length || availableProfiles.length === 0;

  // Popular cities for networking
  const popularLocations = [
    { value: "", label: "My Current Location" },
    { value: "New York", label: "New York" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "London", label: "London" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Singapore", label: "Singapore" },
    { value: "Berlin", label: "Berlin" },
    { value: "Sydney", label: "Sydney" },
  ];

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
      {/* Location Filter Controls */}
      <div className="mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="location-toggle" 
              checked={locationEnabled}
              onCheckedChange={setLocationEnabled}
            />
            <Label htmlFor="location-toggle" className="font-medium">
              Location-based matching
            </Label>
          </div>
          {userLocation && (
            <div className="text-xs text-muted-foreground flex items-center">
              <MapPin size={12} className="mr-1 text-blue-500" />
              Location active
            </div>
          )}
        </div>
        
        {locationEnabled && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-location" className="text-sm mb-1 block">
                Networking location
              </Label>
              <Select 
                value={customLocation} 
                onValueChange={setCustomLocation}
              >
                <SelectTrigger id="custom-location" className="w-full">
                  <SelectValue placeholder="Use my current location" />
                </SelectTrigger>
                <SelectContent>
                  {popularLocations.map(location => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                      {location.value === "" && userLocation && (
                        <span className="ml-1 text-xs opacity-70">
                          (detected)
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="distance-slider" className="text-sm">
                  Maximum distance
                </Label>
                <span className="text-sm font-medium">
                  {maxDistance} km
                </span>
              </div>
              <Slider
                id="distance-slider"
                defaultValue={[maxDistance]}
                max={100}
                step={5}
                disabled={!!customLocation}
                onValueChange={(value) => setMaxDistance(value[0])}
                className={customLocation ? "opacity-50" : ""}
              />
              {customLocation && (
                <p className="text-xs text-muted-foreground mt-1">
                  Distance filter is disabled when a custom location is selected
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showRefreshButton ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No more profiles to show</h3>
          <p className="text-muted-foreground mb-6">Check back later or refresh to see if there are new matches!</p>
          <Button 
            onClick={handleRefresh} 
            className="px-6"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Find More Matches'}
          </Button>
        </div>
      ) : (
        <div className="relative h-[600px]">
          {/* Show up to 3 cards with the current card on top */}
          {availableProfiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              onSendIntro={handleSendIntro}
              isActive={index === 0}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SwipeContainer;
