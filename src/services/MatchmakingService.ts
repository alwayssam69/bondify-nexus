
import { SwipeAction } from '@/types/matchmaking';
import { supabase } from '@/integrations/supabase/client';
import { 
  getMatchRecommendations as getRecommendations,
  getProximityMatches as getProximity,
  updateUserCoordinates
} from './MatchmakingAPI';
import { UserProfile } from '@/lib/matchmaking';

// Re-export functions from MatchmakingAPI for easier imports elsewhere
export const getMatchRecommendations = getRecommendations;
export const getProximityMatches = getProximity;
export { updateUserCoordinates };

// Get confirmed matches for a user (users who mutually liked each other)
export const getConfirmedMatches = async (userId: string): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_matches')
      .select(`
        user_id_1,
        user_id_2,
        user_profiles!user_matches_user_id_2_fkey(*)
      `)
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to UserProfile format
    const matches = data.map(match => {
      // Determine which user is the match (not the current user)
      const matchUserId = match.user_id_1 === userId ? match.user_id_2 : match.user_id_1;
      
      // Get the profile data from the join
      const profileData = match.user_profiles || {};
      
      return {
        id: matchUserId,
        name: profileData.full_name || 'Unknown User',
        imageUrl: profileData.image_url || '',
        industry: profileData.industry || 'Unknown Industry',
        userType: profileData.user_type || 'Professional',
        matchScore: 85 + Math.floor(Math.random() * 15), // Random score between 85-99 for matched users
        // Add other required fields with default values
        age: 30,
        gender: 'unspecified',
        location: profileData.location || 'Unknown Location',
        interests: profileData.interests || [],
        bio: profileData.bio || '',
        relationshipGoal: 'networking',
        skills: profileData.skills || [],
        language: 'English',
        experienceLevel: profileData.experience_level || 'intermediate',
        activityScore: 75,
        profileCompleteness: 80,
      };
    });
    
    return matches;
  } catch (error) {
    console.error('Error fetching confirmed matches:', error);
    return [];
  }
};

// Record a swipe action in the database
export const recordSwipeAction = async (
  userId: string, 
  targetId: string, 
  action: SwipeAction
): Promise<void> => {
  try {
    // Insert the swipe action into the database
    const { error } = await supabase
      .from('user_swipes')
      .insert({
        user_id: userId,
        target_id: targetId,
        action: action,
        created_at: new Date()
      });
      
    if (error) throw error;
    
    // If the action was 'like', check if there's a match
    if (action === 'like') {
      const { data, error: matchError } = await supabase
        .from('user_swipes')
        .select()
        .eq('user_id', targetId)
        .eq('target_id', userId)
        .eq('action', 'like')
        .single();
        
      if (matchError && matchError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        console.error('Error checking for match:', matchError);
      }
      
      // If there's a match, record it
      if (data) {
        await supabase
          .from('user_matches')
          .insert({
            user_id_1: userId,
            user_id_2: targetId,
            created_at: new Date()
          });
      }
    }
  } catch (error) {
    console.error('Error recording swipe action:', error);
    throw error;
  }
};
