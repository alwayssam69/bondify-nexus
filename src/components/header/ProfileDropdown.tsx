
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfileDropdown = () => {
  try {
    const { user, profile, signOut } = useAuth();
    
    // Get first letter of name or email for avatar
    const getInitial = () => {
      if (profile?.full_name) {
        return profile.full_name.charAt(0);
      } else if (user?.email) {
        return user.email.charAt(0).toUpperCase();
      }
      return "U";
    };
    
    // Get display name (ensure only one name is shown)
    const getDisplayName = () => {
      if (profile?.full_name) {
        return profile.full_name;
      } else if (user?.email) {
        return user.email;
      }
      return "User";
    };
    
    const handleProfileClick = (path: string) => {
      // Force a full navigation with replace: true
      window.location.href = path;
    };
    
    const handleSignOut = async () => {
      try {
        console.log("Signing out...");
        toast.info("Signing out...");
        await signOut();
        // No need for redirect as it's handled in AuthContext
      } catch (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to sign out. Please try again.");
      }
    };
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-blue-100">
            <span className="text-blue-600">{getInitial()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
          <DropdownMenuLabel className="text-gray-800 dark:text-gray-200 font-medium">My Account</DropdownMenuLabel>
          <DropdownMenuItem className="text-sm text-gray-600 dark:text-gray-300">
            {getDisplayName()}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem onClick={() => handleProfileClick("/profile")} className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleProfileClick("/dashboard")} className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleProfileClick("/matches")} className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Matches
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleProfileClick("/chat")} className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Messages
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } catch (error) {
    // Fallback UI when auth context is not available
    console.log("Auth context not available yet in ProfileDropdown:", error);
    return null;
  }
};

export default ProfileDropdown;
