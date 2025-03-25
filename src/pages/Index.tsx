
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

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Hero 
          user={user} 
          onGetStarted={handleGetStarted} 
          onSignIn={handleSignIn} 
          onDashboard={() => navigate("/dashboard")} 
          actionButton={user ? <FindMatchButton /> : <FindMatchButton />}
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
