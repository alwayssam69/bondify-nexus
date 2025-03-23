
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

const AuthButtons = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
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
  
  // If user is authenticated, show logout button instead of login/signup
  if (user) {
    return (
      <Button 
        variant="ghost" 
        className="text-sm flex items-center gap-1" 
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-1" />
        Sign Out
      </Button>
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
