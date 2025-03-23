
import React from "react";
import { formatDistanceToNow, format } from "date-fns";
import type { Notification } from "./types";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
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
  );
};

export default NotificationItem;
