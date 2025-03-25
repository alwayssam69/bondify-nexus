
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

      // Skip algorithm and fetch all users directly
      console.log("Fetching all users from database");
      const allUsers = await fetchAllUsers();
      
      if (allUsers.length === 0) {
        setError("No users found in the database");
        setIsLoading(false);
        return;
      }
      
      console.log("Found", allUsers.length, "users in database");
      
      // Apply minimal filtering if we have users
      let filteredMatches = allUsers;
      
      // If filters are specified and we have enough users, apply them lightly
      if (allUsers.length > 3) {
        if (filters.industry) {
          const industryFiltered = filteredMatches.filter(profile => 
            profile.industry?.toLowerCase() === filters.industry?.toLowerCase()
          );
          
          // Only apply industry filter if it doesn't eliminate too many results
          if (industryFiltered.length >= 2) {
            filteredMatches = industryFiltered;
          }
        }
      }

      // Sort by match score (highest first)
      filteredMatches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setMatches(filteredMatches);
      
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

  return {
    isLoading,
    error,
    matches,
    hasMatches: matches.length > 0,
    expandSearchRadius,
    refreshMatches
  };
};
