
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
  
  const handleProfileClick = (path: string) => {
    // Force a full navigation with replace: true
    window.location.href = path;
  };
  
  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      await signOut();
      console.log("Sign out successful, redirecting to login page");
      // Ensure we force a full navigation to login page
      window.location.href = '/login';
      toast.success("You have been signed out successfully");
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
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
        <DropdownMenuLabel className="text-gray-800 font-medium">My Account</DropdownMenuLabel>
        <DropdownMenuItem className="text-sm text-gray-600">
          {profile?.full_name || user?.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={() => handleProfileClick("/profile")} className="text-gray-800 hover:bg-gray-100">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileClick("/dashboard")} className="text-gray-800 hover:bg-gray-100">
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileClick("/matches")} className="text-gray-800 hover:bg-gray-100">
          Matches
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileClick("/chat")} className="text-gray-800 hover:bg-gray-100">
          Messages
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
