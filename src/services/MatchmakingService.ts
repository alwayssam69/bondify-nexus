import { UserProfile } from "@/lib/matchmaking";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get match recommendations for a user from Supabase functions
 * This uses industry, skills, and experience level buckets
 */
export async function getMatchRecommendations(userId: string, limit = 20): Promise<UserProfile[]> {
  try {
    console.log("Fetching match recommendations for user:", userId);

    // Using the database function to get matches
    const { data, error } = await supabase.rpc('get_matches', {
      user_id: userId,
      limit_count: limit
    });

    if (error) {
      console.error("Error getting match recommendations:", error);
      
      // Fallback to regular query if RPC fails
      console.log("Falling back to regular query for matches");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', userId)
        .limit(limit);
        
      if (fallbackError) {
        console.error("Fallback query failed:", fallbackError);
        return [];
      }
      
      if (!fallbackData || fallbackData.length === 0) {
        console.log("No matches found in fallback query");
        return [];
      }
      
      // Transform fallback data to UserProfile format
      return transformProfilesToUserProfiles(fallbackData);
    }

    if (!data || data.length === 0) {
      console.log("No matches found from RPC function");
      return [];
    }

    // Transform to our UserProfile format
    return transformProfilesToUserProfiles(data);
  } catch (error) {
    console.error("Error in getMatchRecommendations:", error);
    return [];
  }
}

/**
 * Get match recommendations by proximity (Priority 1)
 */
export async function getProximityMatches(
  userId: string,
  radiusKm = 50,
  limit = 20
): Promise<UserProfile[]> {
  try {
    console.log("Fetching proximity matches within", radiusKm, "km for user:", userId);
    
    // Using the database function to get matches by proximity
    const { data, error } = await supabase.rpc('get_matches_by_proximity', {
      user_id: userId,
      radius_km: radiusKm,
      limit_count: limit
    });

    if (error) {
      console.error("Error getting proximity matches:", error);
      
      // Fallback to regular profile query if RPC fails
      console.log("Falling back to regular query for matches");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', userId)
        .limit(limit);
        
      if (fallbackError) {
        console.error("Fallback query failed:", fallbackError);
        return [];
      }
      
      if (!fallbackData || fallbackData.length === 0) {
        console.log("No matches found in fallback query");
        return [];
      }
      
      // Transform fallback data to UserProfile format
      return transformProfilesToUserProfiles(fallbackData);
    }

    if (!data || data.length === 0) {
      console.log("No proximity matches found");
      return [];
    }

    // Transform to our UserProfile format
    return transformProfilesToUserProfiles(data);
  } catch (error) {
    console.error("Error in getProximityMatches:", error);
    return [];
  }
}

/**
 * Calculate a match score based on our algorithm
 * 50% → Skills Match
 * 30% → Experience Match
 * 20% → Location Match
 */
