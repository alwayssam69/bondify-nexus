
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationList from "@/components/header/notifications/NotificationList";
import { useNotifications } from "@/components/header/notifications/useNotifications";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Notifications = () => {
  const { 
    notifications, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications(50); // Load more notifications
  
  const [filter, setFilter] = useState<string>("all");
  
  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.is_read;
    return notification.type === filter;
  });

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshNotifications}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
              {notifications.some(n => !n.is_read) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-medium">
                  Your Notifications
                </CardTitle>
                <Select
                  defaultValue="all"
                  onValueChange={(value) => setFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="match">Matches</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="view">Profile Views</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Failed to load notifications</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshNotifications}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No notifications</h3>
                  <p className="text-muted-foreground">
                    {filter !== "all" 
                      ? "Try changing your filter to see more notifications" 
                      : "You're all caught up! We'll notify you when something happens"}
                  </p>
                </div>
              ) : (
                <NotificationList
                  notifications={filteredNotifications}
                  isLoading={isLoading}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  onClose={() => {}}
                  onNotificationClick={handleNotificationClick}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
