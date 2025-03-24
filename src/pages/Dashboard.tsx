import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCardConnectable from "@/components/match-card/MatchCardConnectable";
import { UserProfile } from "@/lib/matchmaking";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchRecommendations, getProximityMatches, updateUserCoordinates } from "@/services/MatchmakingAPI";
import { 
  Loader2, MapPin, Filter, Users, Sparkles, 
  RefreshCw, BarChart3, MessageSquare, Activity,
  AlertTriangle
} from "lucide-react";
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
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EngagementStats from "@/components/dashboard/EngagementStats";
import MatchQualityChart from "@/components/dashboard/MatchQualityChart";
import NearbyProfessionalsMap from "@/components/dashboard/NearbyProfessionalsMap";
import ProfileCompletionCard from "@/components/dashboard/ProfileCompletionCard";
import TrendingSkillsCard from "@/components/dashboard/TrendingSkillsCard";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [recommendedMatches, setRecommendedMatches] = useState<UserProfile[]>([]);
  const [nearbyMatches, setNearbyMatches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recommended");
  const [radius, setRadius] = useState(50);
  const [professionFilter, setProfessionFilter] = useState<string>("");
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<string>("");
  const [relationshipGoalFilter, setRelationshipGoalFilter] = useState<string>("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  
  const geolocation = useGeolocation({ 
    watch: false, 
    showErrorToasts: true,
    enableHighAccuracy: true
  });

  const [engagementData, setEngagementData] = useState({
    activeMatches: 0,
    connectionsTotal: 0,
    ongoingChats: 0,
    profileViews: 0,
    messagesSent: 0,
    messagesReceived: 0,
    responseRate: 0,
  });

  const activityData = [
    { day: 'Mon', matches: 0, messages: 0, views: 0 },
    { day: 'Tue', matches: 0, messages: 0, views: 0 },
    { day: 'Wed', matches: 0, messages: 0, views: 0 },
    { day: 'Thu', matches: 0, messages: 0, views: 0 },
    { day: 'Fri', matches: 0, messages: 0, views: 0 },
    { day: 'Sat', matches: 0, messages: 0, views: 0 },
    { day: 'Sun', matches: 0, messages: 0, views: 0 },
  ];

  useEffect(() => {
    if (user) {
      loadMatchData();
      loadEngagementData();
      
      if (profile) {
        let completionScore = 0;
        const completionMetrics = [
          !!profile.full_name,         
          !!profile.industry,          
          !!profile.skills?.length,    
          !!profile.location,         
          !!profile.bio,              
          !!profile.image_url         
        ];
        
        const scores = [20, 15, 15, 10, 20, 20];
        completionMetrics.forEach((isComplete, index) => {
          if (isComplete) completionScore += scores[index];
        });
        
        setProfileCompletion(completionScore);
      } else {
        setProfileCompletion(0);
      }
    
      if (locationEnabled && geolocation.latitude && geolocation.longitude && !geolocation.error) {
        updateUserLocationCoordinates(geolocation.latitude, geolocation.longitude);
      }
    }
  }, [user, geolocation.latitude, geolocation.longitude, locationEnabled, profile]);

  const loadEngagementData = async () => {
    if (!user?.id) return;
    
    try {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('sender_id, recipient_id, created_at')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
      
      if (messagesError) throw messagesError;
      
      const { data: views, error: viewsError } = await supabase
        .from('profile_views')
        .select('*')
        .eq('profile_id', user.id);
      
      if (viewsError) throw viewsError;
      
      const { data: matches, error: matchesError } = await supabase
        .from('user_matches')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'accepted');
      
      if (matchesError) throw matchesError;
      
      const messagesSent = messages?.filter(m => m.sender_id === user.id).length || 0;
      const messagesReceived = messages?.filter(m => m.recipient_id === user.id).length || 0;
      const responseRate = messagesSent > 0 
        ? Math.min(100, Math.round((messagesReceived / messagesSent) * 100)) 
        : 0;
      
      setEngagementData({
        activeMatches: matches?.length || 0,
        connectionsTotal: matches?.length || 0,
        ongoingChats: [...new Set(messages?.map(m => 
          m.sender_id === user.id ? m.recipient_id : m.sender_id
        ))].length,
        profileViews: views?.length || 0,
        messagesSent,
        messagesReceived,
        responseRate
      });
      
    } catch (error) {
      console.error("Error loading engagement data:", error);
    }
  };

  const loadMatchData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setNoDataMessage(null);
    
    try {
      if (!profile || !profile.industry || !profile.skills || profile.skills.length === 0) {
        setNoDataMessage("Please complete your profile to get matches");
        setIsLoading(false);
        return;
      }
      
      const results = await Promise.allSettled([
        getMatchRecommendations(user.id, 10),
        locationEnabled && geolocation.latitude && geolocation.longitude 
          ? getProximityMatches(user.id, radius, 10) 
          : Promise.resolve([])
      ]);
      
      if (results[0].status === 'fulfilled') {
        const matches = results[0].value;
        setRecommendedMatches(matches);
        
        if (matches.length === 0) {
          setNoDataMessage("No recommended matches found. Try updating your profile or adjusting your filters.");
        }
      } else {
        console.error("Error loading recommended matches:", results[0].reason);
        toast.error("Couldn't load recommended matches");
        setNoDataMessage("Failed to load matches. Please try again later.");
      }
      
      if (results[1].status === 'fulfilled') {
        setNearbyMatches(results[1].value);
      }
      
    } catch (error) {
      console.error("Error loading match data:", error);
      toast.error("Failed to load matches");
      setNoDataMessage("An error occurred while fetching matches.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserLocationCoordinates = async (latitude: number, longitude: number) => {
    if (!user?.id) return;
    
    try {
      const success = await updateUserCoordinates(user.id, latitude, longitude);
      if (success) {
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
    navigate(`/profile/${id}`);
  };

  const handleConnectRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_matches')
        .insert([
          {
            user_id: user?.id,
            matched_user_id: id,
            status: 'pending',
            match_score: 0
          }
        ]);
        
      if (error) throw error;
      
      toast.success("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request. Please try again.");
    }
  };

  const handleStartChat = (id: string) => {
    navigate(`/chat?contact=${id}`);
  };

  const handleRefreshMatches = () => {
    loadMatchData();
    loadEngagementData();
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

  const handleToggleLocation = (checked: boolean) => {
    setLocationEnabled(checked);
    
    if (checked) {
      handleUpdateLocation();
    }
  };

  const applyFilters = useCallback((matches: UserProfile[]) => {
    let filteredMatches = [...matches];
    
    if (professionFilter) {
      filteredMatches = filteredMatches.filter(profile => 
        profile.userType?.toLowerCase() === professionFilter.toLowerCase()
      );
    }
    
    if (skillFilter) {
      filteredMatches = filteredMatches.filter(profile => 
        profile.skills?.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }
    
    if (industryFilter) {
      filteredMatches = filteredMatches.filter(profile => 
        profile.industry?.toLowerCase() === industryFilter.toLowerCase()
      );
    }
    
    if (experienceFilter) {
      filteredMatches = filteredMatches.filter(profile => 
        profile.experienceLevel?.toLowerCase() === experienceFilter.toLowerCase()
      );
    }
    
    if (relationshipGoalFilter) {
      filteredMatches = filteredMatches.filter(profile => {
        return profile.relationshipGoal === relationshipGoalFilter ||
          (relationshipGoalFilter === "mentorship" && profile.relationshipGoal === "networking") ||
          (relationshipGoalFilter === "job" && profile.relationshipGoal === "networking") ||
          (relationshipGoalFilter === "collaboration" && profile.relationshipGoal === "networking");
      });
    }
    
    return filteredMatches;
  }, [professionFilter, skillFilter, industryFilter, experienceFilter, relationshipGoalFilter]);

  const filteredNearbyMatches = applyFilters(nearbyMatches);
  const filteredRecommendedMatches = applyFilters(recommendedMatches);

  const professions = [
    "Professional", 
    "Student", 
    "Mentor", 
    "Founder", 
    "Investor", 
    "Freelancer", 
    "Collaborator"
  ];

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Marketing",
    "Design",
    "Engineering",
    "Consulting",
    "Real Estate",
    "Retail"
  ];

  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert"
  ];

  const relationshipGoals = [
    "Networking",
    "Mentorship",
    "Collaboration",
    "Job Opportunities"
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

  const newMatchesToday = recommendedMatches.length ? Math.min(recommendedMatches.length, 5) : 0;

  const getSuggestedActions = () => {
    if (!profile) return [];
    
    return [
      profile.full_name ? null : "Add your full name",
      profile.skills?.length ? null : "Add professional skills",
      profile.bio ? null : "Complete your bio section",
      profile.image_url ? null : "Add a profile photo",
      profile.industry ? null : "Select your industry",
      profile.location ? null : "Add your location"
    ].filter(Boolean) as string[];
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="mb-6 text-muted-foreground">You need to be logged in to view your dashboard</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <DashboardHeader 
          user={user} 
          newMatchesCount={newMatchesToday}
          onRefresh={handleRefreshMatches}
          isLoading={isLoading}
          profileCompleteness={profileCompletion}
        />

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 lg:col-span-4">
            <ProfileCompletionCard 
              completion={profileCompletion}
              suggestedActions={getSuggestedActions()}
              onUpdateProfile={() => navigate('/profile')}
            />
            
            <EngagementStats 
              stats={engagementData}
              className="mt-6"
            />
            
            <TrendingSkillsCard 
              industry={profile?.industry || "Technology"}
              className="mt-6"
            />
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">Quality Matches</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAnalytics(!showAnalytics)}
                    >
                      {showAnalytics ? <Users className="h-4 w-4 mr-1" /> : <BarChart3 className="h-4 w-4 mr-1" />}
                      {showAnalytics ? "Show Matches" : "Analytics"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRefreshMatches}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!profile || profileCompletion < 30 ? (
                  <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">Your profile is incomplete</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Please complete your profile to find better matches.
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2 mt-2 bg-amber-100 border-amber-300 hover:bg-amber-200 dark:bg-amber-900 dark:border-amber-700"
                        onClick={() => navigate('/profile')}
                      >
                        Complete Profile
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : null}
                
                {showAnalytics ? (
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Networking Activity (Last 7 Days)
                    </h3>
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                      <Activity className="mx-auto h-12 w-12 mb-4 opacity-20" />
                      <p className="font-medium mb-1">Not enough data yet</p>
                      <p className="text-sm">
                        Start connecting with professionals to see your activity stats
                      </p>
                    </div>
                    <MatchQualityChart />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                      <div className="w-full md:w-1/3">
                        <label className="text-sm font-medium mb-1 block">Industry</label>
                        <Select onValueChange={setIndustryFilter} value={industryFilter || "all"}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Industries" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry.toLowerCase()}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full md:w-1/3">
                        <label className="text-sm font-medium mb-1 block">Profession</label>
                        <Select onValueChange={setProfessionFilter} value={professionFilter || "all"}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Professions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Professions</SelectItem>
                            {professions.map(profession => (
                              <SelectItem key={profession} value={profession.toLowerCase()}>
                                {profession}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full md:w-1/3">
                        <label className="text-sm font-medium mb-1 block">Skills</label>
                        <Select onValueChange={setSkillFilter} value={skillFilter || "all"}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Skills" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Skills</SelectItem>
                            {commonSkills.map(skill => (
                              <SelectItem key={skill} value={skill.toLowerCase()}>
                                {skill}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                      <div className="w-full md:w-1/2">
                        <label className="text-sm font-medium mb-1 block">Experience Level</label>
                        <Select onValueChange={setExperienceFilter} value={experienceFilter || "all"}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Experience Levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Experience Levels</SelectItem>
                            {experienceLevels.map(level => (
                              <SelectItem key={level} value={level.toLowerCase()}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full md:w-1/2">
                        <label className="text-sm font-medium mb-1 block">Connection Purpose</label>
                        <Select onValueChange={setRelationshipGoalFilter} value={relationshipGoalFilter || "all"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any Purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Purpose</SelectItem>
                            {relationshipGoals.map(goal => (
                              <SelectItem key={goal} value={goal.toLowerCase()}>
                                {goal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Tabs 
                      defaultValue="recommended" 
                      value={activeTab} 
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="w-full grid grid-cols-2 mb-6">
                        <TabsTrigger value="recommended" className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          <span>AI Recommendations</span>
                          {newMatchesToday > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              {newMatchesToday} new
                            </span>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="nearby" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Proximity Matches</span>
                          {filteredNearbyMatches.length > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                              {filteredNearbyMatches.length}
                            </span>
                          )}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="recommended" className="space-y-6">
                        {isLoading ? (
                          <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : filteredRecommendedMatches.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {filteredRecommendedMatches.map((profile, index) => (
                              <MatchCardConnectable
                                key={profile.id}
                                profile={profile}
                                delay={index * 100}
                                onViewProfile={() => handleViewProfile(profile.id)}
                                onConnect={() => handleConnectRequest(profile.id)}
                                onStartChat={() => handleStartChat(profile.id)}
                                showChatButton={true}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                            <p className="text-muted-foreground mb-4">
                              {noDataMessage || (professionFilter || skillFilter || industryFilter || experienceFilter || relationshipGoalFilter) ? 
                                "Try adjusting your filters to see more results" : 
                                "Complete your profile to help us find better matches for you"}
                            </p>
                            <Button onClick={() => navigate("/profile")}>Update Profile</Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="nearby" className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Switch 
                              checked={locationEnabled} 
                              onCheckedChange={handleToggleLocation} 
                              id="location-toggle"
                            />
                            <label 
                              htmlFor="location-toggle"
                              className="text-sm font-medium cursor-pointer"
                            >
                              Enable Location Sharing
                            </label>
                          </div>
                          {locationEnabled && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleUpdateLocation}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Update Location
                            </Button>
                          )}
                        </div>
                        
                        {!locationEnabled ? (
                          <div className="text-center py-12 border border-dashed rounded-lg">
                            <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Location sharing is disabled</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                              Enable location sharing to discover professionals in your area. Your location is only used to find nearby connections.
                            </p>
                            <Button onClick={() => setLocationEnabled(true)}>Enable Location</Button>
                          </div>
                        ) : isLoading ? (
                          <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex flex-col space-y-4">
                              <div className="flex items-center justify-between mb-1">
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
                            
                            <div className="bg-muted/20 rounded-lg h-[300px] relative overflow-hidden">
                              {geolocation.latitude && geolocation.longitude ? (
                                filteredNearbyMatches.length > 0 ? (
                                  <NearbyProfessionalsMap 
                                    userLocation={{
                                      lat: geolocation.latitude,
                                      lng: geolocation.longitude
                                    }}
                                    professionals={filteredNearbyMatches.map(match => ({
                                      id: match.id,
                                      name: match.name,
                                      position: match.latitude && match.longitude 
                                        ? { lat: match.latitude, lng: match.longitude }
                                        : undefined,
                                      userType: match.userType || '',
                                      industry: match.industry || '',
                                      matchScore: match.matchScore || 0
                                    }))}
                                    onViewProfile={handleViewProfile}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <div className="text-center p-6">
                                      <p>No professionals found in your area</p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {filteredNearbyMatches.length === 0 && nearbyMatches.length > 0 
                                          ? "Try adjusting your filters or increasing your search radius" 
                                          : "Try increasing your search radius or switching to recommendations"
                                        }
                                      </p>
                                      {nearbyMatches.length === 0 && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-4"
                                          onClick={() => setActiveTab("recommended")}
                                        >
                                          Switch to Recommendations
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <div className="text-center p-6">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                                    <p>Getting your location...</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {filteredNearbyMatches.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {filteredNearbyMatches.map((profile, index) => (
                                  <MatchCardConnectable
                                    key={profile.id}
                                    profile={profile}
                                    delay={index * 100}
                                    onViewProfile={() => handleViewProfile(profile.id)}
                                    onConnect={() => handleConnectRequest(profile.id)}
                                    onStartChat={() => handleStartChat(profile.id)}
                                    showChatButton={true}
                                    showDistance={true}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 border border-dashed rounded-lg mt-4">
                                <h3 className="text-lg font-semibold mb-2">No nearby professionals found</h3>
                                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                  Try increasing your search radius or check back later as more professionals join in your area
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
