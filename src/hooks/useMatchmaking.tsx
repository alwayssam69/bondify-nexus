
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
import { supabase } from "@/integrations/supabase/client";

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

  const fetchAllUsers = async (): Promise<UserProfile[]> => {
    console.log("Fetching all users as fallback");
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', user?.id || '')
        .limit(20);
        
      if (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No users found in database");
        return [];
      }
      
      return data.map(profile => ({
        id: profile.id,
        name: profile.full_name || 'Unknown User',
        location: profile.location || 'Unknown Location',
        bio: profile.bio || '',
        industry: profile.industry || 'Unknown Industry',
        experienceLevel: profile.experience_level || 'beginner',
        userType: profile.user_type || 'Professional',
        skills: profile.skills || [],
        interests: profile.interests || [],
        imageUrl: profile.image_url || '',
        matchScore: Math.floor(60 + Math.random() * 30), // Random score between 60-90
        // Add other required properties
        age: estimateAgeFromExperienceLevel(profile.experience_level),
        relationshipGoal: 'networking',
        language: 'English',
        activityScore: 75,
        profileCompleteness: 80,
        userTag: profile.user_tag || '',
      }));
    } catch (error) {
      console.error("Error in fetchAllUsers:", error);
      return [];
    }
  };
  
  const estimateAgeFromExperienceLevel = (experienceLevel: string | null): number => {
    switch (experienceLevel) {
      case 'beginner':
        return 20 + Math.floor(Math.random() * 5);
      case 'intermediate':
        return 25 + Math.floor(Math.random() * 5);
      case 'expert':
        return 30 + Math.floor(Math.random() * 10);
      default:
        return 25 + Math.floor(Math.random() * 10);
    }
  };

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
        }
      }

      // If still no matches, fetch all users as fallback
      if (matchedProfiles.length === 0) {
        console.log("No matches found with algorithm, fetching all users as fallback");
        try {
          matchedProfiles = await fetchAllUsers();
          console.log("Found", matchedProfiles.length, "users as fallback");
          
          if (matchedProfiles.length > 0) {
            toast.info("Showing all available users", { 
              description: "Couldn't find specific matches for your criteria"
            });
          }
        } catch (e) {
          console.error("Error fetching all users:", e);
          
          // Set a timeout to end loading state after 5 seconds
          setTimeout(() => {
            if (isLoading) {
              setIsLoading(false);
              setError("Could not find any users at this time. Please try again later.");
            }
          }, 5000);
          return;
        }
      }

      // Apply additional filters only if we have enough matches
      let filteredMatches = matchedProfiles;
      
      // If we have more than 5 matches, apply filters, otherwise show all matches
      if (matchedProfiles.length > 5) {
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
        
        // If filtering removed too many matches, go back to all matches
        if (filteredMatches.length < 3 && matchedProfiles.length > 5) {
          console.log("Too few matches after filtering, showing all matches");
          filteredMatches = matchedProfiles;
          toast.info("Showing all matches", {
            description: "Not enough matches with your filters"
          });
        }
      }

      // Sort by match score (highest first)
      filteredMatches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setMatches(filteredMatches);
      
      if (filteredMatches.length === 0) {
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
    return newRadius;
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