function calculateMatchScore(match: any, includeLocation = false): number {
  let score = 0;
  
  // Skills quality (50%)
  const skillsScore = match.skills?.length ? 50 : 0;
  
  // Experience level match (30%)
  const experienceScore = match.experience_level ? 30 : 0;
  
  // Location match (20% if applicable)
  const locationScore = includeLocation && match.distance_km ? 
    Math.max(0, 20 - (match.distance_km / 5)) : 0;
  
  score = skillsScore + experienceScore + locationScore;
  
  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Record a user's swipe action (like, pass, etc.)
 */
export async function recordSwipeAction(
  userId: string,
  targetId: string,
  action: 'like' | 'pass' | 'save'
): Promise<boolean> {
  try {
    // Insert swipe action to user_swipes table
    const { error } = await supabase
      .from('user_swipes')
      .insert([
        {
          user_id: userId,
          target_id: targetId,
          action
        }
      ]);

    if (error) {
      console.error("Error recording swipe action:", error);
      return false;
    }

    // If it's a like, check if there's already a like from the target user
    if (action === 'like') {
      const { data: matchingSwipe, error: matchError } = await supabase
        .from('user_swipes')
        .select()
        .eq('user_id', targetId)
        .eq('target_id', userId)
        .eq('action', 'like')
        .single();

      if (matchError && matchError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error("Error checking for mutual like:", matchError);
      }

      // If we have a match (mutual like)
      if (matchingSwipe) {
        // Calculate match score
        const { data: matchScore, error: scoreError } = await supabase.rpc(
          'calculate_match_score',
          { user_id: userId, target_id: targetId }
        );

        const score = matchScore || 0.5; // Default score of 50% if calculation fails

        // Create a match record
        const { error: matchCreateError } = await supabase
          .from('user_matches')
          .insert([
            {
              user_id: userId,
              matched_user_id: targetId,
              status: 'confirmed',
              match_score: score
            },
            {
              user_id: targetId,
              matched_user_id: userId,
              status: 'confirmed',
              match_score: score
            }
          ]);

        if (matchCreateError) {
          console.error("Error creating match record:", matchCreateError);
        } else {
          // Create notifications for both users
          await supabase.from('user_notifications').insert([
            {
              user_id: userId,
              message: `You have a new connection match!`,
              type: 'match',
              related_id: targetId
            },
            {
              user_id: targetId,
              message: `You have a new connection match!`,
              type: 'match',
              related_id: userId
            }
          ]);
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error in recordSwipeAction:", error);
    return false;
  }
}

/**
 * Get confirmed matches for a user
 */
export async function getConfirmedMatches(userId: string): Promise<UserProfile[]> {
  try {
    // Get all confirmed matches for this user
    const { data: matches, error } = await supabase
      .from('user_matches')
      .select('matched_user_id, match_score')
      .eq('user_id', userId)
      .eq('status', 'confirmed');

    if (error) {
      console.error("Error getting confirmed matches:", error);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Get profile information for all matched users
    const matchedUserIds = matches.map(match => match.matched_user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', matchedUserIds);

    if (profilesError) {
      console.error("Error getting matched profiles:", profilesError);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Convert to UserProfile format with proper match scores
    return profiles.map(profile => {
      const matchEntry = matches.find(m => m.matched_user_id === profile.id);
      return {
        id: profile.id,
        name: profile.full_name || 'Anonymous User',
        age: getAgeFromExperienceLevel(profile.experience_level),
        gender: "unspecified", // Add default gender
        location: profile.location || 'Unknown location',
        interests: profile.interests || [],
        bio: profile.bio || '',
        relationshipGoal: "networking",
        skills: profile.skills || [],
        language: "English",
        imageUrl: profile.image_url || '',
        industry: profile.industry || '',
        userType: profile.user_type || '',
        experienceLevel: profile.experience_level || '',
        activityScore: profile.activity_score || 75,
        profileCompleteness: profile.profile_completeness || 80,
        matchScore: matchEntry?.match_score || 0
      };
    });
  } catch (error) {
    console.error("Error in getConfirmedMatches:", error);
    return [];
  }
}

/**
 * Get user profiles that the current user has saved
 */
export async function getSavedProfiles(userId: string): Promise<string[]> {
  try {
    // Get all saved profiles from user_swipes table
    const { data, error } = await supabase
      .from('user_swipes')
      .select('target_id')
      .eq('user_id', userId)
      .eq('action', 'save');

    if (error) {
      console.error("Error getting saved profiles:", error);
      return [];
    }

    // Return the IDs of saved profiles
    return data?.map(item => item.target_id) || [];
  } catch (error) {
    console.error("Error in getSavedProfiles:", error);
    return [];
  }
}

// Helper function to estimate age based on experience level
const getAgeFromExperienceLevel = (experienceLevel: string | null): number => {
  switch (experienceLevel) {
    case 'beginner':
      return Math.floor(Math.random() * 5) + 20; // 20-24
    case 'intermediate':
      return Math.floor(Math.random() * 5) + 25; // 25-29
    case 'expert':
      return Math.floor(Math.random() * 10) + 30; // 30-39
    default:
      return Math.floor(Math.random() * 15) + 25; // 25-39
  }
};

/**
 * Helper function to transform database profile records to UserProfile objects
 */
function transformProfilesToUserProfiles(profiles: any[]): UserProfile[] {
  return profiles.map((profile: any) => ({
    id: profile.id,
    name: profile.full_name || 'Anonymous User',
    age: getAgeFromExperienceLevel(profile.experience_level),
    gender: "unspecified", // Add default gender
    location: profile.location || 'Unknown location',
    interests: profile.interests || [],
    bio: profile.bio || '',
    relationshipGoal: "networking",
    skills: profile.skills || [],
    language: "English",
    imageUrl: profile.image_url || '',
    industry: profile.industry || '',
    userType: profile.user_type || '',
    experienceLevel: profile.experience_level || '',
    activityScore: profile.activity_score || 75,
    profileCompleteness: profile.profile_completeness || 80,
    distanceKm: Math.round(profile.distance_km || 0),
    matchScore: profile.match_score || calculateMatchScore(profile)
  }));
}
