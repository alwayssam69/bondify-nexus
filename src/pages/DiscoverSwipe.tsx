
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, RefreshCw } from 'lucide-react';
import SwipeMatchContainer from '@/components/SwipeMatchContainer';
import { useLocation } from '@/hooks/useLocation';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { useGeoMatchmaking } from '@/hooks/useGeoMatchmaking';
import { UserProfile } from '@/lib/matchmaking';

const DiscoverSwipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [useLocationMatching, setUseLocationMatching] = useState(false);
  const [radius, setRadius] = useState(25);
  
  // Location hook
  const { 
    requestLocation, 
    latitude, 
    longitude, 
    error: locationError 
  } = useLocation(false);
  
  // Regular matchmaking for skill-based matches
  const { 
    matches: skillMatches, 
    isLoading: skillLoading,
    error: skillError,
    refreshMatches: refreshSkillMatches
  } = useMatchmaking({ 
    filters: {
      helpType: 'need',
      industry: '',
      skills: [],
      relationshipGoal: 'networking',
      experienceLevel: '',
      useLocation: false
    },
    enabled: !useLocationMatching
  });
  
  // Geo-based matchmaking
  const {
    matches: geoMatches,
    isLoading: geoLoading,
    error: geoError,
    refetch: refreshGeoMatches,
    expandSearchRadius
  } = useGeoMatchmaking({
    radiusKm: radius,
    enabled: useLocationMatching && Boolean(latitude && longitude)
  });
  
  // Combined state
  const isLoading = useLocationMatching ? geoLoading : skillLoading;
  const error = useLocationMatching ? geoError : skillError;
  const matches = useLocationMatching ? geoMatches : skillMatches;
  
  const handleSwitchLocation = async (checked: boolean) => {
    if (checked) {
      const success = await requestLocation();
      if (!success) {
        toast.error("Please enable location access for nearby matching");
        return;
      }
      toast.success("Using location for matching");
    }
    setUseLocationMatching(checked);
  };
  
  const handleRefresh = () => {
    if (useLocationMatching) {
      refreshGeoMatches();
    } else {
      refreshSkillMatches();
    }
    toast.info("Finding new matches...");
  };
  
  const handleExpandRadius = () => {
    const newRadius = expandSearchRadius();
    setRadius(newRadius);
    refreshGeoMatches();
  };
  
  const handleSwipeLeft = (profile: UserProfile) => {
    console.log("Passed on", profile.name);
  };
  
  const handleSwipeRight = (profile: UserProfile) => {
    console.log("Liked", profile.name);
    toast.success(`You liked ${profile.name}!`);
  };
  
  const handleSaveProfile = (profile: UserProfile) => {
    console.log("Saved", profile.name);
    toast.success(`Saved ${profile.name} to favorites`);
  };
  
  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Discover</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-6 bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Switch 
              checked={useLocationMatching} 
              onCheckedChange={handleSwitchLocation} 
              id="location-switch"
            />
            <label 
              htmlFor="location-switch" 
              className="ml-2 cursor-pointer text-sm font-medium"
            >
              Use location for matching
            </label>
          </div>
          
          {useLocationMatching && latitude && longitude && (
            <div className="text-xs text-muted-foreground flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Location active
            </div>
          )}
        </div>
        
        {useLocationMatching && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Distance ({radius} km)</span>
              <span className="text-sm text-muted-foreground">{radius === 100 ? 'Max' : `${radius} km`}</span>
            </div>
            <Slider
              value={[radius]}
              min={5}
              max={100}
              step={5}
              onValueChange={(values) => setRadius(values[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Nearby</span>
              <span>Distant</span>
            </div>
          </div>
        )}
      </div>
      
      <SwipeMatchContainer 
        profiles={matches}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSave={handleSaveProfile}
        isLoading={isLoading}
        onFindMore={useLocationMatching ? handleExpandRadius : handleRefresh}
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {useLocationMatching 
            ? "Showing people near you based on your location and preferences" 
            : "Showing people who match your interests and industry preferences"}
        </p>
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default DiscoverSwipe;
