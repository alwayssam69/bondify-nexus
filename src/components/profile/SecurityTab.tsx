
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const SecurityTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
      <div className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Account secured</AlertTitle>
          <AlertDescription>
            Your account is protected with email and password authentication.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your password to keep your account secure.
            </p>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Devices</h3>
            <p className="text-sm text-muted-foreground">
              Manage devices that are currently signed in to your account.
            </p>
            <Button variant="outline">Manage Devices</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
