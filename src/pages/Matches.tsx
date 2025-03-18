
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
import { Users, Flame, MessageSquareText, BookmarkPlus, MapPin } from "lucide-react";
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
  
  // Connections state
  const [connections, setConnections] = useState<UserProfile[]>([]);
  
  // Get user's location
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
  
  // Initialize with sample data
  useEffect(() => {
    const sampleUsers = loadSampleUsers();
    
    // Add distances to users if we have location
    if (userLocation) {
      const usersWithDistance = sampleUsers.map(user => {
        // Mock coordinates for sample users based on their location
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
      
      // Find matches for current user with distances
      const matchesFound = findMatches(currentUser)
        .map(match => {
          const userWithDistance = usersWithDistance.find(u => u.id === match.id);
          return userWithDistance || match;
        });
      
      setMatches(matchesFound);
    } else {
      setAllUsers(sampleUsers);
      
      // Find matches for current user
      const matchesFound = findMatches(currentUser);
      setMatches(matchesFound);
    }
    
    // Set up some initial connections
    setConnections([sampleUsers[2], sampleUsers[4]]);
  }, [userLocation]);
  
  // Mock function to get coordinates for sample users
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
    };
    
    return locationMap[location] || null;
  };
  
  // Handle intro message
  const handleSendIntro = (profileId: string, message: string) => {
    const profile = matches.find(p => p.id === profileId);
    if (profile) {
      console.log(`Sending intro to ${profile.name}: ${message}`);
      // In a real app, this would send the message to the backend
    }
  };
  
  // Handle new match
  const handleNewMatch = (profile: UserProfile) => {
    // Add to connections
    setConnections(prev => {
      if (prev.some(p => p.id === profile.id)) return prev;
      return [...prev, profile];
    });
    
    // Switch to connections tab after a delay
    setTimeout(() => {
      setActiveTab("connections");
    }, 1500);
  };
  
  // Handle refresh matches
  const handleRefreshMatches = () => {
    // Simulate refreshing matches
    let refreshedMatches = findMatches(currentUser);
    
    // Add distances to new matches if we have location
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
  
  // Handle connect action
  const handleConnect = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId) || 
                    savedProfiles.find(p => p.id === profileId);
    if (profile) {
      // Add to connections
      setConnections(prev => {
        if (prev.some(p => p.id === profileId)) return prev;
        return [...prev, profile];
      });
      
      // Remove from saved if it was there
      setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
      
      toast.success(`Connected with ${profile.name}!`);
    }
  };
  
  // Handle view profile
  const handleViewProfile = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId) || 
                    connections.find(p => p.id === profileId) ||
                    savedProfiles.find(p => p.id === profileId);
    
    if (profile) {
      toast.info(`Viewing ${profile.name}'s profile`);
      // In a real app, this would navigate to the profile page
    }
  };
  
  // Handle start matching
  const handleStartMatching = () => {
    setActiveTab("discover");
  };
  
  // Handle save for later
  const handleSaveForLater = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId);
    if (profile && !savedProfiles.some(p => p.id === profileId)) {
      setSavedProfiles(prev => [...prev, profile]);
      
      // Remove from visible matches
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

  // Handle filter application
  const handleApplyFilters = (filters: FilterOptions) => {
    // Update current user with filter preferences
    setCurrentUser(prev => ({
      ...prev,
      userType: filters.userType || prev.userType,
      industry: filters.industry.length > 0 ? filters.industry[0] : prev.industry,
      skills: filters.skills.length > 0 ? filters.skills : prev.skills,
      experienceLevel: filters.experienceLevel || prev.experienceLevel,
      relationshipGoal: filters.relationshipGoal || prev.relationshipGoal,
      // Use locationPreference instead of location
      location: filters.locationPreference === "local" ? prev.location : prev.location,
    }));
    
    // Find filtered matches
    let filteredMatches = findMatches(currentUser);
    
    // Apply additional filters
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
      filteredMatches = filteredMatches.filter(m => 
        filters.locationPreference === "global" || 
        (filters.locationPreference === "country" && m.country === currentUser.country) ||
        (filters.locationPreference === "local" && m.location === currentUser.location)
      );
    }
    
    // Add distances to filtered matches if we have location
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">Find Your Perfect Match</h1>
      
      <div className="mb-8 max-w-lg mx-auto">
        <Tabs 
          defaultValue="discover" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="discover" className="flex items-center">
              <Flame className="mr-2 h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Saved
              {savedProfiles.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {savedProfiles.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Connections
              {connections.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {connections.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquareText className="mr-2 h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover">
            {/* Filter component */}
            {!filterApplied && <MatchFilter onApplyFilters={handleApplyFilters} />}
            
            {filterApplied && matches.length === 0 ? (
              <Card className="text-center p-6 mb-6">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No matches found with these filters</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to find more matches
                  </p>
                  <Button onClick={() => setFilterApplied(false)}>Adjust Filters</Button>
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
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved profiles yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Save interesting profiles while browsing to review them later.
                  </p>
                  <Button onClick={handleStartMatching}>Start Discovering</Button>
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
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start discovering people and make connections to see them here.
                  </p>
                  <Button onClick={handleStartMatching}>Start Matching</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="chat">
            <InstantChat currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Recently Active</h2>
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
