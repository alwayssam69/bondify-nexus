
import { SwipeAction } from '@/types/matchmaking';
import { supabase } from '@/integrations/supabase/client';

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
