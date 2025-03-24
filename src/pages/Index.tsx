
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import DynamicMatches from "@/components/DynamicMatches";
import WhatWeOffer from "@/components/WhatWeOffer";
import Testimonials from "@/components/Testimonials";
import FindMatchButton from "@/components/matchmaking/FindMatchButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  
  // Safely access auth context
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth context not available yet in Index page:", error);
  }

  const handleGetStarted = () => {
    try {
      // Display loading toast
      toast.loading("Preparing registration form...");
      
      // Add delay to ensure UI feedback
      setTimeout(() => {
        navigate("/register");
        toast.dismiss();
      }, 500);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("There was an issue accessing the registration form. Please try again.");
    }
  };

  const handleSignIn = () => {
    try {
      // Display loading toast
      toast.loading("Preparing login form...");
      
      // Add delay to ensure UI feedback
      setTimeout(() => {
        navigate("/login");
        toast.dismiss();
      }, 500);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("There was an issue accessing the login form. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Hero 
          user={user} 
          onGetStarted={handleGetStarted} 
          onSignIn={handleSignIn} 
          onDashboard={() => navigate("/dashboard")} 
          actionButton={<FindMatchButton />}
        />
        <WhatWeOffer />
        <HowItWorks />
        <Testimonials />
        <DynamicMatches />
      </div>
    </Layout>
  );
};

export default Index;
