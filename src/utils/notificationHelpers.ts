
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Notification } from "@/components/header/notifications/types";

/**
 * Marks a single notification as read
 * @param notificationId The ID of the notification to mark as read
 * @returns Promise that resolves when the operation is complete
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    // Attempt to update the notification's read status in the database
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    toast.error("Failed to update notification status");
    throw error;
  }
};

/**
 * Creates a new notification for a user
 * @param notification The notification data to create
 * @returns Promise that resolves with the created notification ID
 */
export const createNotification = async (
  notification: Omit<Notification, 'id' | 'created_at'>
): Promise<string> => {
  try {
    // Ensure is_read is false by default for new notifications
    const newNotification = {
      ...notification,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('user_notifications')
      .insert(newNotification)
      .select('id')
      .single();
    
    if (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
    
    return data.id;
  } catch (error) {
    console.error("Failed to create notification:", error);
    toast.error("Failed to create notification");
    throw error;
  }
};

/**
 * Deletes a notification
 * @param notificationId The ID of the notification to delete
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
    
    toast.success("Notification removed");
  } catch (error) {
    console.error("Failed to delete notification:", error);
    toast.error("Failed to remove notification");
    throw error;
  }
};
