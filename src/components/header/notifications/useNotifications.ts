
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Notification, NotificationState } from "./types";

export const useNotifications = (limit = 5, offset = 0) => {
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
      // Try to fetch from the real table if it exists
      const query = supabase
        .from('user_notifications' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Only add limit and offset if they are provided and valid
      if (limit > 0) {
        query.limit(limit);
      }
      
      if (offset > 0) {
        query.range(offset, offset + limit - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        // If there's an error (likely table doesn't exist yet), fall back to sample data
        console.warn("Error fetching notifications, using sample data:", error.message);
        fallbackToSampleData();
        return;
      }
      
      // Cast to our notification type and update state
      const notifications = (data || []) as unknown as Notification[];
      setState({
        notifications,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      fallbackToSampleData();
    }
  };

  const fallbackToSampleData = () => {
    // Generate sample notifications when table doesn't exist
    const sampleData: Notification[] = [
      {
        id: '1',
        type: 'match',
        message: 'You have a new connection with Jane Doe',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        is_read: false,
        user_id: user?.id || ''
      },
      {
        id: '2',
        type: 'message',
        message: 'You received a new message from John Smith',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        is_read: true,
        user_id: user?.id || ''
      },
      {
        id: '3',
        type: 'view',
        message: 'Sarah Williams viewed your profile',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        is_read: false,
        user_id: user?.id || ''
      }
    ];
    
    setState({
      notifications: sampleData,
      isLoading: false,
      error: null
    });
  };

  const handleMarkAllRead = async () => {
    if (!user || state.notifications.length === 0) return;
    
    try {
      // Update the notifications in the database
      const { error } = await supabase
        .from('user_notifications' as any)
        .update({ is_read: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error marking notifications as read:", error);
        throw error;
      }
      
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

  // Set up initial data fetching and realtime subscription
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up realtime subscription to the user_notifications table
      const channel = supabase
        .channel('public:user_notifications')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          console.log('Received realtime notification:', payload);
          
          // Refresh notifications when changes occur
          fetchNotifications();
          
          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            toast.info(newNotification.message, {
              description: 'New notification',
              duration: 5000,
            });
          }
        })
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
          
          if (status === 'SUBSCRIPTION_ERROR' as any) {
            console.warn('Could not set up realtime subscription, falling back to sample data');
            fallbackToSampleData();
          }
        });
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, limit, offset]);

  return {
    ...state,
    handleMarkAllRead,
    fetchNotifications,
    unreadCount: state.notifications.filter(n => !n.is_read).length
  };
};
