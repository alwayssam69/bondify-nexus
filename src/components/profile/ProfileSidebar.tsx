
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Shield, Bell, Activity, LogOut } from "lucide-react";

interface ProfileSidebarProps {
  userProfile: any;
  activeTab: string;
  onTabChange: (value: string) => void;
  onSignOut: () => void;
}

const ProfileSidebar = ({ userProfile, activeTab, onTabChange, onSignOut }: ProfileSidebarProps) => {
  return (
    <div className="md:w-64 space-y-6">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            {userProfile?.image_url ? (
              <img 
                src={userProfile.image_url} 
                alt={userProfile?.full_name || "User"}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-xl">{userProfile?.full_name || "Anonymous User"}</h3>
            <p className="text-muted-foreground text-sm">
              {userProfile?.user_type || "Professional"} {userProfile?.industry ? `· ${userProfile.industry}` : ""}
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/5">
            {userProfile?.profile_completeness || 0}% Profile Completion
          </Badge>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="py-2">
          <button
            className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
              activeTab === "profile" ? "bg-primary/10 text-primary" : "hover:bg-accent"
            }`}
            onClick={() => onTabChange("profile")}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </button>
          
          <button
            className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
              activeTab === "settings" ? "bg-primary/10 text-primary" : "hover:bg-accent"
            }`}
            onClick={() => onTabChange("settings")}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          
          <button
            className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
              activeTab === "security" ? "bg-primary/10 text-primary" : "hover:bg-accent"
            }`}
            onClick={() => onTabChange("security")}
          >
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </button>
          
          <button
            className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
              activeTab === "notifications" ? "bg-primary/10 text-primary" : "hover:bg-accent"
            }`}
            onClick={() => onTabChange("notifications")}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </button>
          
          <button
            className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
              activeTab === "activity" ? "bg-primary/10 text-primary" : "hover:bg-accent"
            }`}
            onClick={() => onTabChange("activity")}
          >
            <Activity className="h-4 w-4" />
            <span>Activity</span>
          </button>
          
          <button
            className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20`}
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
