
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSettings from "@/components/profile/ProfileSettings";
import SecurityTab from "@/components/profile/SecurityTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import ActivityTab from "@/components/profile/ActivityTab";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  userProfile: any;
  refreshProfile: () => Promise<void>;
}

const ProfileTabs = ({ activeTab, onTabChange, userProfile, refreshProfile }: ProfileTabsProps) => {
  // Add debug to check userProfile data
  console.log("ProfileTabs rendering with profile:", userProfile);
  console.log("Active tab:", activeTab);

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Profile
          </TabsTrigger>
          
          <TabsTrigger
            value="edit"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Edit Profile
          </TabsTrigger>
          
          <TabsTrigger
            value="settings"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="p-6">
          <ProfileInfo profileData={userProfile} isPublic={false} />
        </TabsContent>
        
        <TabsContent value="edit" className="p-6">
          <ProfileForm 
            initialData={userProfile} 
            onSuccess={() => {
              refreshProfile();
              onTabChange("profile");
            }}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="p-6">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="security" className="p-6">
          <SecurityTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="p-6">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="activity" className="p-6">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
