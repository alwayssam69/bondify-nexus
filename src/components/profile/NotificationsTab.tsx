
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";

const NotificationsTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <MailCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Email Notifications Active</AlertTitle>
          <AlertDescription>
            You're receiving email notifications for important updates and messages.
          </AlertDescription>
        </Alert>
        
        <p className="text-muted-foreground">Configure how and when you receive notifications.</p>
      </div>
    </div>
  );
};

export default NotificationsTab;
