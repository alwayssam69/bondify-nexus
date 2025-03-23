
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { markAllNotificationsAsRead } from "@/utils/notificationHelpers";
import type { Notification, NotificationState } from "./types";

export const useNotifications = () => {
  const { user } = useAuth();
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    isLoading: false,
    error: null
  });

  const fetchNotifications = async () => {
    if (!user) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // We'll use direct data access until the user_notifications table is created
      // In a real application, after the table is created, this would use proper typed access
      
      // Generate sample notifications for now
      const sampleData: Notification[] = [
        {
          id: '1',
          type: 'match',
          message: 'You have a new connection with Jane Doe',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          is_read: false,
          user_id: user.id
        },
        {
          id: '2',
          type: 'message',
          message: 'You received a new message from John Smith',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          is_read: true,
          user_id: user.id
        },
        {
          id: '3',
          type: 'view',
          message: 'Sarah Williams viewed your profile',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          is_read: false,
          user_id: user.id
        }
      ];
      
      setState({
        notifications: sampleData,
        isLoading: false,
        error: null
      });
      
      // Attempt to fetch real notifications - uncomment after table is created
      /*
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      // Cast to our notification type
      const notifications = (data || []) as Notification[];
      setState({
        notifications,
        isLoading: false,
        error: null
      });
      */
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch notifications') 
      }));
    }
  };

  const handleMarkAllRead = async () => {
    if (!user || state.notifications.length === 0) return;
    
    try {
      // Use our helper function to mark all as read
      await markAllNotificationsAsRead(user.id);
      
      // Optimistically update UI
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, is_read: true }))
      }));
      
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  // Set up initial data fetching
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up realtime subscription - uncomment after table is created
      /*
      try {
        const channel = supabase
          .channel('public:user_notifications')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_notifications',
            filter: `user_id=eq.${user.id}`,
          }, () => {
            fetchNotifications();
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up real-time subscription:", error);
      }
      */
    }
  }, [user]);

  return {
    ...state,
    handleMarkAllRead,
    unreadCount: state.notifications.filter(n => !n.is_read).length
  };
};
