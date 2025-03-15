
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthButtons = () => {
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
