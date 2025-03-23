
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Tag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const AuthButtons = () => {
  const { user, profile, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      console.log("Signing out from AuthButtons...");
      await signOut();
      console.log("Sign out successful");
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };
  
  // If user is authenticated, show logout button instead of login/signup
  if (user) {
    const userTag = profile?.user_tag || user?.user_metadata?.user_tag || null;
    
    return (
      <div className="flex items-center gap-2">
        {userTag && (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>{userTag}</span>
          </Badge>
        )}
        <Button 
          variant="ghost" 
          className="text-sm flex items-center gap-1" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sign Out
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Link to="/login">
        <Button variant="ghost" className="text-sm flex items-center gap-1">
          <User className="h-4 w-4 mr-1" />
          Sign In
        </Button>
      </Link>
      <Link to="/register">
        <Button className="bg-primary hover:bg-primary/90 text-sm">
          Get Started
        </Button>
      </Link>
    </>
  );
};

export default AuthButtons;
