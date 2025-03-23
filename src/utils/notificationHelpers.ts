
import { supabase } from "@/integrations/supabase/client";

export type NotificationType = 'match' | 'message' | 'view';

/**
 * Creates a new notification for a user
 * @param userId The ID of the user to create the notification for
 * @param type The type of notification
 * @param message The notification message
 * @param relatedEntityId Optional ID of a related entity (e.g., match ID, message ID)
 * @param metadata Optional additional data as JSON
 * @returns Promise with the result of the operation
 */
export const createNotification = async (
  userId: string,
  type: NotificationType,
  message: string,
  relatedEntityId?: string,
  metadata?: Record<string, any>
) => {
  try {
    // First check if the table exists
    const { error: tableCheckError } = await supabase
      .from('user_notifications')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error("user_notifications table doesn't exist:", tableCheckError.message);
      return { error: tableCheckError };
    }
    
    // If table exists, insert the notification
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        type,
        message,
        related_entity_id: relatedEntityId,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error("Error creating notification:", error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error("Unexpected error creating notification:", error);
    return { error };
  }
};

/**
 * Marks all notifications as read for a user
 * @param userId The ID of the user
 * @returns Promise with the result of the operation
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error marking notifications as read:", error);
      return { error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error marking notifications as read:", error);
    return { error };
  }
};
