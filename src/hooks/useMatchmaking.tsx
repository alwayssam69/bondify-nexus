
import { useState, useEffect } from "react";
import { UserProfile, findMatches } from "@/lib/matchmaking";
import { MatchmakingFilters } from "@/types/matchmaking";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

interface UseMatchmakingProps {
  filters: MatchmakingFilters;
  enabled?: boolean;
}

interface MatchmakingResult {
  isLoading: boolean;
  error: string | null;
  matches: UserProfile[];
  hasMatches: boolean;
  expandSearchRadius: () => void;
  refreshMatches: () => void;
}

export const useMatchmaking = ({ 
  filters, 
  enabled = true 
}: UseMatchmakingProps): MatchmakingResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [searchRadius, setSearchRadius] = useState(filters.distance || 25);
  
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    showErrorToasts: false
  });

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we need location but don't have it
      if (filters.useLocation && (!geolocation.latitude || !geolocation.longitude)) {
        if (geolocation.error) {
          setError("Location access is required for proximity matching. Please enable location permissions.");
        } else if (geolocation.isLoading) {
          // Still loading location, wait and retry
          setTimeout(fetchMatches, 1000);
          return;
        }
      }

      // Create current user profile for matchmaking
      const currentUserProfile: UserProfile = {
        id: "current-user",
        name: "Current User",
        age: 30,
        interests: [],
        location: "Current Location",
        relationshipGoal: "networking",
        industry: filters.industry,
        skills: filters.skills,
        userType: filters.helpType === "need" ? "student" : "mentor",
        // Add location data if available
        latitude: geolocation.latitude || undefined,
        longitude: geolocation.longitude || undefined,
        // Set search distance
        distance: searchRadius
      };

      // In a real app, we would call an API with the filters
      // Here we're using the local matchmaking library for demo purposes
      const matchedProfiles = findMatches(currentUserProfile);
      
      // Short delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMatches(matchedProfiles);
    } catch (error) {
      console.error("Error finding matches:", error);
      setError("Failed to find matches. Please try again later.");
      toast.error("Error finding matches");
    } finally {
      setIsLoading(false);
    }
  };

  const expandSearchRadius = () => {
    const newRadius = Math.min(searchRadius + 25, 100);
    setSearchRadius(newRadius);
    toast.info(`Expanded search radius to ${newRadius}km`);
  };

  const refreshMatches = () => {
    fetchMatches();
  };

  useEffect(() => {
    if (enabled) {
      fetchMatches();
    }
  }, [filters, searchRadius, enabled]);

  // Effect to refetch when geolocation changes
  useEffect(() => {
    if (enabled && filters.useLocation && geolocation.latitude && geolocation.longitude) {
      fetchMatches();
    }
  }, [geolocation.latitude, geolocation.longitude]);

  return {
    isLoading,
    error,
    matches,
    hasMatches: matches.length > 0,
    expandSearchRadius,
    refreshMatches
  };
};
