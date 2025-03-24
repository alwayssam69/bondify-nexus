
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
import { User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile?edit=true");
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Hero 
          user={user} 
          onGetStarted={handleGetStarted} 
          onSignIn={handleSignIn} 
          onDashboard={() => navigate("/dashboard")} 
          actionButton={
            user ? (
              <Button 
                variant="outline" 
                onClick={handleEditProfile}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : <FindMatchButton />
          }
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
