
import React, { useState, useEffect } from "react";
import { 
  findMatches,
  UserProfile, 
  calculateDistance 
} from '@/lib/matchmaking';
import MatchCardConnectable from '@/components/MatchCardConnectable';
import SwipeContainer from '@/components/SwipeContainer';
import InstantChat from '@/components/InstantChat';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, MessageSquareText, BookmarkPlus, MapPin, Trophy, Calendar, Bell, Building, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MatchFilter, { FilterOptions } from "@/components/MatchFilter";
import { useAuth } from "@/contexts/AuthContext";
import { getMatches, getUserMatches, getSavedProfiles, recordSwipeAction } from "@/services/MatchmakingService";

const Matches = () => {
  const { user, profile } = useAuth();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [filterApplied, setFilterApplied] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [userStreak, setUserStreak] = useState(3);
  const [weeklyGoal, setWeeklyGoal] = useState({
    target: 5,
    achieved: 2
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showUniversityLeaderboard, setShowUniversityLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);
  
  useEffect(() => {
    if (profile && user) {
      // Create current user profile from auth data
      const userProfile: UserProfile = {
        id: user.id,
        name: profile.full_name || user.email?.split('@')[0] || "User",
        age: 25, // Default
        gender: "unspecified",
        interests: profile.interests || ["networking", "professional development"],
        location: profile.location || "Unknown",
        bio: profile.bio || "Looking to connect with professionals",
        relationshipGoal: "networking",
        skills: profile.skills || ["networking"],
        language: "English",
        industry: profile.industry || "",
        userType: profile.user_type || "",
        experienceLevel: profile.experience_level || "",
        university: profile.university || "",
        courseYear: profile.course_year || "",
        projectInterests: profile.project_interests || [],
        activityScore: profile.activity_score || 70,
        profileCompleteness: profile.profile_completeness || 50,
      };
      
      setCurrentUser(userProfile);
      
      // Load matches and connections
      loadMatches();
      loadConnections();
      loadSavedProfiles();
    }
  }, [user, profile, userLocation]);
  
  const loadMatches = async () => {
    setIsLoading(true);
    if (user) {
      try {
        const matchList = await getMatches(user.id);
        
        // Add distance if we have location
        if (userLocation) {
          const matchesWithDistance = matchList.map(match => {
            const userCoords = getUserMockCoordinates(match.location);
            
            if (userCoords) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                userCoords.latitude,
                userCoords.longitude
              );
              
              return { ...match, distance };
            }
            
            return match;
          });
          
          setMatches(matchesWithDistance);
        } else {
          setMatches(matchList);
        }
      } catch (error) {
        console.error("Error loading matches:", error);
        toast.error("Failed to load matches");
      }
    }
    setIsLoading(false);
  };
  
  const loadConnections = async () => {
    if (user) {
      try {
        const connectionsList = await getUserMatches(user.id);
        setConnections(connectionsList);
      } catch (error) {
        console.error("Error loading connections:", error);
      }
    }
  };
  
  const loadSavedProfiles = async () => {
    if (user) {
      try {
        const savedList = await getSavedProfiles(user.id);
        setSavedProfiles(savedList);
      } catch (error) {
        console.error("Error loading saved profiles:", error);
      }
    }
  };
  
  const getUserMockCoordinates = (location: string) => {
    const locationMap: Record<string, {latitude: number, longitude: number}> = {
      "New York": { latitude: 40.7128, longitude: -74.0060 },
      "San Francisco": { latitude: 37.7749, longitude: -122.4194 },
      "Los Angeles": { latitude: 34.0522, longitude: -118.2437 },
      "Chicago": { latitude: 41.8781, longitude: -87.6298 },
      "Miami": { latitude: 25.7617, longitude: -80.1918 },
      "Austin": { latitude: 30.2672, longitude: -97.7431 },
      "Portland": { latitude: 45.5051, longitude: -122.6750 },
      "Seattle": { latitude: 47.6062, longitude: -122.3321 },
      "London": { latitude: 51.5074, longitude: -0.1278 },
      "Mumbai": { latitude: 19.0760, longitude: 72.8777 },
      "Bangalore": { latitude: 12.9716, longitude: 77.5946 },
      "Sydney": { latitude: -33.8688, longitude: 151.2093 },
      "Berlin": { latitude: 52.5200, longitude: 13.4050 },
    };
    
    return locationMap[location] || null;
  };
  
  const handleSendIntro = (profileId: string, message: string) => {
    const profile = matches.find(p => p.id === profileId);
    if (profile) {
      toast.success(`Message sent to ${profile.name}`);
    }
  };
  
  const handleNewMatch = (profile: UserProfile) => {
    setConnections(prev => {
      if (prev.some(p => p.id === profile.id)) return prev;
      return [...prev, profile];
    });
    
    setTimeout(() => {
      setActiveTab("connections");
    }, 1500);
  };
  
  const handleRefreshMatches = async () => {
    await loadMatches();
    toast.success("Found new matches!");
  };
  
  const handleConnect = async (profileId: string) => {
    if (!user) {
      toast.error("You must be logged in to connect");
      return;
    }
    
    try {
      const success = await recordSwipeAction(user.id, profileId, 'like');
      
      const profile = matches.find(p => p.id === profileId) || 
                    savedProfiles.find(p => p.id === profileId);
                    
      if (profile) {
        if (success) {
          // It's a match!
          setConnections(prev => {
            if (prev.some(p => p.id === profileId)) return prev;
            return [...prev, profile];
          });
          
          setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
          setMatches(prev => prev.filter(p => p.id !== profileId));
          
          toast.success(`You matched with ${profile.name}!`, {
            description: "You can now start messaging each other",
          });
        } else {
          toast.success(`Connection request sent to ${profile.name}`);
          setMatches(prev => prev.filter(p => p.id !== profileId));
        }
      }
    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Failed to send connection request");
    }
  };
  
  const handleViewProfile = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId) || 
                    connections.find(p => p.id === profileId) ||
                    savedProfiles.find(p => p.id === profileId);
    
    if (profile) {
      toast.info(`Viewing ${profile.name}'s profile`);
    }
  };
  
  const handleStartMatching = () => {
    setActiveTab("discover");
  };
  
  const handleSaveForLater = async (profileId: string) => {
    if (!user) {
      toast.error("You must be logged in to save profiles");
      return;
    }
    
    try {
      await recordSwipeAction(user.id, profileId, 'save');
      
      const profile = matches.find(p => p.id === profileId);
      if (profile && !savedProfiles.some(p => p.id === profileId)) {
        setSavedProfiles(prev => [...prev, profile]);
        
        const profileIndex = matches.findIndex(p => p.id === profileId);
        if (profileIndex !== -1) {
          setMatches(prev => {
            const newMatches = [...prev];
            newMatches.splice(profileIndex, 1);
            return newMatches;
          });
        }
        
        toast.success(`Saved ${profile.name} for later`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  const handleApplyFilters = async (filters: FilterOptions) => {
    if (!user || !currentUser) {
      toast.error("You must be logged in to apply filters");
      return;
    }
    
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        userType: filters.userType || prev.userType,
        industry: filters.industry.length > 0 ? filters.industry[0] : prev.industry,
        skills: filters.skills.length > 0 ? filters.skills : prev.skills,
        experienceLevel: filters.experienceLevel || prev.experienceLevel,
        relationshipGoal: filters.relationshipGoal || prev.relationshipGoal,
        location: filters.locationPreference === "local" ? prev.location : prev.location,
      };
    });
    
    // Load matches with filters
    setIsLoading(true);
    try {
      const matchList = await getMatches(user.id);
      
      let filteredMatches = matchList;
      
      if (filters.userType) {
        filteredMatches = filteredMatches.filter(m => m.userType === filters.userType);
      }
      
      if (filters.industry.length > 0) {
        filteredMatches = filteredMatches.filter(m => 
          m.industry && filters.industry.includes(m.industry)
        );
      }
      
      if (filters.skills.length > 0) {
        filteredMatches = filteredMatches.filter(m => 
          m.skills && m.skills.some(skill => filters.skills.includes(skill))
        );
      }
      
      if (filters.experienceLevel) {
        filteredMatches = filteredMatches.filter(m => 
          m.experienceLevel === filters.experienceLevel
        );
      }
      
      if (userLocation) {
        filteredMatches = filteredMatches.map(match => {
          const userCoords = getUserMockCoordinates(match.location);
          
          if (userCoords) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              userCoords.latitude,
              userCoords.longitude
            );
            
            return { ...match, distance };
          }
          
          return match;
        });
      }
      
      setMatches(filteredMatches);
      setFilterApplied(true);
      toast.success("Filters applied successfully!");
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error("Failed to apply filters");
    } finally {
      setIsLoading(false);
    }
  };

  // Leaderboard data (could be fetched from the database in a real app)
  const leaderboardData = [
    { id: "leader1", name: "Alex Johnson", points: 356, connectionsThisWeek: 12 },
    { id: "leader2", name: "Taylor Swift", points: 298, connectionsThisWeek: 10 },
    { id: "leader3", name: "Jordan Peterson", points: 245, connectionsThisWeek: 8 },
    { id: "leader4", name: "Chris Evans", points: 212, connectionsThisWeek: 7 },
    { id: "leader5", name: "Serena Williams", points: 187, connectionsThisWeek: 6 },
  ];

  const universityLeaderboardData = [
    { id: "uni1", name: "Rahul Verma", university: "IIT Delhi", points: 428, connections: 15, projectsJoined: 3 },
    { id: "uni2", name: "Ananya Patel", university: "NIT Trichy", points: 375, connections: 12, projectsJoined: 2 },
    { id: "uni3", name: "Vikram Singh", university: "BITS Pilani", points: 342, connections: 11, projectsJoined: 4 },
    { id: "uni4", name: "Priya Sharma", university: "IIT Bombay", points: 310, connections: 9, projectsJoined: 2 },
    { id: "uni5", name: "Ravi Kumar", university: "Delhi University", points: 285, connections: 8, projectsJoined: 1 },
    { id: "uni6", name: "Neha Gupta", university: "VIT Vellore", points: 248, connections: 7, projectsJoined: 2 },
    { id: "uni7", name: "Arjun Reddy", university: "IIT Madras", points: 215, connections: 6, projectsJoined: 1 },
  ];

  if (!user || !currentUser) {
    return (
      <div className="container mx-auto py-32 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view matches</h1>
        <Button onClick={() => window.location.href = "/login"}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-background to-background/70">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">Find Your Perfect Match</h1>
      
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm p-3 flex items-center gap-3 w-auto">
          <div className="bg-amber-500/10 p-2 rounded-full">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-amber-700/70">Current Streak</p>
            <p className="font-semibold text-amber-900">{userStreak} Days</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm p-3 flex items-center gap-3 w-auto">
          <div className="bg-blue-500/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-blue-700/70">Weekly Goal</p>
            <p className="font-semibold text-blue-900">{weeklyGoal.achieved}/{weeklyGoal.target} Connections</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm p-3 flex items-center gap-3 w-auto cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowLeaderboard(!showLeaderboard)}>
          <div className="bg-purple-500/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-purple-700/70">Networking Rank</p>
            <p className="font-semibold text-purple-900">#42 in Your Industry</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm p-3 flex items-center gap-3 w-auto cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowUniversityLeaderboard(!showUniversityLeaderboard)}>
          <div className="bg-emerald-500/10 p-2 rounded-full">
            <GraduationCap className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-emerald-700/70">University Rank</p>
            <p className="font-semibold text-emerald-900">Top Students</p>
          </div>
        </Card>
      </div>
      
      {showLeaderboard && (
        <Card className="mb-8 max-w-2xl mx-auto bg-white/80 backdrop-blur border border-border/30 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Top Networkers This Week
            </h3>
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100 font-semibold text-blue-800">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.connectionsThisWeek} connections this week</p>
                    </div>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {user.points} pts
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={() => setShowLeaderboard(false)}>
                Close Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showUniversityLeaderboard && (
        <Card className="mb-8 max-w-2xl mx-auto bg-white/80 backdrop-blur border border-border/30 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-500" />
              University Student Leaderboard
            </h3>
            <div className="space-y-3">
              {universityLeaderboardData.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-100 font-semibold text-emerald-800">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.university}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {user.connections} connections
                        </span>
                        <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                          {user.projectsJoined} projects
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                    {user.points} pts
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={() => setShowUniversityLeaderboard(false)}>
                Close University Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mb-8 max-w-lg mx-auto">
        <Tabs 
          defaultValue="discover" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-background/60 backdrop-blur p-1 rounded-lg border border-border/40">
            <TabsTrigger value="discover" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookmarkPlus className="h-4 w-4" />
              Saved
              {savedProfiles.length > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {savedProfiles.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              Connections
              {connections.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {connections.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquareText className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {!filterApplied && <MatchFilter onApplyFilters={handleApplyFilters} />}
                
                {filterApplied && matches.length === 0 ? (
                  <Card className="text-center p-6 mb-6 bg-background/60 backdrop-blur border border-border/40 shadow-sm">
                    <CardContent className="pt-6">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No matches found with these filters</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters to find more matches
                      </p>
                      <Button onClick={() => setFilterApplied(false)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">Adjust Filters</Button>
                    </CardContent>
                  </Card>
                ) : (
                  filterApplied && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                          Found {matches.length} matches with your filters
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setFilterApplied(false)}>
                          Adjust Filters
                        </Button>
                      </div>
                      <SwipeContainer 
                        profiles={matches}
                        onNewMatch={handleNewMatch}
                        onRefresh={handleRefreshMatches}
                        onSendIntro={handleSendIntro}
                        onSaveForLater={handleSaveForLater}
                        userId={user.id}
                      />
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        Connect, pass, or save profiles for later
                      </div>
                    </>
                  )
                )}
                
                {filterApplied && matches.length > 0 && (
                  <>
                    <SwipeContainer 
                      profiles={matches}
                      onNewMatch={handleNewMatch}
                      onRefresh={handleRefreshMatches}
                      onSendIntro={handleSendIntro}
                      onSaveForLater={handleSaveForLater}
                      userId={user.id}
                    />
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      Connect, pass, or save profiles for later
                    </div>
                  </>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              savedProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProfiles.map((profile, index) => (
                    <MatchCardConnectable
                      key={profile.id}
                      profile={profile}
                      delay={index * 100}
                      onViewProfile={handleViewProfile}
                      onConnect={() => handleConnect(profile.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center p-6 bg-background/60 backdrop-blur border border-border/40 shadow-sm">
                  <CardContent className="pt-6">
                    <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No saved profiles yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Save interesting profiles while browsing to review them later.
                    </p>
                    <Button onClick={handleStartMatching} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">Start Discovering</Button>
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>
          
          <TabsContent value="connections">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              connections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {connections.map((connection, index) => (
                    <MatchCardConnectable
                      key={connection.id}
                      profile={connection}
                      delay={index * 100}
                      onViewProfile={handleViewProfile}
                      onConnect={() => {
                        toast.info(`You're already connected with ${connection.name}`);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center p-6 bg-background/60 backdrop-blur border border-border/40 shadow-sm">
                  <CardContent className="pt-6">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start discovering people and make connections to see them here.
                    </p>
                    <Button onClick={handleStartMatching} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">Start Matching</Button>
                  </CardContent>
                </Card>
              )
            )}
          </TabsContent>
          
          <TabsContent value="chat">
            <InstantChat currentUser={currentUser} connections={connections} />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="max-w-3xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text">Recently Active</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.slice(0, 6).map((match, index) => (
            <MatchCardConnectable
              key={match.id}
              profile={match}
              delay={index * 100}
              onViewProfile={handleViewProfile}
              onConnect={() => handleConnect(match.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
