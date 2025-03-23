
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MatchCardConnectable from "@/components/match-card/MatchCardConnectable";
import { UserProfile } from "@/lib/matchmaking";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchRecommendations, getProximityMatches, updateUserCoordinates } from "@/services/MatchmakingAPI";
import { Loader2, MapPin, Filter, Users, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast: uiToast } = useToast();
  const [recommendedMatches, setRecommendedMatches] = useState<UserProfile[]>([]);
  const [nearbyMatches, setNearbyMatches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recommended");
  const [radius, setRadius] = useState(50);
  const [professionFilter, setProfessionFilter] = useState<string>("");
  const [skillFilter, setSkillFilter] = useState<string>("");
  
  // Use geolocation with error toasts enabled
  const geolocation = useGeolocation({ 
    watch: false, 
    showErrorToasts: true,
    enableHighAccuracy: true
  });

  useEffect(() => {
    // Instead of waiting for geolocation, load what we can immediately
    loadMatchData();
    
    // If geolocation becomes available, update user coordinates
    if (geolocation.latitude && geolocation.longitude && !geolocation.error) {
      updateUserLocationCoordinates(geolocation.latitude, geolocation.longitude);
    }
  }, [user, geolocation.latitude, geolocation.longitude]);

  const loadMatchData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Use Promise.allSettled to load both data types in parallel
      const results = await Promise.allSettled([
        getMatchRecommendations(user.id, 10),
        geolocation.latitude && geolocation.longitude 
          ? getProximityMatches(user.id, radius, 10) 
          : Promise.resolve([])
      ]);
      
      // Handle recommended matches result
      if (results[0].status === 'fulfilled') {
        setRecommendedMatches(results[0].value);
      } else {
        console.error("Error loading recommended matches:", results[0].reason);
        toast.error("Couldn't load recommended matches");
      }
      
      // Handle nearby matches result
      if (results[1].status === 'fulfilled') {
        setNearbyMatches(results[1].value);
      }
      
    } catch (error) {
      console.error("Error loading match data:", error);
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserLocationCoordinates = async (latitude: number, longitude: number) => {
    if (!user?.id) return;
    
    try {
      const success = await updateUserCoordinates(user.id, latitude, longitude);
      if (success) {
        // Only toast on manual updates
        // toast.success("Location updated successfully!");
        const proximityData = await getProximityMatches(user.id, radius, 10);
        setNearbyMatches(proximityData);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update your location");
    }
  };

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      toast.info("Updating your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateUserLocationCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Failed to get your location";
          
          switch (error.code) {
            case 1:
              errorMessage = "Location access denied. Please allow access in your browser settings.";
              break;
            case 2:
              errorMessage = "Location unavailable. Please try again.";
              break;
            case 3:
              errorMessage = "Location request timed out. Please try again.";
              break;
          }
          
          toast.error(errorMessage);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleViewProfile = (id: string) => {
    console.log("View profile:", id);
  };

  const handleConnectRequest = async (id: string) => {
    toast.success("Connection request sent!");
  };

  const handleRefreshMatches = () => {
    loadMatchData();
    toast.info("Refreshing your matches...");
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    
    if (user?.id && geolocation.latitude && geolocation.longitude) {
      try {
        getProximityMatches(user.id, newRadius, 10).then(data => {
          setNearbyMatches(data);
        });
      } catch (error) {
        console.error("Error updating matches for new radius:", error);
      }
    }
  };

  const filteredNearbyMatches = nearbyMatches.filter(profile => {
    let matches = true;
    
    if (professionFilter && profile.userType) {
      matches = matches && profile.userType.toLowerCase() === professionFilter.toLowerCase();
    }
    
    if (skillFilter && profile.skills && profile.skills.length > 0) {
      matches = matches && profile.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }
    
    return matches;
  });

  const filteredRecommendedMatches = recommendedMatches.filter(profile => {
    let matches = true;
    
    if (professionFilter && profile.userType) {
      matches = matches && profile.userType.toLowerCase() === professionFilter.toLowerCase();
    }
    
    if (skillFilter && profile.skills && profile.skills.length > 0) {
      matches = matches && profile.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }
    
    return matches;
  });

  const professions = [
    "Professional", 
    "Student", 
    "Mentor", 
    "Founder", 
    "Investor", 
    "Freelancer", 
    "Collaborator"
  ];

  const commonSkills = [
    "JavaScript",
    "React",
    "UI/UX",
    "Project Management",
    "Marketing",
    "Business Development",
    "Data Science",
    "Machine Learning",
    "Product Management",
    "Finance"
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Professional Network</h1>
            <p className="text-muted-foreground mt-1">
              Find and connect with professionals that match your networking goals
            </p>
          </div>
          <Button 
            onClick={handleRefreshMatches} 
            className="mt-4 md:mt-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Matches
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Filter by Profession</label>
            <Select onValueChange={setProfessionFilter} value={professionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Professions</SelectItem>
                {professions.map(profession => (
                  <SelectItem key={profession} value={profession.toLowerCase()}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Filter by Skill</label>
            <Select onValueChange={setSkillFilter} value={skillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Skills</SelectItem>
                {commonSkills.map(skill => (
                  <SelectItem key={skill} value={skill.toLowerCase()}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end">
            <Button 
              variant="outline" 
              onClick={handleUpdateLocation}
              className="w-full md:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Update Location
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="recommended" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Recommended</span>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Nearby</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRecommendedMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendedMatches.map((profile, index) => (
                  <MatchCardConnectable
                    key={profile.id}
                    profile={profile}
                    delay={index * 100}
                    onViewProfile={() => handleViewProfile(profile.id)}
                    onConnect={() => handleConnectRequest(profile.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  {professionFilter || skillFilter ? 
                    "Try adjusting your filters to see more results" : 
                    "Complete your profile to help us find better matches for you"}
                </p>
                <Button>Update Profile</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nearby" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        Showing professionals within {radius} km
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <Slider
                      defaultValue={[radius]}
                      max={100}
                      min={5}
                      step={5}
                      onValueChange={handleRadiusChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5 km</span>
                      <span>50 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                </div>
                
                {filteredNearbyMatches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNearbyMatches.map((profile, index) => (
                      <MatchCardConnectable
                        key={profile.id}
                        profile={profile}
                        delay={index * 100}
                        onViewProfile={() => handleViewProfile(profile.id)}
                        onConnect={() => handleConnectRequest(profile.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No nearby professionals found</h3>
                    <p className="text-muted-foreground mb-4">
                      {!geolocation.latitude || !geolocation.longitude ? 
                        "We need your location to find nearby matches" : 
                        "Try increasing your search radius or check back later"}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleUpdateLocation}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Update Location
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
