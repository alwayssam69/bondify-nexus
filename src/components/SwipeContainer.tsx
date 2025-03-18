
import React, { useState, useEffect } from "react";
import SwipeCard from "@/components/SwipeCard";
import { UserProfile, recordSwipe } from '@/lib/matchmaking';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Globe, Sparkles, Sliders, Check, Building, GraduationCap, Users } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

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
  const [distanceUnit, setDistanceUnit] = useState<'km'|'mi'>('km');
  const [locationRange, setLocationRange] = useState<'local'|'regional'|'country'|'global'>('local');
  const [customLocation, setCustomLocation] = useState("");
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [locationPermissionState, setLocationPermissionState] = useState<'prompt'|'granted'|'denied'>('prompt');
  const [universityMode, setUniversityMode] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [interUniversityNetworking, setInterUniversityNetworking] = useState(false);
  const [projectPartnerMode, setProjectPartnerMode] = useState(false);
  const [courseYear, setCourseYear] = useState("");
  const [projectInterests, setProjectInterests] = useState<string[]>([]);
  const [showUniversitySettings, setShowUniversitySettings] = useState(false);
  
  useEffect(() => {
    // Check for previously stored permission state
    const storedPermissionState = localStorage.getItem('locationPermissionState');
    if (storedPermissionState) {
      setLocationPermissionState(storedPermissionState as 'prompt'|'granted'|'denied');
    }
    
    // If permission was previously granted, try to get location
    if (storedPermissionState === 'granted' && locationEnabled) {
      requestAndSetLocation();
    } else if (storedPermissionState === 'prompt') {
      // Show location permission dialog
      requestLocationPermission();
    }
  }, []);
  
  const requestLocationPermission = () => {
    toast.info(
      "Location access helps find matches near you",
      {
        action: {
          label: "Allow",
          onClick: () => requestAndSetLocation(),
        },
        description: "You can manually set your location if you prefer",
        duration: 10000,
      }
    );
  };
  
  const requestAndSetLocation = () => {
    if (navigator.geolocation) {
      toast.loading("Detecting your location...", { id: "location-loading" });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
          setLocationPermissionState('granted');
          localStorage.setItem('locationPermissionState', 'granted');
          
          toast.dismiss("location-loading");
          toast.success("Location detected successfully", {
            description: "You'll see matches in your area.",
            duration: 3000,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermissionState('denied');
          localStorage.setItem('locationPermissionState', 'denied');
          
          toast.dismiss("location-loading");
          toast.error("Unable to get your location", {
            description: "Please set your location manually.",
            duration: 4000,
          });
        }
      );
    }
  };
  
  useEffect(() => {
    if (!locationEnabled) return;
    
    // Only auto-refresh if permission is granted
    if (locationPermissionState !== 'granted') return;
    
    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position.coords);
            toast.info("Your location has been updated", { 
              description: "You'll continue to see the most relevant matches.",
              duration: 2000 
            });
          },
          (error) => {
            console.error("Error refreshing location:", error);
          }
        );
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(locationInterval);
  }, [locationEnabled, locationPermissionState]);
  
  const filteredProfiles = profiles.filter(profile => {
    // University filtering
    if (universityMode) {
      if (selectedUniversity && profile.university) {
        if (!interUniversityNetworking) {
          // Only show profiles from the same university
          if (profile.university !== selectedUniversity) return false;
        }
      }
    }
    
    // Project partner filtering
    if (projectPartnerMode) {
      if (courseYear && profile.courseYear && profile.courseYear !== courseYear) {
        return false;
      }
      
      if (projectInterests.length > 0 && profile.projectInterests) {
        const hasMatchingInterest = projectInterests.some(interest => 
          profile.projectInterests?.includes(interest)
        );
        if (!hasMatchingInterest) return false;
      }
    }
    
    // Location filtering
    if (!locationEnabled) return true;
    
    if (userLocation && profile.distance !== undefined) {
      const distance = distanceUnit === 'mi' ? profile.distance * 0.621371 : profile.distance;
      
      switch(locationRange) {
        case 'local':
          return distance <= maxDistance;
        case 'regional':
          return distance <= maxDistance * 3;
        case 'country':
          return true;
        case 'global':
          return true;
        default:
          return distance <= maxDistance;
      }
    }
    
    if (customLocation && profile.location) {
      return customLocation === profile.location;
    }
    
    return true;
  });

  const handleSwipe = (profileId: string, action: 'like' | 'reject' | 'save') => {
    if (action !== 'save') {
      recordSwipe("current-user", profileId, action);
    }
    
    setSwipedProfiles(prev => new Set([...prev, profileId]));
    
    if (action === 'save') {
      setSavedProfiles(prev => new Set([...prev, profileId]));
      return;
    }
    
    if (action === 'like') {
      if (Math.random() < 0.3) {
        const matchedProfile = profiles.find(p => p.id === profileId);
        if (matchedProfile) {
          recordSwipe(profileId, "current-user", 'like');
          toast.success(`You matched with ${matchedProfile.name}!`, {
            description: "You can now start connecting!",
            position: "top-center",
            duration: 5000,
          });
          onNewMatch(matchedProfile);
        }
      }
    }
    
    setCurrentIndex(prev => prev + 1);
  };
  
  const handleSendIntro = (profileId: string, message: string) => {
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

  const locationRangeOptions = [
    { value: "local", label: "Nearby (Local)" },
    { value: "regional", label: "Extended Area" },
    { value: "country", label: "Country-wide" },
    { value: "global", label: "Global" },
  ];

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
    { value: "Toronto", label: "Toronto" },
    { value: "Tokyo", label: "Tokyo" },
    { value: "Shanghai", label: "Shanghai" },
    { value: "Paris", label: "Paris" },
    { value: "Dubai", label: "Dubai" },
  ];
  
  const indianUniversities = [
    { value: "", label: "Select University/College" },
    { value: "IIT Delhi", label: "IIT Delhi" },
    { value: "IIT Bombay", label: "IIT Bombay" },
    { value: "IIT Madras", label: "IIT Madras" },
    { value: "IIT Kanpur", label: "IIT Kanpur" },
    { value: "IIT Kharagpur", label: "IIT Kharagpur" },
    { value: "BITS Pilani", label: "BITS Pilani" },
    { value: "Delhi University", label: "Delhi University" },
    { value: "Jadavpur University", label: "Jadavpur University" },
    { value: "Manipal Institute of Technology", label: "Manipal Institute of Technology" },
    { value: "NIT Trichy", label: "NIT Trichy" },
    { value: "NIT Warangal", label: "NIT Warangal" },
    { value: "VIT Vellore", label: "VIT Vellore" },
    { value: "IIIT Hyderabad", label: "IIIT Hyderabad" },
    { value: "SRM University", label: "SRM University" },
    { value: "Jamia Millia Islamia", label: "Jamia Millia Islamia" },
    { value: "Amity University", label: "Amity University" },
    { value: "Christ University", label: "Christ University" },
    { value: "Symbiosis International University", label: "Symbiosis International University" },
    { value: "Loyola College", label: "Loyola College" },
  ];
  
  const courseYears = [
    { value: "", label: "Select Year" },
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
    { value: "5th Year", label: "5th Year" },
    { value: "Masters", label: "Masters" },
    { value: "PhD", label: "PhD" },
  ];
  
  const projectInterestOptions = [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-app", label: "Mobile App Development" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "data-science", label: "Data Science" },
    { value: "blockchain", label: "Blockchain" },
    { value: "iot", label: "Internet of Things" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "ar-vr", label: "AR/VR" },
    { value: "game-dev", label: "Game Development" },
    { value: "robotics", label: "Robotics" },
    { value: "ui-ux", label: "UI/UX Design" },
    { value: "research", label: "Research" },
  ];

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

  const settingsPanelVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto relative py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6 bg-background/70 backdrop-blur-md p-5 rounded-xl shadow-md border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id="location-toggle" 
              checked={locationEnabled}
              onCheckedChange={setLocationEnabled}
              className="data-[state=checked]:bg-primary/90 data-[state=checked]:border-primary/50"
            />
            <Label htmlFor="location-toggle" className="font-medium flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-primary" />
              Location-based matching
            </Label>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowLocationSettings(!showLocationSettings)}
            className="text-xs flex items-center gap-1 h-8 px-2 hover:bg-muted/50"
          >
            <Sliders className="h-3.5 w-3.5" />
            {showLocationSettings ? "Hide settings" : "Show settings"}
          </Button>
        </div>
        
        {userLocation && (
          <div className="text-xs flex items-center gap-1 text-muted-foreground bg-primary/5 py-1.5 px-3 rounded-md mb-3 w-fit">
            <MapPin size={12} className="text-primary" />
            <span>Location active · Finding nearby matches</span>
          </div>
        )}
        
        {locationPermissionState === 'denied' && (
          <div className="text-xs flex items-center gap-1 text-amber-600 bg-amber-50 py-1.5 px-3 rounded-md mb-3 w-fit">
            <MapPin size={12} className="text-amber-600" />
            <span>Location access denied · Using manual location</span>
          </div>
        )}
        
        {locationEnabled && (
          <motion.div 
            className="space-y-4"
            variants={settingsPanelVariants}
            initial={showLocationSettings ? "visible" : "hidden"}
            animate={showLocationSettings ? "visible" : "hidden"}
          >
            <div className="pt-2">
              <Label htmlFor="location-range" className="text-sm mb-1.5 block">
                Location range
              </Label>
              <Select 
                value={locationRange} 
                onValueChange={(val) => setLocationRange(val as any)}
              >
                <SelectTrigger id="location-range" className="w-full border-border/60 bg-background/80 hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select location range" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur border-border/50">
                  {locationRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {locationRange === 'local' && 'Find matches within your immediate area'}
                {locationRange === 'regional' && 'Expand your search to a wider region'}
                {locationRange === 'country' && 'Find matches anywhere in your country'}
                {locationRange === 'global' && 'No location restrictions applied'}
              </p>
            </div>
            
            <div className="pt-2">
              <Label htmlFor="custom-location" className="text-sm mb-1.5 block">
                Networking location
              </Label>
              <Select 
                value={customLocation} 
                onValueChange={setCustomLocation}
              >
                <SelectTrigger id="custom-location" className="w-full border-border/60 bg-background/80 hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Use my current location" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur border-border/50">
                  {popularLocations.map(location => (
                    <SelectItem key={location.value} value={location.value} className="cursor-pointer">
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
                <Label htmlFor="distance-slider" className="text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Maximum distance
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {maxDistance} {distanceUnit}
                  </span>
                  <div className="flex border border-border/50 rounded-md overflow-hidden text-xs">
                    <button 
                      className={`px-2 py-0.5 ${distanceUnit === 'km' ? 'bg-primary/20 font-medium' : 'bg-background'}`}
                      onClick={() => setDistanceUnit('km')}
                    >
                      km
                    </button>
                    <button 
                      className={`px-2 py-0.5 ${distanceUnit === 'mi' ? 'bg-primary/20 font-medium' : 'bg-background'}`}
                      onClick={() => setDistanceUnit('mi')}
                    >
                      mi
                    </button>
                  </div>
                </div>
              </div>
              <Slider
                id="distance-slider"
                value={[maxDistance]}
                max={locationRange === 'local' ? 100 : locationRange === 'regional' ? 300 : 1000}
                step={locationRange === 'local' ? 5 : locationRange === 'regional' ? 25 : 100}
                disabled={!!customLocation || locationRange === 'country' || locationRange === 'global'}
                onValueChange={(value) => setMaxDistance(value[0])}
                className={
                  customLocation || locationRange === 'country' || locationRange === 'global' 
                    ? "opacity-50" 
                    : ""
                }
              />
              {(customLocation || locationRange === 'country' || locationRange === 'global') && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Check className="h-3 w-3 text-amber-500" />
                  {customLocation ? "Using custom location instead of distance filter" : 
                   locationRange === 'country' ? "Showing all profiles in your country" :
                   "Showing profiles globally without distance restriction"}
                </p>
              )}
            </div>
          </motion.div>
        )}
        
        {/* University-based networking */}
        <div className="mt-6 pt-5 border-t border-border/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="university-toggle" 
                checked={universityMode}
                onCheckedChange={setUniversityMode}
                className="data-[state=checked]:bg-primary/90 data-[state=checked]:border-primary/50"
              />
              <Label htmlFor="university-toggle" className="font-medium flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary" />
                University networking
              </Label>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowUniversitySettings(!showUniversitySettings)}
              className="text-xs flex items-center gap-1 h-8 px-2 hover:bg-muted/50"
              disabled={!universityMode}
            >
              <Sliders className="h-3.5 w-3.5" />
              {showUniversitySettings ? "Hide options" : "Show options"}
            </Button>
          </div>
          
          {universityMode && (
            <motion.div 
              className="space-y-4"
              variants={settingsPanelVariants}
              initial={showUniversitySettings ? "visible" : "hidden"}
              animate={showUniversitySettings ? "visible" : "hidden"}
            >
              <div>
                <Label htmlFor="university-select" className="text-sm mb-1.5 block">
                  Your university/college
                </Label>
                <Select 
                  value={selectedUniversity} 
                  onValueChange={setSelectedUniversity}
                >
                  <SelectTrigger id="university-select" className="w-full border-border/60 bg-background/80 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select university/college" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur border-border/50">
                    {indianUniversities.map(uni => (
                      <SelectItem key={uni.value} value={uni.value} className="cursor-pointer">
                        {uni.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="inter-university-toggle" 
                  checked={interUniversityNetworking}
                  onCheckedChange={setInterUniversityNetworking}
                  disabled={!selectedUniversity}
                  className="data-[state=checked]:bg-primary/90 data-[state=checked]:border-primary/50"
                />
                <Label 
                  htmlFor="inter-university-toggle" 
                  className={`font-medium text-sm ${!selectedUniversity ? 'text-muted-foreground' : ''}`}
                >
                  Enable inter-university networking
                </Label>
              </div>
              
              {!selectedUniversity && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 bg-amber-50 p-2 rounded">
                  Please select your university to continue
                </p>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Project partner matching */}
        <div className="mt-6 pt-5 border-t border-border/30">
          <div className="flex items-center space-x-2">
            <Switch 
              id="project-toggle" 
              checked={projectPartnerMode}
              onCheckedChange={setProjectPartnerMode}
              className="data-[state=checked]:bg-primary/90 data-[state=checked]:border-primary/50"
            />
            <Label htmlFor="project-toggle" className="font-medium flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              Find study/project partners
            </Label>
          </div>
          
          {projectPartnerMode && (
            <motion.div 
              className="space-y-4 mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: "auto",
                transition: { duration: 0.3 }
              }}
            >
              <div>
                <Label htmlFor="course-year" className="text-sm mb-1.5 block">
                  Your course year
                </Label>
                <Select 
                  value={courseYear} 
                  onValueChange={setCourseYear}
                >
                  <SelectTrigger id="course-year" className="w-full border-border/60 bg-background/80 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur border-border/50">
                    {courseYears.map(year => (
                      <SelectItem key={year.value} value={year.value} className="cursor-pointer">
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm mb-1.5 block">
                  Project interests
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {projectInterestOptions.map(interest => (
                    <div 
                      key={interest.value} 
                      className={`p-2 rounded-md text-sm cursor-pointer border transition-all
                        ${projectInterests.includes(interest.value) 
                          ? 'bg-primary/10 border-primary/30 font-medium' 
                          : 'bg-background border-border/40 hover:border-primary/20'
                        }`}
                      onClick={() => {
                        if (projectInterests.includes(interest.value)) {
                          setProjectInterests(prev => prev.filter(i => i !== interest.value));
                        } else {
                          setProjectInterests(prev => [...prev, interest.value]);
                        }
                      }}
                    >
                      {interest.label}
                    </div>
                  ))}
                </div>
                {projectInterests.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Select at least one project interest
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {showRefreshButton ? (
        <motion.div 
          className="flex flex-col items-center justify-center p-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-muted-foreground animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No more profiles to show</h3>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Check back later or refresh to see if there are new matches in your area!
          </p>
          <Button 
            onClick={handleRefresh} 
            className="px-6 py-6 h-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Find More Matches'}
          </Button>
        </motion.div>
      ) : (
        <div className="relative h-[600px]">
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
