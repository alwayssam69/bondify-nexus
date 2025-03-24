
import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/matchmaking";
import { MatchmakingFilters } from "@/types/matchmaking";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  getMatchRecommendations, 
  getProximityMatches 
} from "@/services/MatchmakingService";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [searchRadius, setSearchRadius] = useState(filters.distance || 25);
  const { user } = useAuth();
  
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    showErrorToasts: false
  });

  const fetchMatches = async () => {
    if (!user?.id) {
      setMatches([]);
      setError("Please log in to find matches");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Starting match search for user:", user.id);

      let matchedProfiles: UserProfile[] = [];
      let nearbyFound = false;

      // Priority 1: Location-based matching (if enabled and coordinates are available)
      if (filters.useLocation && geolocation.latitude && geolocation.longitude) {
        console.log("Fetching proximity matches within", searchRadius, "km");
        try {
          const proximityMatches = await getProximityMatches(user.id, searchRadius, 20);
          
          if (proximityMatches.length > 0) {
            matchedProfiles = proximityMatches;
            nearbyFound = true;
            console.log("Found", proximityMatches.length, "proximity matches");
          } else {
            console.log("No proximity matches found, falling back to skill-based");
          }
        } catch (e) {
          console.error("Error in proximity matching, falling back to skill-based:", e);
        }
      }

      // Priority 2: If no location matches or location not enabled, fall back to skills/interest matches
      if (!nearbyFound) {
        console.log("Fetching skill-based matches");
        try {
          matchedProfiles = await getMatchRecommendations(user.id, 20);
          console.log("Found", matchedProfiles.length, "skill-based matches");
        } catch (e) {
          console.error("Error in skill-based matching:", e);
          
          // Last resort - use sample data
          if (matchedProfiles.length === 0) {
            console.log("Using fallback sample data");
            import("@/lib/matchmaking").then(({ loadSampleUsers }) => {
              const sampleUsers = loadSampleUsers();
              setMatches(sampleUsers);
              if (sampleUsers.length > 0) {
                toast.info("Using sample recommendations", {
                  description: "We couldn't load personalized matches right now"
                });
              }
            });
          }
        }
      }

      // Apply additional filters
      let filteredMatches = matchedProfiles;
      
      if (filters.industry) {
        filteredMatches = filteredMatches.filter(profile => 
          profile.industry?.toLowerCase() === filters.industry?.toLowerCase()
        );
      }

      if (filters.skills && filters.skills.length > 0) {
        filteredMatches = filteredMatches.filter(profile => 
          profile.skills?.some(skill => 
            filters.skills?.includes(skill)
          )
        );
      }

      if (filters.experienceLevel) {
        filteredMatches = filteredMatches.filter(profile => 
          profile.experienceLevel?.toLowerCase() === filters.experienceLevel?.toLowerCase()
        );
      }

      if (filters.relationshipGoal) {
        filteredMatches = filteredMatches.filter(profile => {
          return profile.relationshipGoal === filters.relationshipGoal ||
            (filters.relationshipGoal === "mentorship" && profile.relationshipGoal === "networking") ||
            (filters.relationshipGoal === "job" && profile.relationshipGoal === "networking") ||
            (filters.relationshipGoal === "collaboration" && profile.relationshipGoal === "networking");
        });
      }

      // Sort by match score (highest first)
      filteredMatches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setMatches(filteredMatches);
      
      // If we applied filters and got no results, but had matches before filtering
      if (filteredMatches.length === 0 && matchedProfiles.length > 0) {
        toast.info("No matches found with your filters", {
          description: "Try adjusting your search criteria for better results"
        });
      }
      
      if (filteredMatches.length === 0 && matchedProfiles.length === 0) {
        setError("No matches found. Try expanding your search criteria or check back later.");
      }
      
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
    
    // Force end loading state after 8 seconds to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Force ending match loading state after timeout");
        setIsLoading(false);
        if (matches.length === 0) {
          setError("Loading took too long. Please try again later.");
        }
      }
    }, 8000);
    
    return () => clearTimeout(timeout);
  }, [filters, searchRadius, enabled, user?.id]);

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
