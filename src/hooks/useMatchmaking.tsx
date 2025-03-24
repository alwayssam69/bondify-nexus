
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
  const [isLoading, setIsLoading] = useState(true);
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

      let matchedProfiles: UserProfile[] = [];

      // Priority 1: Location-based matching (if enabled and coordinates are available)
      if (filters.useLocation && geolocation.latitude && geolocation.longitude) {
        console.log("Attempting to find proximity matches within", searchRadius, "km");
        matchedProfiles = await getProximityMatches(user.id, searchRadius, 20);
      }

      // Priority 2: If no location matches or location not enabled, fall back to skills/interest matches
      if (matchedProfiles.length === 0) {
        console.log("No proximity matches or location not enabled, falling back to skill-based matching");
        matchedProfiles = await getMatchRecommendations(user.id, 20);
      }

      // Filter results based on additional criteria if needed
      if (filters.industry) {
        matchedProfiles = matchedProfiles.filter(profile => 
          profile.industry?.toLowerCase() === filters.industry?.toLowerCase()
        );
      }

      if (filters.skills && filters.skills.length > 0) {
        matchedProfiles = matchedProfiles.filter(profile => 
          profile.skills?.some(skill => 
            filters.skills?.includes(skill)
          )
        );
      }

      if (filters.experienceLevel) {
        matchedProfiles = matchedProfiles.filter(profile => 
          profile.experienceLevel?.toLowerCase() === filters.experienceLevel?.toLowerCase()
        );
      }

      // Sort by match score (highest first)
      matchedProfiles.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
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
