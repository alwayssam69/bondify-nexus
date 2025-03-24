
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, calculateMatchScore } from "@/lib/matchmaking";

// Interface for match results from Supabase
interface MatchResult {
  id: string;
  full_name: string;
  location: string;
  industry: string | null;
  user_type: string | null;
  experience_level: string | null;
  skills: string[] | null;
  interests: string[] | null;
  bio: string | null;
  image_url: string | null;
  match_score?: number;
  distance_km?: number;
  university?: string | null;
  course_year?: string | null;
  networking_goals?: string[] | null;
  project_interests?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Get match recommendations for a user based on their profile
 */
export const getMatchRecommendations = async (userId: string, limit: number = 20): Promise<UserProfile[]> => {
  try {
    // First get the user's profile for matching
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user profile:', userError);
      return [];
    }
    
    // Check if profile has essential data for matching
    if (!userProfile.skills || !userProfile.industry) {
      console.warn('User profile is missing essential data for matching');
      return [];
    }
    
    // Get potential matches
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', userId)
      .limit(limit);

    if (error) {
      console.error('Error fetching match recommendations:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Calculate match scores based on the user's profile
    const matches = data.map(profile => {
      // Calculate match score
      const matchScore = calculateMatchScore(userProfile, profile);
      
      return {
        ...profile,
        match_score: matchScore
      };
    });
    
    // Sort by match score
    matches.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    
    return transformMatchResults(matches);
  } catch (error) {
    console.error('Exception in getMatchRecommendations:', error);
    return [];
  }
};

/**
 * Get matches for a user based on proximity within a specified radius
 */
export const getProximityMatches = async (
  userId: string, 
  radiusKm: number = 50, 
  limit: number = 20
): Promise<UserProfile[]> => {
  try {
    // First get the user's profile with coordinates
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userError || !userProfile.latitude || !userProfile.longitude) {
      console.error('Error fetching user profile or missing coordinates:', userError);
      return [];
    }
    
    // Get all users and calculate distance manually
    // (In a production app, we would use PostgreSQL's earthdistance functions)
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', userId)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(limit * 2); // Get more to filter

    if (error) {
      console.error('Error fetching proximity matches:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Calculate distances and filter
    const matches = data
      .map(profile => {
        if (!profile.latitude || !profile.longitude) {
          return { ...profile, distance_km: Infinity };
        }
        
        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          userProfile.latitude,
          userProfile.longitude,
          profile.latitude,
          profile.longitude
        );
        
        // Calculate match score
        const matchScore = calculateMatchScore(userProfile, profile);
        
        return {
          ...profile,
          distance_km: distance,
          match_score: matchScore
        };
      })
      .filter(profile => profile.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, limit);
    
    return transformMatchResults(matches);
  } catch (error) {
    console.error('Exception in getProximityMatches:', error);
    return [];
  }
};

/**
 * Update user coordinates for location-based matching
 */
export const updateUserCoordinates = async (
  userId: string,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        latitude, 
        longitude,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user coordinates:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in updateUserCoordinates:', error);
    return false;
  }
};

/**
 * Get confirmed matches for a user
 */
export const getConfirmedMatches = async (userId: string): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_matches')
      .select('matched_user_id, status, match_score, last_activity')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching confirmed matches:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      // If no accepted matches, try getting pending ones
      const { data: pendingData, error: pendingError } = await supabase
        .from('user_matches')
        .select('matched_user_id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .limit(3);
        
      if (pendingError || !pendingData || pendingData.length === 0) {
        return [];
      }
      
      // Get full profiles for pending matches
      const matchedUserIds = pendingData.map(match => match.matched_user_id);
      const { data: pendingProfiles, error: pendingProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', matchedUserIds);
  
      if (pendingProfilesError || !pendingProfiles) {
        return [];
      }
      
      return transformMatchResults(pendingProfiles);
    }

    // Get full profiles for matched users
    const matchedUserIds = data.map(match => match.matched_user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', matchedUserIds);

    if (profilesError || !profiles) {
      return [];
    }

    // Combine match data with profile data
    const enrichedProfiles = profiles.map(profile => {
      const matchData = data.find(m => m.matched_user_id === profile.id);
      return {
        ...profile,
        match_score: matchData?.match_score || 0,
        last_activity: matchData?.last_activity
      };
    });

    return transformMatchResults(enrichedProfiles);
  } catch (error) {
    console.error('Exception in getConfirmedMatches:', error);
    return [];
  }
};

/**
 * Record a swipe action (like/pass)
 */
export const recordSwipeAction = async (
  userId: string,
  targetId: string,
  action: 'like' | 'pass' | 'save'
): Promise<{ success: boolean; match?: boolean }> => {
  try {
    const { error } = await supabase
      .from('user_swipes')
      .insert({
        user_id: userId,
        target_id: targetId,
        action: action
      });

    if (error) {
      console.error('Error recording swipe action:', error);
      return { success: false };
    }

    // If it's a like, create a match if the other user has also liked
    if (action === 'like') {
      const { data: mutual, error: mutualError } = await supabase
        .from('user_swipes')
        .select('*')
        .eq('user_id', targetId)
        .eq('target_id', userId)
        .eq('action', 'like')
        .maybeSingle();

      if (!mutualError && mutual) {
        // Calculate match score
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        const { data: targetProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', targetId)
          .single();
          
        const matchScore = userProfile && targetProfile ? 
          calculateMatchScore(userProfile, targetProfile) : 50;
        
        // Create match
        const { error: matchError } = await supabase
          .from('user_matches')
          .insert([
            {
              user_id: userId,
              matched_user_id: targetId,
              status: 'accepted',
              match_score: matchScore
            },
            // Create the reverse match record
            {
              user_id: targetId,
              matched_user_id: userId,
              status: 'accepted',
              match_score: matchScore
            }
          ]);
          
        if (matchError) {
          console.error('Error creating match:', matchError);
          return { success: true, match: false };
        }
        
        // Create notification for the target user
        if (userProfile) {
          await supabase
            .from('user_notifications')
            .insert({
              user_id: targetId,
              message: `You have a new match with ${userProfile.full_name || 'someone'}!`,
              type: 'match',
              related_id: userId
            });
        }
        
        return { success: true, match: true };
      }
    }

    return { success: true, match: false };
  } catch (error) {
    console.error('Exception in recordSwipeAction:', error);
    return { success: false };
  }
};

/**
 * Transform match results from Supabase to UserProfile format
 */
const transformMatchResults = (matches: MatchResult[]): UserProfile[] => {
  return matches.map(match => ({
    id: match.id,
    name: match.full_name || 'Anonymous User',
    age: estimateAgeFromExperienceLevel(match.experience_level),
    gender: "unspecified", 
    location: match.location || 'Unknown location',
    interests: match.interests || [],
    bio: match.bio || "",
    relationshipGoal: "networking",
    skills: match.skills || [],
    language: "English",
    imageUrl: match.image_url || "",
    matchScore: match.match_score || 0,
    industry: match.industry || "",
    userType: match.user_type || "",
    experienceLevel: match.experience_level || "",
    distance: match.distance_km,
    activityScore: 75,
    profileCompleteness: 80,
    university: match.university || "",
    courseYear: match.course_year || "",
    networkingGoals: match.networking_goals || [],
    projectInterests: match.project_interests || [],
    latitude: match.latitude || undefined,
    longitude: match.longitude || undefined
  }));
};

/**
 * Helper function to estimate age based on experience level
 */
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

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get match suggestions for a user based on specific criteria
 */
export const getMatchSuggestions = async (
  userId: string, 
  filters: {
    industry?: string;
    skills?: string[];
    experienceLevel?: string;
    relationshipGoal?: string;
    locationEnabled?: boolean;
    distance?: number;
  },
  limit: number = 10
): Promise<UserProfile[]> => {
  try {
    // If location is enabled and we have coordinates, prioritize proximity matches
    if (filters.locationEnabled) {
      const nearbyMatches = await getProximityMatches(userId, filters.distance || 50, limit);
      
      if (nearbyMatches.length > 0) {
        // Apply additional filters
        let filteredMatches = nearbyMatches;
        
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
        
        // If we still have matches after filtering, return them
        if (filteredMatches.length > 0) {
          return filteredMatches;
        }
      }
    }
    
    // If no nearby matches or location not enabled, fall back to interest/skill based matches
    return getMatchRecommendations(userId, limit);
  } catch (error) {
    console.error('Exception in getMatchSuggestions:', error);
    return [];
  }
};
