
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

// Define our own notification type instead of relying on the database type
interface Notification {
  id: string;
  type: 'match' | 'message' | 'view';
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
  metadata?: Record<string, any>;
}

const NotificationsDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Generate some demo notifications if user_notifications table doesn't exist yet
      const { data, error } = await supabase.rpc('get_notifications', { user_id: user.id });
      
      if (error) {
        console.error("Error fetching notifications:", error);
        
        // Fallback to sample notifications if the table or function doesn't exist
        // This is a workaround until the user runs the SQL script to create the table
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
        
        setNotifications(sampleData);
        console.log("Using sample notifications because: ", error.message);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Listen for real-time changes when the user_notifications table exists
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
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up real-time subscription:", error);
      }
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      // Instead of direct database updates, use our helper function
      const { error } = await supabase.rpc('mark_all_notifications_read', { 
        user_id: user.id 
      });
      
      if (error) {
        console.error("Error marking notifications as read:", error);
        // Optimistically update the UI even if the server operation fails
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        toast.error("Failed to update on server, but marked as read locally");
      } else {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Invalid date";
      
      const now = new Date();
      const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return format(date, "MMM d, yyyy");
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'view':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {notifications.filter(n => !n.is_read).length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.filter(n => !n.is_read).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            {notifications.filter(n => !n.is_read).length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            You don't have any notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
              <div className="flex gap-3 w-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'match' ? 'bg-red-100 text-red-600' : 
                  notification.type === 'message' ? 'bg-blue-100 text-blue-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full self-start mt-2"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
