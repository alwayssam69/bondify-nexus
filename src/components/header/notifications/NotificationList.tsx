
import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import NotificationItem from "./NotificationItem";
import type { Notification } from "./types";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationList = ({ notifications, isLoading, onNotificationClick }: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        You don't have any notifications yet
      </div>
    );
  }

  return (
    <>
      {notifications.map((notification) => (
        <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
          <NotificationItem 
            notification={notification} 
            onNotificationClick={onNotificationClick}
          />
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default NotificationList;
