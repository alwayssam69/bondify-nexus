
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
      const query = supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (limit > 0) {
        query.limit(limit);
      }
      
      if (offset > 0) {
        query.range(offset, offset + limit - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.warn("Error fetching notifications:", error.message);
        setState({
          notifications: [],
          isLoading: false,
          error: error.message
        });
        return;
      }
      
      const notifications = (data || []) as unknown as Notification[];
      setState({
        notifications,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      setState({
        notifications: [],
        isLoading: false,
        error: "Failed to fetch notifications"
      });
    }
  };

  const handleMarkAllRead = async () => {
    if (!user || state.notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error marking notifications as read:", error);
        throw error;
      }
      
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

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      const channel = supabase
        .channel('public:user_notifications')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          console.log('Received realtime notification:', payload);
          
          fetchNotifications();
          
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
