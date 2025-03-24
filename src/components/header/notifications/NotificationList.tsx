
import React from 'react';
import { NotificationType } from './types';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationListProps {
  notifications: NotificationType[];
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  markAsRead,
  markAllAsRead,
  onClose
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h3 className="font-medium">No notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We'll notify you when something important happens
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-xs h-auto py-1"
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              markAsRead={markAsRead}
              onClose={onClose}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;
