
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ProfileSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Settings saved successfully");
      setSaveLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Changes to your settings will take effect immediately after saving.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about new matches, messages, and updates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your device
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Privacy</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other users to find and view your profile
                </p>
              </div>
              <Switch
                id="profile-visibility"
                checked={profileVisibility}
                onCheckedChange={setProfileVisibility}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Share your approximate location for better matching
                </p>
              </div>
              <Switch
                id="location-sharing"
                checked={locationSharing}
                onCheckedChange={setLocationSharing}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Manage your account settings and data
              </p>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start">
                  Export Your Data
                </Button>
                <Button variant="outline" className="justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20">
                  Deactivate Account
                </Button>
                <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saveLoading}>
          {saveLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
