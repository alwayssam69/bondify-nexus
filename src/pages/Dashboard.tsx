
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MatchCardConnectable from "@/components/MatchCardConnectable";
import { UserProfile } from "@/lib/matchmaking";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getMatchRecommendations, getProximityMatches, updateUserCoordinates } from "@/services/MatchmakingAPI";
import { Loader2, MapPin, Filter, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [recommendedMatches, setRecommendedMatches] = useState<UserProfile[]>([]);
  const [nearbyMatches, setNearbyMatches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recommended");
  const [radius, setRadius] = useState(50); // Default radius in km

  useEffect(() => {
    if (user?.id) {
      loadMatchData();
      detectUserLocation();
    }
  }, [user]);

  const loadMatchData = async () => {
    setIsLoading(true);
    try {
      // Load recommended matches based on profile similarity
      const recommendedData = await getMatchRecommendations(user?.id || "", 10);
      setRecommendedMatches(recommendedData);

      // Also load nearby matches if we have the user's location
      const proximityData = await getProximityMatches(user?.id || "", radius, 10);
      setNearbyMatches(proximityData);
    } catch (error) {
      console.error("Error loading match data:", error);
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update user coordinates in database
          if (user?.id) {
            const success = await updateUserCoordinates(user.id, latitude, longitude);
            if (success) {
              toast.success("Location updated successfully!");
              // Reload proximity matches with the new location
              const proximityData = await getProximityMatches(user.id, radius, 10);
              setNearbyMatches(proximityData);
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not detect your location. Location-based matching is limited.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleViewProfile = (id: string) => {
    // Navigate to profile view or open modal
    console.log("View profile:", id);
  };

  const handleConnectRequest = async (id: string) => {
    toast.success("Connection request sent!");
    // Implement actual connection request logic here
  };

  const handleRefreshMatches = () => {
    loadMatchData();
    toast("Refreshing your matches...");
  };

  return (
    <MainLayout>
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
                <Sparkles className="mr-2 h-4 w-4" />
                Refresh Matches
              </>
            )}
          </Button>
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
            ) : recommendedMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedMatches.map((profile, index) => (
                  <MatchCardConnectable
                    key={profile.id}
                    profile={profile}
                    delay={index * 100}
                    onViewProfile={handleViewProfile}
                    onConnect={handleConnectRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your profile to help us find better matches for you
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
            ) : nearbyMatches.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Showing professionals within {radius} km
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyMatches.map((profile, index) => (
                    <MatchCardConnectable
                      key={profile.id}
                      profile={profile}
                      delay={index * 100}
                      onViewProfile={handleViewProfile}
                      onConnect={handleConnectRequest}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No nearby professionals found</h3>
                <p className="text-muted-foreground mb-4">
                  Try increasing your search radius or check back later
                </p>
                <Button variant="outline" onClick={detectUserLocation}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Update Location
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
