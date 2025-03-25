
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";
import { UserProfile as LibUserProfile } from "@/lib/matchmaking";

export interface UserProfile {
  id: string;
  username?: string; 
  full_name: string;
  name?: string;
  bio?: string;
  location?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  avatar_url?: string;
  image_url?: string; // Explicitly added to fix TypeScript errors
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  match_score?: number;
  matchScore?: number;
  distance?: number;
  age?: number;
  gender?: string;
  relationshipGoal?: string;
  language?: string;
  experienceLevel?: string;
  userType?: string;
  activityScore?: number;
  profileCompleteness?: number;
  userTag?: string;
}

export interface MatchmakingFilters {
  industry?: string;
  distance?: number;
  skills?: string[];
  interests?: string[];
  relationshipGoal?: string;
  helpType?: 'need' | 'offer';
  experienceLevel?: string;
  useLocation?: boolean;
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

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude && user?.id) {
      updateUserLocation(geolocation.latitude, geolocation.longitude);
    }
  }, [geolocation.latitude, geolocation.longitude, user?.id]);

  const calculateMatchScore = (userProfile: UserProfile): number => {
    let score = 50;
    
    if (filters.industry && userProfile.industry === filters.industry) {
      score += 20;
    }
    
    if (filters.skills && userProfile.skills) {
      const matchingSkills = filters.skills.filter(skill => 
        userProfile.skills?.includes(skill)
      ).length;
      score += matchingSkills * 5;
    }
    
    if (filters.interests && userProfile.interests) {
      const matchingInterests = filters.interests.filter(interest => 
        userProfile.interests?.includes(interest)
      ).length;
      score += matchingInterests * 5;
    }
    
    return Math.min(score, 100);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return Math.round(d * 10) / 10;
  };

  const fetchUsers = async (): Promise<UserProfile[]> => {
    if (!user?.id) return [];
    
    try {
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

  const findMatches = async () => {
    if (!user?.id) {
      setMatches([]);
      setError("Please log in to find matches");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (!geolocation.latitude || !geolocation.longitude) {
        const success = await geolocation.requestLocation();
        if (!success) {
          console.log("Couldn't get location, proceeding without location filtering");
        }
      }
      
      const allUsers = await fetchUsers();
      
      if (allUsers.length === 0) {
        setError("No users found in the database");
        return;
      }
      
      console.log(`Found ${allUsers.length} users in database`);
      
      const processedUsers = allUsers.map(userProfile => {
        const matchScore = calculateMatchScore(userProfile);
        
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
      
      let filteredMatches = processedUsers;
      
      if (geolocation.latitude && geolocation.longitude && searchRadius) {
        filteredMatches = filteredMatches.filter(profile => 
          !profile.distance || profile.distance <= searchRadius
        );
      }
      
      if (filters.industry) {
        const industryFiltered = filteredMatches.filter(profile => 
          profile.industry?.toLowerCase() === filters.industry?.toLowerCase()
        );
        
        if (industryFiltered.length >= 2) {
          filteredMatches = industryFiltered;
        }
      }
      
      if (filters.skills && filters.skills.length > 0) {
        const skillsFiltered = filteredMatches.filter(profile => 
          profile.skills?.some(skill => filters.skills?.includes(skill))
        );
        
        if (skillsFiltered.length >= 2) {
          filteredMatches = skillsFiltered;
        }
      }
      
      if (filters.interests && filters.interests.length > 0) {
        const interestsFiltered = filteredMatches.filter(profile => 
          profile.interests?.some(interest => filters.interests?.includes(interest))
        );
        
        if (interestsFiltered.length >= 2) {
          filteredMatches = interestsFiltered;
        }
      }
      
      filteredMatches.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      
      setMatches(filteredMatches);
      
      if (filteredMatches.length === 0) {
        setError("No matches found with current filters. Try expanding your search criteria.");
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

  const expandSearchRadius = () => {
    const newRadius = Math.min(searchRadius + 25, 100);
    setSearchRadius(newRadius);
    toast.info(`Expanded search radius to ${newRadius}km`);
    return newRadius;
  };

  const refreshMatches = () => {
    findMatches();
  };

  useEffect(() => {
    if (enabled) {
      findMatches();
    }
    
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
