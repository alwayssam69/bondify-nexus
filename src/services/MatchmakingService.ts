
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/matchmaking";

// Supabase real implementation for recording swipe actions
export const recordSwipeAction = async (userId: string, targetId: string, action: "like" | "pass" | "save") => {
  try {
    // Insert the swipe action into the database
    const { error } = await supabase
      .from('user_swipes')
      .insert([
        {
          user_id: userId,
          target_id: targetId,
          action: action,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("Error recording swipe action:", error);
      return false;
    }

    // If it was a like, check if there's a match (other user also liked this user)
    if (action === "like") {
      const { data: matchData, error: matchError } = await supabase
        .from('user_swipes')
        .select('*')
        .eq('user_id', targetId)
        .eq('target_id', userId)
        .eq('action', 'like')
        .single();

      if (!matchError && matchData) {
        // It's a match! Create a new entry in the user_matches table
        const matchScore = await calculateMatchScore(userId, targetId);
        
        await supabase
          .from('user_matches')
          .insert([
            {
              user_id: userId,
              matched_user_id: targetId,
              match_score: matchScore / 100, // Store as decimal
              status: 'confirmed',
              created_at: new Date().toISOString()
            }
          ]);
          
        // Also create the reciprocal match entry
        await supabase
          .from('user_matches')
          .insert([
            {
              user_id: targetId,
              matched_user_id: userId,
              match_score: matchScore / 100, // Store as decimal
              status: 'confirmed',
              created_at: new Date().toISOString()
            }
          ]);
          
        // Create a notification for both users
        await createMatchNotification(userId, targetId);
        await createMatchNotification(targetId, userId);
        
        return true; // Return true to indicate a match was found
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in recordSwipeAction:", error);
    return false;
  }
};

// Create a match notification
const createMatchNotification = async (userId: string, matchedUserId: string) => {
  try {
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', matchedUserId)
      .single();
      
    if (userData) {
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            type: 'match',
            message: `You matched with ${userData.full_name}!`,
            created_at: new Date().toISOString()
          }
        ]);
    }
  } catch (error) {
    console.error("Error creating match notification:", error);
  }
};

// Calculate match score between two users
const calculateMatchScore = async (userId: string, targetId: string): Promise<number> => {
  try {
    // Call the calculate_match_score function in Supabase
    const { data, error } = await supabase.rpc('calculate_match_score', {
      user_id: userId,
      target_id: targetId
    });
    
    if (error) {
      console.error("Error calculating match score:", error);
      return 50; // Default score
    }
    
    return data || 50;
  } catch (error) {
    console.error("Error in calculateMatchScore:", error);
    return 50;
  }
};

// Get match recommendations for a user
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

// Get proximity matches
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

// Transform match results from Supabase to UserProfile format
const transformMatchResults = (matches: any[]): UserProfile[] => {
  if (!matches || matches.length === 0) return [];
  
  return matches.map(match => ({
    id: match.id,
    name: match.full_name,
    age: estimateAgeFromExperienceLevel(match.experience_level),
    gender: match.gender || "unspecified",
    location: match.location || "",
    interests: match.interests || [],
    bio: match.bio || "",
    relationshipGoal: "networking", // Default for this app
    skills: match.skills || [],
    language: "English", // Default
    imageUrl: match.image_url || "",
    matchScore: match.match_score * 100, // Convert from decimal to percentage
    industry: match.industry || "",
    userType: match.user_type || "",
    experienceLevel: match.experience_level || "",
    distance: match.distance_km,
    activityScore: match.activity_score || 75,
    profileCompleteness: match.profile_completeness || 80,
  }));
};

// Helper function to estimate age based on experience level
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

// Get confirmed matches for a user
export const getConfirmedMatches = async (userId: string, limit: number = 20): Promise<UserProfile[]> => {
  try {
    // First get the match IDs
    const { data: matchData, error: matchError } = await supabase
      .from('user_matches')
      .select('matched_user_id')
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (matchError || !matchData || matchData.length === 0) {
      return [];
    }
    
    // Get the full profiles
    const matchedIds = matchData.map(m => m.matched_user_id);
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', matchedIds);
      
    if (profileError || !profiles) {
      return [];
    }
    
    // Transform to UserProfile format
    return profiles.map(profile => ({
      id: profile.id,
      name: profile.full_name,
      age: estimateAgeFromExperienceLevel(profile.experience_level),
      gender: profile.gender || "unspecified",
      location: profile.location || "",
      interests: profile.interests || [],
      bio: profile.bio || "",
      relationshipGoal: "networking",
      skills: profile.skills || [],
      language: "English",
      imageUrl: profile.image_url || "",
      industry: profile.industry || "",
      userType: profile.user_type || "",
      experienceLevel: profile.experience_level || "",
      activityScore: profile.activity_score || 75,
      profileCompleteness: profile.profile_completeness || 80,
    }));
  } catch (error) {
    console.error('Error in getConfirmedMatches:', error);
    return [];
  }
};

// Get saved profiles
export const getSavedProfiles = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_swipes')
      .select('target_id')
      .eq('user_id', userId)
      .eq('action', 'save');
      
    if (error || !data) {
      return [];
    }
    
    return data.map(item => item.target_id);
  } catch (error) {
    console.error('Error in getSavedProfiles:', error);
    return [];
  }
};

// Update user coordinates for location-based matching
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
