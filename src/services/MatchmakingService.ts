import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/matchmaking";

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
  match_score: number;
  distance_km?: number;
}

/**
 * Get match recommendations for a user based on their profile
 */
export const getMatchRecommendations = async (userId: string, limit: number = 20): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase.rpc('get_matches', {
      user_id: userId,
      limit_count: limit
    });

    if (error) {
      console.error('Error fetching match recommendations:', error);
      return [];
    }

    return transformMatchResults(data);
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
    const { data, error } = await supabase.rpc('get_matches_by_proximity', {
      user_id: userId,
      radius_km: radiusKm,
      limit_count: limit
    });

    if (error) {
      console.error('Error fetching proximity matches:', error);
      return [];
    }

    return transformMatchResults(data);
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
      .update({ latitude, longitude })
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
      .select('matched_user_id')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching confirmed matches:', error);
      return [];
    }

    // Get full profiles for matched users
    const matchedUserIds = data.map(match => match.matched_user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', matchedUserIds);

    if (profilesError) {
      console.error('Error fetching matched profiles:', profilesError);
      return [];
    }

    return transformMatchResults(profiles);
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
): Promise<boolean> => {
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
      return false;
    }

    // If it's a like, create a match if the other user has also liked
    if (action === 'like') {
      const { data: mutual, error: mutualError } = await supabase
        .from('user_swipes')
        .select('*')
        .eq('user_id', targetId)
        .eq('target_id', userId)
        .eq('action', 'like')
        .single();

      if (!mutualError && mutual) {
        // Create match
        await supabase
          .from('user_matches')
          .insert({
            user_id: userId,
            matched_user_id: targetId,
            status: 'accepted'
          });
      }
    }

    return true;
  } catch (error) {
    console.error('Exception in recordSwipeAction:', error);
    return false;
  }
};

/**
 * Transform match results from Supabase to UserProfile format
 */
const transformMatchResults = (matches: MatchResult[]): UserProfile[] => {
  return matches.map(match => ({
    id: match.id,
    name: match.full_name,
    // Estimate age from experience level
    age: estimateAgeFromExperienceLevel(match.experience_level),
    gender: "unspecified", // Not stored in our schema
    location: match.location,
    interests: match.interests || [],
    bio: match.bio || "",
    relationshipGoal: "networking", // Default for this app
    skills: match.skills || [],
    language: "English", // Default
    imageUrl: match.image_url || "bg-gradient-to-br from-blue-400 to-indigo-600",
    matchScore: match.match_score,
    industry: match.industry || "",
    userType: match.user_type || "",
    experienceLevel: match.experience_level || "",
    distance: match.distance_km,
    // Add other fields with defaults
    activityScore: 75,
    profileCompleteness: 80,
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
