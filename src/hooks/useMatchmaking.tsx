
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  location?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  avatar_url?: string;
  latitude?: number;
  longitude?: number;
  match_score?: number;
  distance?: number;
}

export interface MatchmakingFilters {
  industry?: string;
  distance?: number;
  skills?: string[];
  interests?: string[];
}

interface UseMatchmakingProps {
  filters?: MatchmakingFilters;
  enabled?: boolean;
}

export const useMatchmaking = ({ 
  filters = {}, 
  enabled = true 
}: UseMatchmakingProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [searchRadius, setSearchRadius] = useState(filters.distance || 25);
  const { user } = useAuth();
  
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    showErrorToasts: false
  });

  // Update user's location in the database
  const updateUserLocation = async (latitude: number, longitude: number) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('user_profiles')
        .update({ latitude, longitude })
        .eq('id', user.id);
      
      console.log('Updated user location in database');
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  // When location changes, update it in the database
  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude && user?.id) {
      updateUserLocation(geolocation.latitude, geolocation.longitude);
    }
  }, [geolocation.latitude, geolocation.longitude, user?.id]);

  // Calculate a match score between users
  const calculateMatchScore = (userProfile: UserProfile): number => {
    let score = 50; // Base score
    
    // Industry match (high priority)
    if (filters.industry && userProfile.industry === filters.industry) {
      score += 20;
    }
    
    // Skills match
    if (filters.skills && userProfile.skills) {
      const matchingSkills = filters.skills.filter(skill => 
        userProfile.skills?.includes(skill)
      ).length;
      score += matchingSkills * 5;
    }
    
    // Interests match
    if (filters.interests && userProfile.interests) {
      const matchingInterests = filters.interests.filter(interest => 
        userProfile.interests?.includes(interest)
      ).length;
      score += matchingInterests * 5;
    }
    
    // Cap the score at 100
    return Math.min(score, 100);
  };

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10; // Round to 1 decimal place
  };

  // Fetch all users from database
  const fetchUsers = async (): Promise<UserProfile[]> => {
    if (!user?.id) return [];
    
    try {
      // Fetch all profiles except current user
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', user.id);
        
      if (error) throw error;
      
      return data as UserProfile[];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Find matches based on filters and location
  const findMatches = async () => {
    if (!user?.id) {
      setMatches([]);
      setError("Please log in to find matches");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Request location if we don't have it
      if (!geolocation.latitude || !geolocation.longitude) {
        const success = await geolocation.requestLocation();
        if (!success) {
          console.log("Couldn't get location, proceeding without location filtering");
        }
      }
      
      // Fetch all users
      const allUsers = await fetchUsers();
      
      if (allUsers.length === 0) {
        setError("No users found in the database");
        return;
      }
      
      console.log(`Found ${allUsers.length} users in database`);
      
      // Process users to add match score and distance
      const processedUsers = allUsers.map(userProfile => {
        // Calculate match score
        const matchScore = calculateMatchScore(userProfile);
        
        // Calculate distance if we have coordinates
        let distance: number | undefined = undefined;
        if (geolocation.latitude && geolocation.longitude && 
            userProfile.latitude && userProfile.longitude) {
          distance = calculateDistance(
            geolocation.latitude, 
            geolocation.longitude,
            userProfile.latitude, 
            userProfile.longitude
          );
        }
        
        return {
          ...userProfile,
          match_score: matchScore,
          distance
        };
      });
      
      // Apply filters
      let filteredMatches = processedUsers;
      
      // Filter by distance if we have location info
      if (geolocation.latitude && geolocation.longitude && searchRadius) {
        filteredMatches = filteredMatches.filter(profile => 
          !profile.distance || profile.distance <= searchRadius
        );
      }
      
      // Apply industry filter if specified
      if (filters.industry) {
        // Only filter if we have enough users, otherwise show all
        const industryFiltered = filteredMatches.filter(profile => 
          profile.industry?.toLowerCase() === filters.industry?.toLowerCase()
        );
        
        if (industryFiltered.length >= 2) {
          filteredMatches = industryFiltered;
        }
      }
      
      // Apply skills filter if specified
      if (filters.skills && filters.skills.length > 0) {
        // Only filter if we have enough users, otherwise show all
        const skillsFiltered = filteredMatches.filter(profile => 
          profile.skills?.some(skill => filters.skills?.includes(skill))
        );
        
        if (skillsFiltered.length >= 2) {
          filteredMatches = skillsFiltered;
        }
      }
      
      // Apply interests filter if specified
      if (filters.interests && filters.interests.length > 0) {
        // Only filter if we have enough users, otherwise show all
        const interestsFiltered = filteredMatches.filter(profile => 
          profile.interests?.some(interest => filters.interests?.includes(interest))
        );
        
        if (interestsFiltered.length >= 2) {
          filteredMatches = interestsFiltered;
        }
      }
      
      // Sort by match score (highest first)
      filteredMatches.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      
      setMatches(filteredMatches);
      
      // If no matches found after filtering, use fallback
      if (filteredMatches.length === 0) {
        setError("No matches found with current filters. Try expanding your search criteria.");
        // Fallback to all users
        setMatches(processedUsers);
      }
    } catch (error) {
      console.error("Error finding matches:", error);
      setError("Failed to find matches. Please try again later.");
      toast.error("Error finding matches");
    } finally {
      setIsLoading(false);
    }
  };

  // Expand search radius
  const expandSearchRadius = () => {
    const newRadius = Math.min(searchRadius + 25, 100);
    setSearchRadius(newRadius);
    toast.info(`Expanded search radius to ${newRadius}km`);
    return newRadius;
  };

  // Refresh matches
  const refreshMatches = () => {
    findMatches();
  };

  // Initial fetch and when filters/radius changes
  useEffect(() => {
    if (enabled) {
      findMatches();
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
