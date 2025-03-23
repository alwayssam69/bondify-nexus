import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/lib/matchmaking";
import { getMatchRecommendations, getProximityMatches, getConfirmedMatches, getSavedProfiles } from "@/services/MatchmakingService";
import MatchCardConnectable from "@/components/MatchCardConnectable";
import MatchCardSimple from "@/components/MatchCardSimple";
import { supabase } from "@/integrations/supabase/client";

const Matches = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("discover");
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [confirmedMatches, setConfirmedMatches] = useState<UserProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConfirmed, setIsLoadingConfirmed] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("any");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [radiusInKm, setRadiusInKm] = useState<number>(50);
  
  // Available industries for filtering
  const industries = [
    "technology", "finance", "healthcare", "education", 
    "marketing", "design", "legal", "business", "engineering"
  ];
  
  // Experience levels for filtering
  const experienceLevels = [
    { value: "any", label: "Any Level" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" }
  ];
  
  useEffect(() => {
    const loadMatches = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let matchResults;
        
        if (locationEnabled && userCoordinates) {
          // Get matches by proximity if location is enabled
          matchResults = await getProximityMatches(
            user.id,
            radiusInKm,
            50 // Limit
          );
        } else {
          // Otherwise get regular matches
          matchResults = await getMatchRecommendations(user.id, 50);
        }
        
        setMatches(matchResults);
      } catch (error) {
        console.error("Error loading matches:", error);
        toast.error("Failed to load matches");
      } finally {
        setIsLoading(false);
      }
    };

    // Load matches when user logs in or filters change
    if (user) {
      loadMatches();
      
      // Set up real-time listener for new matches
      const channel = supabase
        .channel('public:user_profiles')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'user_profiles' }, 
          () => {
            // Reload matches when a new user is created
            loadMatches();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, locationEnabled, userCoordinates, radiusInKm]);
  
  // Load confirmed matches when tab changes
  useEffect(() => {
    const loadConfirmedMatches = async () => {
      if (!user || activeTab !== "matches") return;
      
      setIsLoadingConfirmed(true);
      try {
        const matchResults = await getConfirmedMatches(user.id);
        setConfirmedMatches(matchResults);
      } catch (error) {
        console.error("Error loading confirmed matches:", error);
      } finally {
        setIsLoadingConfirmed(false);
      }
    };
    
    loadConfirmedMatches();
  }, [user, activeTab]);
  
  // Load saved profiles when tab changes
  useEffect(() => {
    const loadSavedProfiles = async () => {
      if (!user || activeTab !== "saved") return;
      
      setIsLoadingSaved(true);
      try {
        // Get saved profile IDs
        const savedIds = await getSavedProfiles(user.id);
        
        if (savedIds.length === 0) {
          setSavedProfiles([]);
          return;
        }
        
        // Get full profiles for saved IDs
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', savedIds);
          
        if (error) {
          console.error("Error fetching saved profiles:", error);
          return;
        }
        
        // Transform to UserProfile format
        const savedProfilesData = data.map(profile => ({
          id: profile.id,
          name: profile.full_name,
          age: estimateAgeFromExperienceLevel(profile.experience_level),
          gender: profile.gender || "unspecified",
          location: profile.location || "",
          interests: profile.interests || [],
          bio: profile.bio || "",
          relationshipGoal: "networking",
          skills: profile.skills || [],
          language: "English",
          imageUrl: profile.image_url || "",
          industry: profile.industry || "",
          userType: profile.user_type || "",
          experienceLevel: profile.experience_level || "",
          activityScore: profile.activity_score || 75,
          profileCompleteness: profile.profile_completeness || 80,
        }));
        
        setSavedProfiles(savedProfilesData);
      } catch (error) {
        console.error("Error loading saved profiles:", error);
      } finally {
        setIsLoadingSaved(false);
      }
    };
    
    loadSavedProfiles();
  }, [user, activeTab]);
  
  // Request user location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationEnabled(true);
          toast.success("Location enabled for better matches");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not access your location");
          setLocationEnabled(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };
  
  // Helper function to estimate age based on experience level
  const estimateAgeFromExperienceLevel = (experienceLevel: string | null): number => {
    switch (experienceLevel) {
      case 'beginner':
        return 20 + Math.floor(Math.random() * 5);
      case 'intermediate':
        return 25 + Math.floor(Math.random() * 5);
      case 'expert':
        return 30 + Math.floor(Math.random() * 10);
      default:
        return 25 + Math.floor(Math.random() * 10);
    }
  };
  
  // Handle match actions (like, pass, save)
  const handleMatchAction = (profileId: string, action: "like" | "pass" | "save") => {
    // This would be handled by the MatchCardConnectable component
    // which would call the appropriate API
    
    if (action === "like") {
      toast.success("You liked this profile!");
    } else if (action === "pass") {
      toast.info("Profile skipped");
    } else if (action === "save") {
      toast.success("Profile saved for later");
    }
    
    // Remove the profile from the current list
    setMatches(prev => prev.filter(p => p.id !== profileId));
  };
  
  // Filter matches based on search and filters
  const filteredMatches = matches.filter(profile => {
    // Search term filter
    if (searchTerm && !profile.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !profile.industry?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Industry filter
    if (selectedIndustries.length > 0 && 
        !selectedIndustries.includes(profile.industry?.toLowerCase() || '')) {
      return false;
    }
    
    // Experience level filter
    if (experienceLevel !== "any" && profile.experienceLevel !== experienceLevel) {
      return false;
    }
    
    // Location filter
    if (locationFilter && !profile.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(prev => prev.filter(i => i !== industry));
    } else {
      setSelectedIndustries(prev => [...prev, industry]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Connections</h1>
          <p className="text-muted-foreground mt-1">
            Discover and connect with professionals in your network
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate("/chat")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Messages
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="matches">My Connections</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, industry, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                variant={filterExpanded ? "default" : "outline"} 
                onClick={() => setFilterExpanded(!filterExpanded)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
                {selectedIndustries.length > 0 || experienceLevel !== "any" || locationFilter ? (
                  <Badge variant="secondary" className="ml-2">
                    {selectedIndustries.length + (experienceLevel !== "any" ? 1 : 0) + (locationFilter ? 1 : 0)}
                  </Badge>
                ) : null}
              </Button>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={locationEnabled} 
                  onCheckedChange={(checked) => {
                    if (checked && !userCoordinates) {
                      requestLocation();
                    } else {
                      setLocationEnabled(checked);
                    }
                  }}
                />
                <span className="text-sm">Nearby</span>
              </div>
            </div>
            
            {filterExpanded && (
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Industry</h3>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(industry => (
                      <Badge 
                        key={industry}
                        variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleIndustry(industry)}
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Experience Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map(level => (
                      <Badge 
                        key={level.value}
                        variant={experienceLevel === level.value ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setExperienceLevel(level.value)}
                      >
                        {level.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Location</h3>
                  <Input
                    placeholder="Filter by city or region..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                {locationEnabled && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Distance (km)</h3>
                      <span>{radiusInKm} km</span>
                    </div>
                    <Slider
                      value={[radiusInKm]}
                      min={5}
                      max={100}
                      step={5}
                      onValueChange={(value) => setRadiusInKm(value[0])}
                      className="max-w-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-lg mt-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Matches Found Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any matches based on your current filters. Try adjusting your search criteria or check back later.
              </p>
              <Button 
                onClick={() => {
                  setFilterExpanded(true);
                  setSelectedIndustries([]);
                  setExperienceLevel('any');
                  setLocationFilter('');
                }} 
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredMatches.map(profile => (
                <MatchCardConnectable
                  key={profile.id}
                  profile={profile}
                  onAction={handleMatchAction}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="matches">
          {isLoadingConfirmed ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : confirmedMatches.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Connections Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't connected with anyone yet. Discover and match with professionals to build your network.
              </p>
              <Button onClick={() => setActiveTab("discover")}>
                Find Connections
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {confirmedMatches.map(profile => (
                <MatchCardSimple
                  key={profile.id}
                  profile={profile}
                  onViewProfile={() => navigate(`/profile/${profile.id}`)}
                  onMessage={() => navigate(`/chat?contact=${profile.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          {isLoadingSaved ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : savedProfiles.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Saved Profiles</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't saved any profiles yet. Save profiles you're interested in to review them later.
              </p>
              <Button onClick={() => setActiveTab("discover")}>
                Discover Profiles
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProfiles.map(profile => (
                <MatchCardSimple
                  key={profile.id}
                  profile={profile}
                  onViewProfile={() => navigate(`/profile/${profile.id}`)}
                  onMessage={() => navigate(`/chat?contact=${profile.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
