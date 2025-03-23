
import { UserProfile } from "@/lib/matchmaking";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get match recommendations for a user from Supabase functions
 */
export async function getMatchRecommendations(userId: string, limit = 20): Promise<UserProfile[]> {
  try {
    // Using the database function to get matches
    const { data, error } = await supabase.rpc('get_matches', {
      user_id: userId,
      limit_count: limit
    });

    if (error) {
      console.error("Error getting match recommendations:", error);
      return [];
    }

    // Transform to our UserProfile format
    return data.map((match: any) => ({
      id: match.id,
      name: match.full_name || 'Anonymous User',
      age: getAgeFromExperienceLevel(match.experience_level),
      location: match.location || 'Unknown location',
      interests: match.interests || [],
      bio: match.bio || '',
      relationshipGoal: "networking",
      skills: match.skills || [],
      language: "English",
      imageUrl: match.image_url || '',
      industry: match.industry || '',
      userType: match.user_type || '',
      experienceLevel: match.experience_level || '',
      activityScore: match.activity_score || 75,
      profileCompleteness: 80
    }));
  } catch (error) {
    console.error("Error in getMatchRecommendations:", error);
    return [];
  }
}

/**
 * Get match recommendations by proximity
 */
export async function getProximityMatches(
  userId: string,
  radiusKm = 50,
  limit = 20
): Promise<UserProfile[]> {
  try {
    // Using the database function to get matches by proximity
    const { data, error } = await supabase.rpc('get_matches_by_proximity', {
      user_id: userId,
      radius_km: radiusKm,
      limit_count: limit
    });

    if (error) {
      console.error("Error getting proximity matches:", error);
      return [];
    }

    // Transform to our UserProfile format
    return data.map((match: any) => ({
      id: match.id,
      name: match.full_name || 'Anonymous User',
      age: getAgeFromExperienceLevel(match.experience_level),
      location: match.location || 'Unknown location',
      interests: match.interests || [],
      bio: match.bio || '',
      relationshipGoal: "networking",
      skills: match.skills || [],
      language: "English",
      imageUrl: match.image_url || '',
      industry: match.industry || '',
      userType: match.user_type || '',
      experienceLevel: match.experience_level || '',
      activityScore: match.activity_score || 75,
      profileCompleteness: 80,
      distanceKm: Math.round(match.distance_km || 0)
    }));
  } catch (error) {
    console.error("Error in getProximityMatches:", error);
    return [];
  }
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
          // Notify both users about the match
          // Mock notification functionality here
          console.log(`New match between ${userId} and ${targetId}`);
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
      .select('matched_user_id')
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

    // Convert to UserProfile format
    return profiles.map(profile => ({
      id: profile.id,
      name: profile.full_name || 'Anonymous User',
      age: getAgeFromExperienceLevel(profile.experience_level),
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
      profileCompleteness: profile.profile_completeness || 80
    }));
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
