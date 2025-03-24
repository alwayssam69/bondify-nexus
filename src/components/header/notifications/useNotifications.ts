
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Notification, NotificationState } from './types';
import { toast } from 'sonner';

export const useNotifications = (limit: number = 10, offset: number = 0): NotificationState => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

      if (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        setError(new Error(fetchError.message));
        return;
      }

      const formattedNotifications: Notification[] = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        message: item.message,
        type: item.type as 'match' | 'message' | 'system' | 'profile_view' | 'view',
        created_at: item.created_at,
        is_read: item.is_read,
        related_entity_id: item.related_id,
        // Add these for backward compatibility
        userId: item.user_id,
        createdAt: new Date(item.created_at),
        isRead: item.is_read,
        relatedId: item.related_id,
      })) || [];

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.is_read).length);
    } catch (err) {
      console.error('Error in fetchNotifications:', err);
      setError(new Error(err instanceof Error ? err.message : 'Unknown error fetching notifications'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchNotifications();
          toast.info('You have a new notification');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, limit, offset]);

  const markAsRead = async (id: string) => {
    if (!user?.id) return;

    try {
      const { error: updateError } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error marking notification as read:', updateError);
        return;
      }

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, is_read: true, isRead: true } : notification
        )
      );
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error('Error in markAsRead:', err);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error: updateError } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (updateError) {
        console.error('Error marking all notifications as read:', updateError);
        return;
      }

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error in markAllAsRead:', err);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    refreshNotifications,
    markAllAsRead
  };
};
