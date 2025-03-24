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
import { 
  Loader2, MapPin, Filter, Users, Sparkles, 
  RefreshCw, BarChart3, MessageSquare, Activity,
  Eye, LightbulbIcon, TrendingUp, User, Mail, Bell
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
import { Progress } from "@/components/ui/progress";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

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
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const geolocation = useGeolocation({ 
    watch: false, 
    showErrorToasts: true,
    enableHighAccuracy: true
  });

  const engagementData = {
    activeMatches: 0,
    connectionsTotal: 0,
    ongoingChats: 0,
    profileViews: 0,
    messagesSent: 0,
    messagesReceived: 0,
    responseRate: 0,
  };

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
    loadMatchData();
    
    if (locationEnabled && geolocation.latitude && geolocation.longitude && !geolocation.error) {
      updateUserLocationCoordinates(geolocation.latitude, geolocation.longitude);
    }
  }, [user, geolocation.latitude, geolocation.longitude, locationEnabled]);

  const loadMatchData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        getMatchRecommendations(user.id, 10),
        locationEnabled && geolocation.latitude && geolocation.longitude 
          ? getProximityMatches(user.id, radius, 10) 
          : Promise.resolve([])
      ]);
      
      if (results[0].status === 'fulfilled') {
        setRecommendedMatches(results[0].value);
      } else {
        console.error("Error loading recommended matches:", results[0].reason);
        toast.error("Couldn't load recommended matches");
      }
      
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

  const handleStartChat = (id: string) => {
    toast.success("Opening chat with user...");
    // Navigate to chat component with selected user
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

  const handleToggleLocation = (checked: boolean) => {
    setLocationEnabled(checked);
    
    if (checked) {
      handleUpdateLocation();
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

  const newMatchesToday = recommendedMatches.length ? Math.min(recommendedMatches.length, 5) : 0;

  return (
    <Layout>
      <div className="container py-6">
        <DashboardHeader 
          user={user} 
          newMatchesCount={newMatchesToday}
          onRefresh={handleRefreshMatches}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 lg:col-span-4">
            <ProfileCompletionCard 
              completion={profileCompletion}
              suggestedActions={[
                "Add 3 more professional skills",
                "Complete your bio section",
                "Add your previous work experience"
              ]}
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
                {showAnalytics ? (
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Networking Activity (Last 7 Days)
                    </h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip content={({active, payload, label}) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-md">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center">
                                      <div className="h-2 w-2 rounded bg-blue-500" />
                                      <span className="ml-1 text-xs">{`Matches: ${payload[0].value}`}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="h-2 w-2 rounded bg-green-500" />
                                      <span className="ml-1 text-xs">{`Messages: ${payload[1].value}`}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="h-2 w-2 rounded bg-amber-500" />
                                      <span className="ml-1 text-xs">{`Views: ${payload[2].value}`}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Legend />
                          <Bar dataKey="matches" fill="#3b82f6" name="Matches" />
                          <Bar dataKey="messages" fill="#22c55e" name="Messages" />
                          <Bar dataKey="views" fill="#f59e0b" name="Profile Views" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <MatchQualityChart />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                      <div className="w-full md:w-1/2">
                        <label className="text-sm font-medium mb-1 block">Filter by Profession</label>
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

                      <div className="w-full md:w-1/2">
                        <label className="text-sm font-medium mb-1 block">Filter by Skill</label>
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
                              {professionFilter || skillFilter ? 
                                "Try adjusting your filters to see more results" : 
                                "Complete your profile to help us find better matches for you"}
                            </p>
                            <Button>Update Profile</Button>
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
    </Layout>
  );
};

export default Dashboard;

