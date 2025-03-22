import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MatchCardConnectable from "@/components/MatchCardConnectable";
import { UserProfile } from "@/lib/matchmaking";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchRecommendations, getProximityMatches, updateUserCoordinates } from "@/services/MatchmakingAPI";
import { Loader2, MapPin, Filter, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [recommendedMatches, setRecommendedMatches] = useState<UserProfile[]>([]);
  const [nearbyMatches, setNearbyMatches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recommended");
  const [radius, setRadius] = useState(50);
  const geolocation = useGeolocation({ watch: false });

  useEffect(() => {
    if (user?.id) {
      loadMatchData();
      
      if (geolocation.latitude && geolocation.longitude && !geolocation.error) {
        updateUserLocationCoordinates(geolocation.latitude, geolocation.longitude);
      }
    }
  }, [user, geolocation.latitude, geolocation.longitude]);

  const loadMatchData = async () => {
    setIsLoading(true);
    try {
      const recommendedData = await getMatchRecommendations(user?.id || "", 10);
      setRecommendedMatches(recommendedData);

      if (geolocation.latitude && geolocation.longitude) {
        const proximityData = await getProximityMatches(user?.id || "", radius, 10);
        setNearbyMatches(proximityData);
      }
    } catch (error) {
      console.error("Error loading match data:", error);
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserLocationCoordinates = async (latitude: number, longitude: number) => {
    if (user?.id) {
      const success = await updateUserCoordinates(user.id, latitude, longitude);
      if (success) {
        toast.success("Location updated successfully!");
        const proximityData = await getProximityMatches(user.id, radius, 10);
        setNearbyMatches(proximityData);
      }
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
    toast("Refreshing your matches...");
  };

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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (geolocation.latitude && geolocation.longitude) {
                      updateUserLocationCoordinates(geolocation.latitude, geolocation.longitude);
                    } else {
                      toast.error("Unable to detect location. Please check your browser settings.");
                    }
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Update Location
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
