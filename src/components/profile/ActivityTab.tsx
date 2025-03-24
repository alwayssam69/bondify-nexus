
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, User, Mail, Building } from "lucide-react";

const ActivityTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Activity Log</AlertTitle>
          <AlertDescription>
            Track your recent connections, profile views, and messages.
          </AlertDescription>
        </Alert>
        
        <div className="border rounded-md divide-y">
          <div className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Profile update</p>
              <p className="text-sm text-muted-foreground">You updated your profile</p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Message received</p>
              <p className="text-sm text-muted-foreground">You received a new message</p>
              <p className="text-xs text-muted-foreground">1 week ago</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Account created</p>
              <p className="text-sm text-muted-foreground">You created your account</p>
              <p className="text-xs text-muted-foreground">1 month ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTab;
