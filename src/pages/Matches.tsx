
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/lib/matchmaking";
import { supabase } from "@/integrations/supabase/client";
import MatchCardConnectable from "@/components/match-card/MatchCardConnectable";
import MatchCardSimple from "@/components/MatchCardSimple";
import { Loader2 } from "lucide-react";
import FindMatchButton from "@/components/matchmaking/FindMatchButton";

const Matches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  
  const industries = [
    "technology", "finance", "healthcare", "education", 
    "marketing", "design", "legal", "business", "engineering"
  ];
  
  const experienceLevels = [
    { value: "any", label: "Any Level" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" }
  ];
  
  useEffect(() => {
    if (searchParams.has('industry')) {
      setSelectedIndustries([searchParams.get('industry') || '']);
    }
    
    if (searchParams.has('experienceLevel') && searchParams.get('experienceLevel') !== 'select-level') {
      setExperienceLevel(searchParams.get('experienceLevel') || 'any');
    }
    
    if (searchParams.has('distance')) {
      setRadiusInKm(parseInt(searchParams.get('distance') || '50'));
    }
    
    if (searchParams.has('lat') && searchParams.has('lng')) {
      setUserCoordinates({
        lat: parseFloat(searchParams.get('lat') || '0'),
        lng: parseFloat(searchParams.get('lng') || '0')
      });
      setLocationEnabled(true);
    }
  }, [searchParams]);
  
  useEffect(() => {
    const loadMatches = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let query = supabase
          .from('user_profiles')
          .select('*')
          .neq('id', user.id)
          .limit(50);
        
        if (selectedIndustries.length > 0) {
          query = query.in('industry', selectedIndustries);
        }
        
        if (experienceLevel !== 'any') {
          query = query.eq('experience_level', experienceLevel);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        const userProfiles = data.map((profile): UserProfile => ({
          id: profile.id,
          name: profile.full_name || 'Anonymous User',
          age: estimateAgeFromExperienceLevel(profile.experience_level),
          gender: "unspecified", // Not stored in our schema
          location: profile.location || 'Unknown location',
          bio: profile.bio || '',
          relationshipGoal: 'networking',
          skills: profile.skills || [],
          interests: profile.interests || [],
          imageUrl: profile.image_url || '',
          industry: profile.industry || '',
          userType: profile.user_type || '',
          experienceLevel: profile.experience_level || '',
          matchScore: 50 + Math.floor(Math.random() * 40),
          distance: undefined,
          activityScore: profile.activity_score || 75,
          profileCompleteness: profile.profile_completeness || 80,
          language: 'English', // Add the required language property
          projectInterests: profile.project_interests || [],
          university: profile.university || '',
          courseYear: profile.course_year || '',
          networkingGoals: profile.networking_goals || [],
          latitude: profile.latitude,
          longitude: profile.longitude
        }));
        
        setMatches(userProfiles);
      } catch (error) {
        console.error("Error loading matches:", error);
        toast.error("Failed to load matches");
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    function deg2rad(deg: number) {
      return deg * (Math.PI/180);
    }

    if (user) {
      loadMatches();
      
      try {
        const channel = supabase
          .channel('public:user_profiles')
          .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'user_profiles' }, 
            () => {
              loadMatches();
            }
          )
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up real-time listener:", error);
      }
    }
  }, [user, locationEnabled, userCoordinates, radiusInKm, selectedIndustries, experienceLevel]);
  
  useEffect(() => {
    const loadConfirmedMatches = async () => {
      if (!user || activeTab !== "matches") return;
      
      setIsLoadingConfirmed(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .neq('id', user.id)
          .limit(5);
        
        if (error) throw error;
        
        const confirmedProfilesData = data.map((profile): UserProfile => ({
          id: profile.id,
          name: profile.full_name || 'Anonymous User',
          age: estimateAgeFromExperienceLevel(profile.experience_level),
          gender: "unspecified", // Not stored in our schema
          location: profile.location || 'Unknown location',
          bio: profile.bio || '',
          relationshipGoal: 'networking',
          skills: profile.skills || [],
          interests: profile.interests || [],
          imageUrl: profile.image_url || '',
          industry: profile.industry || '',
          userType: profile.user_type || '',
          experienceLevel: profile.experience_level || '',
          matchScore: 85 + Math.floor(Math.random() * 15),
          activityScore: profile.activity_score || 75,
          profileCompleteness: profile.profile_completeness || 80,
          language: 'English', // Add the required language property
          university: profile.university || '',
          courseYear: profile.course_year || '',
          networkingGoals: profile.networking_goals || [],
          projectInterests: profile.project_interests || [],
          latitude: profile.latitude,
          longitude: profile.longitude
        }));
        
        setConfirmedMatches(confirmedProfilesData);
      } catch (error) {
        console.error("Error loading confirmed matches:", error);
        setConfirmedMatches([]);
      } finally {
        setIsLoadingConfirmed(false);
      }
    };
    
    loadConfirmedMatches();
  }, [user, activeTab]);
  
  useEffect(() => {
    const loadSavedProfiles = async () => {
      if (!user || activeTab !== "saved") return;
      
      setIsLoadingSaved(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .neq('id', user.id)
          .limit(3);
          
        if (error) throw error;
        
        const savedProfilesData = data.map((profile): UserProfile => ({
          id: profile.id,
          name: profile.full_name || 'Anonymous User',
          age: estimateAgeFromExperienceLevel(profile.experience_level),
          gender: "unspecified", // Not stored in our schema
          location: profile.location || 'Unknown location',
          bio: profile.bio || '',
          relationshipGoal: 'networking',
          skills: profile.skills || [],
          interests: profile.interests || [],
          imageUrl: profile.image_url || '',
          industry: profile.industry || '',
          userType: profile.user_type || '',
          experienceLevel: profile.experience_level || '',
          matchScore: 70 + Math.floor(Math.random() * 20),
          activityScore: profile.activity_score || 75,
          profileCompleteness: profile.profile_completeness || 80,
          language: 'English', // Add the required language property
          university: profile.university || '',
          courseYear: profile.course_year || '',
          networkingGoals: profile.networking_goals || [],
          projectInterests: profile.project_interests || [],
          latitude: profile.latitude,
          longitude: profile.longitude
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
  
  const handleMatchAction = (profileId: string, action: "like" | "pass" | "save") => {
    if (action === "like") {
      toast.success("You liked this profile!");
    } else if (action === "pass") {
      toast.info("Profile skipped");
    } else if (action === "save") {
      toast.success("Profile saved for later");
    }
    
    setMatches(prev => prev.filter(p => p.id !== profileId));
  };
  
  const filteredMatches = matches.filter(profile => {
    if (searchTerm && !profile.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !profile.industry?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (selectedIndustries.length > 0 && 
        !selectedIndustries.includes(profile.industry?.toLowerCase() || '')) {
      return false;
    }
    
    if (experienceLevel !== "any" && profile.experienceLevel !== experienceLevel) {
      return false;
    }
    
    if (locationFilter && !profile.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
          <Button asChild>
            <Link to="/chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Messages
            </Link>
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
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              {filteredMatches.map((profile, index) => (
                <MatchCardConnectable
                  key={profile.id}
                  profile={profile}
                  delay={index}
                  onViewProfile={() => navigate(`/profile/${profile.id}`)}
                  onConnect={() => handleMatchAction(profile.id, "like")}
                  onPass={() => handleMatchAction(profile.id, "pass")}
                  showDistance={locationEnabled}
                />
              ))}
            </div>
          )}
          
          {filteredMatches.length > 0 && (
            <div className="mt-8 flex justify-center">
              <FindMatchButton variant="outline" label="Find More Matches" />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="matches">
          {isLoadingConfirmed ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              {confirmedMatches.map((profile, index) => (
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
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              {savedProfiles.map((profile) => (
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
