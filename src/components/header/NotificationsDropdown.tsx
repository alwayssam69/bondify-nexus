
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter,
} from "@/components/ui/dropdown-menu";
import { Bell, ArrowRight } from "lucide-react";
import NotificationList from "./notifications/NotificationList";
import { useNotifications } from "./notifications/useNotifications";
import type { Notification } from "./notifications/types";

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, unreadCount, handleMarkAllRead } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    // Handle navigation based on notification type
    if (notification.type === 'match' && notification.related_entity_id) {
      navigate(`/matches/${notification.related_entity_id}`);
    } 
    else if (notification.type === 'message' && notification.related_entity_id) {
      navigate(`/chat/${notification.related_entity_id}`);
    }
    else if (notification.type === 'view' && notification.related_entity_id) {
      navigate(`/profile/${notification.related_entity_id}`);
    }
    else {
      // Default fallback if we can't determine a specific route
      navigate('/dashboard');
    }
  };

  const viewAllNotifications = () => {
    navigate('/notifications');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
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
        
        <NotificationList 
          notifications={notifications} 
          isLoading={isLoading}
          onNotificationClick={handleNotificationClick}
        />
        
        <DropdownMenuFooter className="flex items-center justify-center p-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-between"
            onClick={viewAllNotifications}
          >
            View all notifications
            <ArrowRight size={16} />
          </Button>
        </DropdownMenuFooter>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
