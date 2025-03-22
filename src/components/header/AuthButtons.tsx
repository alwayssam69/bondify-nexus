
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AuthButtons = () => {
  const { user, signOut } = useAuth();
  
  // If user is authenticated, show logout button instead of login/signup
  if (user) {
    return (
      <Button variant="ghost" className="text-sm" onClick={signOut}>
        Sign Out
      </Button>
    );
  }
  
  return (
    <>
      <Link to="/login">
        <Button variant="ghost" className="text-sm">
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
