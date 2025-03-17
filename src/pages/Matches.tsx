
import React, { useState, useEffect } from "react";
import { 
  loadSampleUsers, 
  UserProfile, 
  findMatches 
} from '@/lib/matchmaking';
import MatchCardConnectable from '@/components/MatchCardConnectable';
import SwipeContainer from '@/components/SwipeContainer';
import InstantChat from '@/components/InstantChat';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Flame, MessageSquareText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MatchFilter, { FilterOptions } from "@/components/MatchFilter";

const Matches = () => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [filterApplied, setFilterApplied] = useState(false);
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
    maxDailySwipes: 20
  });
  
  // Connections state
  const [connections, setConnections] = useState<UserProfile[]>([]);
  
  // Initialize with sample data
  useEffect(() => {
    const sampleUsers = loadSampleUsers();
    setAllUsers(sampleUsers);
    
    // Find matches for current user
    const matchesFound = findMatches(currentUser);
    setMatches(matchesFound);
    
    // Set up some initial connections
    setConnections([sampleUsers[2], sampleUsers[4]]);
  }, []);
  
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
    const refreshedMatches = findMatches(currentUser);
    setMatches(refreshedMatches);
    toast.success("Found new matches!");
  };
  
  // Handle connect action
  const handleConnect = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId);
    if (profile) {
      // Add to connections
      setConnections(prev => {
        if (prev.some(p => p.id === profileId)) return prev;
        return [...prev, profile];
      });
      
      toast.success(`Connected with ${profile.name}!`);
    }
  };
  
  // Handle view profile
  const handleViewProfile = (profileId: string) => {
    const profile = matches.find(p => p.id === profileId) || 
                    connections.find(p => p.id === profileId);
    
    if (profile) {
      toast.info(`Viewing ${profile.name}'s profile`);
      // In a real app, this would navigate to the profile page
    }
  };
  
  // Handle start matching
  const handleStartMatching = () => {
    setActiveTab("discover");
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
      location: filters.location || prev.location,
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
    
    if (filters.location) {
      filteredMatches = filteredMatches.filter(m => 
        filters.location === "global" || m.location === filters.location
      );
    }
    
    setMatches(filteredMatches);
    setFilterApplied(true);
    toast.success("Filters applied successfully!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Your Perfect Match</h1>
      
      <div className="mb-8 max-w-lg mx-auto">
        <Tabs 
          defaultValue="discover" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="discover" className="flex items-center">
              <Flame className="mr-2 h-4 w-4" />
              Discover
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
              Instant Chat
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
                  />
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Swipe right to connect, swipe left to pass
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
                />
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Swipe right to connect, swipe left to pass
                </div>
              </>
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
