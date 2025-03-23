
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
    // Try to create a notification in the real table
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        type,
        message,
        related_entity_id: relatedEntityId || null,
        metadata: metadata || {},
        is_read: false
      } as any)
      .select()
      .single();
    
    if (error) {
      // If there's an error (table might not exist), log what would have been created
      console.warn("Could not create notification, table might not exist:", error.message);
      console.log("Notification would have been created with:", {
        userId,
        type,
        message,
        relatedEntityId,
        metadata
      });
      
      return { success: true, simulated: true };
    }
    
    return { success: true, data };
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
    // Try to update notifications in the real table
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true } as any)
      .eq('user_id', userId);
    
    if (error) {
      // If there's an error (table might not exist), log what would have happened
      console.warn("Could not mark notifications as read, table might not exist:", error.message);
      console.log(`Would mark all notifications as read for user ${userId}`);
      
      return { success: true, simulated: true };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error marking notifications as read:", error);
    return { error };
  }
};

/**
 * Marks a specific notification as read
 * @param notificationId The ID of the notification
 * @returns Promise with the result of the operation
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true } as any)
      .eq('id', notificationId);
    
    if (error) {
      console.warn("Could not mark notification as read, table might not exist:", error.message);
      return { success: true, simulated: true };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error marking notification as read:", error);
    return { error };
  }
};
