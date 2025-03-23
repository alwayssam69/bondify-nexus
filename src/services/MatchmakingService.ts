import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/matchmaking";
import { getMatchRecommendations, getProximityMatches } from "./MatchmakingAPI";

/**
 * Get match recommendations for a user
 */
export const getMatches = async (userId: string, limit: number = 20): Promise<UserProfile[]> => {
  try {
    // Check if location-based matching is enabled for this user
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('latitude, longitude')
      .eq('id', userId)
      .single();
    
    // If user has location data, use proximity-based matching
    if (userProfile?.latitude && userProfile?.longitude) {
      return getProximityMatches(userId, 100, limit);
    }
    
    // Otherwise use regular matching algorithm
    return getMatchRecommendations(userId, limit);
  } catch (error) {
    console.error("Error in getMatches:", error);
    return [];
  }
};

/**
 * Get confirmed matches for a user
 */
export const getUserMatches = async (userId: string): Promise<UserProfile[]> => {
  try {
    // Get confirmed matches from user_matches table
    const { data, error } = await supabase
      .from('user_matches')
      .select(`
        matched_with,
        match_score,
        user_profiles!user_matches_matched_with_fkey(
          id,
          full_name,
          location,
          industry,
          user_type,
          experience_level,
          skills,
          interests,
          bio,
          image_url
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed');
    
    if (error) {
      console.error("Error fetching user matches:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform the data to UserProfile format
    return data.map(match => {
      const profile = match.user_profiles;
      return {
        id: profile.id,
        name: profile.full_name,
        age: 25 + Math.floor(Math.random() * 15), // Estimate age
        gender: "unspecified",
        location: profile.location || "Unknown",
        interests: profile.interests || [],
        bio: profile.bio || "",
        relationshipGoal: "networking",
        skills: profile.skills || [],
        language: "English",
        imageUrl: profile.image_url || "",
        matchScore: match.match_score * 100,
        industry: profile.industry || "",
        userType: profile.user_type || "",
        experienceLevel: profile.experience_level || "",
        // Default values for required properties
        activityScore: 75,
        profileCompleteness: 80,
      };
    });
  } catch (error) {
    console.error("Error in getUserMatches:", error);
    return [];
  }
};

/**
 * Get saved profiles for a user
 */
export const getSavedProfiles = async (userId: string): Promise<UserProfile[]> => {
  try {
    // Get saved profiles from user_matches table
    const { data, error } = await supabase
      .from('user_matches')
      .select(`
        matched_with,
        user_profiles!user_matches_matched_with_fkey(
          id,
          full_name,
          location,
          industry,
          user_type,
          experience_level,
          skills,
          interests,
          bio,
          image_url
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'saved');
    
    if (error) {
      console.error("Error fetching saved profiles:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform the data to UserProfile format
    return data.map(match => {
      const profile = match.user_profiles;
      return {
        id: profile.id,
        name: profile.full_name,
        age: 25 + Math.floor(Math.random() * 15), // Estimate age
        gender: "unspecified",
        location: profile.location || "Unknown",
        interests: profile.interests || [],
        bio: profile.bio || "",
        relationshipGoal: "networking",
        skills: profile.skills || [],
        language: "English",
        imageUrl: profile.image_url || "",
        matchScore: 70 + Math.floor(Math.random() * 20),
        industry: profile.industry || "",
        userType: profile.user_type || "",
        experienceLevel: profile.experience_level || "",
        // Default values for required properties
        activityScore: 75,
        profileCompleteness: 80,
      };
    });
  } catch (error) {
    console.error("Error in getSavedProfiles:", error);
    return [];
  }
};

/**
 * Record a swipe action by a user
 */
export const recordSwipeAction = async (
  userId: string,
  profileId: string,
  action: 'like' | 'pass' | 'save'
): Promise<boolean> => {
  try {
    // Determine the status based on the action
    let status;
    switch (action) {
      case 'like':
        status = 'pending';
        break;
      case 'pass':
        status = 'rejected';
        break;
      case 'save':
        status = 'saved';
        break;
      default:
        status = 'pending';
    }
    
    // Record the swipe action
    const { error } = await supabase
      .from('user_matches')
      .upsert({
        user_id: userId,
        matched_with: profileId,
        status: status,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error recording swipe action:", error);
      return false;
    }
    
    // If this was a like, check if there's a mutual match
    if (action === 'like') {
      const { data, error: matchError } = await supabase
        .from('user_matches')
        .select('*')
        .eq('user_id', profileId)
        .eq('matched_with', userId)
        .eq('status', 'pending')
        .single();
      
      if (matchError && matchError.code !== 'PGRST116') {
        console.error("Error checking for mutual match:", matchError);
      }
      
      // If there's a mutual match, update both records to 'confirmed'
      if (data) {
        // Update the other user's record
        await supabase
          .from('user_matches')
          .update({ status: 'confirmed' })
          .eq('user_id', profileId)
          .eq('matched_with', userId);
        
        // Update current user's record
        await supabase
          .from('user_matches')
          .update({ status: 'confirmed' })
          .eq('user_id', userId)
          .eq('matched_with', profileId);
        
        // Create a notification for both users
        await supabase.from('notifications').insert([
          {
            user_id: userId,
            type: 'match',
            message: `You matched with a new connection!`,
            related_user_id: profileId
          },
          {
            user_id: profileId,
            type: 'match',
            message: `You matched with a new connection!`,
            related_user_id: userId
          }
        ]);
        
        return true; // Mutual match!
      }
    }
    
    return false; // No mutual match or not a like action
  } catch (error) {
    console.error("Error in recordSwipeAction:", error);
    return false;
  }
};
