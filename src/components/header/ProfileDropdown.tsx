
import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    navigate(path, { replace: true });
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
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
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem className="text-sm text-muted-foreground">
          {profile?.full_name || user?.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleProfileClick("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileClick("/dashboard")}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileClick("/matches")}>
          Matches
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleProfileClick("/chat")}>
          Messages
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
