import React, { useState, useEffect } from "react";
import { 
  loadSampleUsers, 
  UserProfile, 
  findMatches,
  calculateDistance 
} from '@/lib/matchmaking';
import MatchCardConnectable from '@/components/MatchCardConnectable';
import SwipeContainer from '@/components/SwipeContainer';
import InstantChat from '@/components/InstantChat';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquareText, BookmarkPlus, MapPin, Trophy, Calendar, Bell, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MatchFilter, { FilterOptions } from "@/components/MatchFilter";

const Matches = () => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [filterApplied, setFilterApplied] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "current-user",
    name: "You",
    age: 25,
    gender: "unspecified",
    interests: ["technology", "music", "movies", "travel"],
    location: "New York",
    country: "United States",
    relationshipGoal: "networking",
    language: "English",
    activityScore: 90,
    imageUrl: "bg-gradient-to-br from-teal-400 to-emerald-600",
    bio: "Looking to meet interesting people and have fun conversations.",
    skills: ["coding", "photography"],
    profileCompleteness: 85,
    dailySwipes: 0,
    maxDailySwipes: 20,
  });
  
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [userStreak, setUserStreak] = useState(3);
  const [weeklyGoal, setWeeklyGoal] = useState({
    target: 5,
    achieved: 2
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
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
    const sampleUsers = loadSampleUsers();
    
    if (userLocation) {
      const usersWithDistance = sampleUsers.map(user => {
        const userCoords = getUserMockCoordinates(user.location);
        
        if (userCoords) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            userCoords.latitude,
            userCoords.longitude
          );
          
          return { ...user, distance };
        }
        
        return user;
      });
      
      setAllUsers(usersWithDistance);
      
      const matchesFound = findMatches(currentUser)
        .map(match => {
          const userWithDistance = usersWithDistance.find(u => u.id === match.id);
          return userWithDistance || match;
        });
      
      setMatches(matchesFound);
    } else {
      setAllUsers(sampleUsers);
      
      const matchesFound = findMatches(currentUser);
      setMatches(matchesFound);
    }
    
    setConnections([sampleUsers[2], sampleUsers[4]]);
  }, [userLocation]);
  
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
      console.log(`Sending intro to ${profile.name}: ${message}`);
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
  
  const handleRefreshMatches = () => {
    let refreshedMatches = findMatches(currentUser);
    
    if (userLocation) {
      refreshedMatches = refreshedMatches.map(match => {
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
    
    setMatches(refreshedMatches);
    toast.success("Found new matches!");
  };
  
  const handleConnect = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId) || 
                    savedProfiles.find(p => p.id === profileId);
    if (profile) {
      setConnections(prev => {
        if (prev.some(p => p.id === profileId)) return prev;
        return [...prev, profile];
      });
      
      setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
      
      toast.success(`Connected with ${profile.name}!`);
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
  
  const handleSaveForLater = (profileId: string) => {
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
    }
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setCurrentUser(prev => ({
      ...prev,
      userType: filters.userType || prev.userType,
      industry: filters.industry.length > 0 ? filters.industry[0] : prev.industry,
      skills: filters.skills.length > 0 ? filters.skills : prev.skills,
      experienceLevel: filters.experienceLevel || prev.experienceLevel,
      relationshipGoal: filters.relationshipGoal || prev.relationshipGoal,
      location: filters.locationPreference === "local" ? prev.location : prev.location,
    }));
    
    let filteredMatches = findMatches(currentUser);
    
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
    
    if (filters.locationPreference) {
      filteredMatches = filteredMatches.filter(m => {
        if (filters.locationPreference === "global") return true;
        
        if (filters.locationPreference === "country") {
          const profileCountry = m.country || m.location;
          const userCountry = currentUser.country || currentUser.location;
          return profileCountry === userCountry;
        }
        
        if (filters.locationPreference === "local") {
          return m.location === currentUser.location;
        }
        
        return true;
      });
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
  };

  const leaderboardData = [
    { id: "leader1", name: "Alex Johnson", points: 356, connectionsThisWeek: 12 },
    { id: "leader2", name: "Taylor Swift", points: 298, connectionsThisWeek: 10 },
    { id: "leader3", name: "Jordan Peterson", points: 245, connectionsThisWeek: 8 },
    { id: "leader4", name: "Chris Evans", points: 212, connectionsThisWeek: 7 },
    { id: "leader5", name: "Serena Williams", points: 187, connectionsThisWeek: 6 },
  ];

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-background to-background/70">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#000000]">Find Your Perfect Match</h1>
      
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
                />
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Connect, pass, or save profiles for later
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {savedProfiles.length > 0 ? (
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
            )}
          </TabsContent>
          
          <TabsContent value="connections">
            {connections.length > 0 ? (
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
            )}
          </TabsContent>
          
          <TabsContent value="chat">
            <InstantChat currentUser={currentUser} />
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
              onConnect={handleConnect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
