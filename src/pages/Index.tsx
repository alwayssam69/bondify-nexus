
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import DynamicMatches from "@/components/DynamicMatches";
import WhatWeOffer from "@/components/WhatWeOffer";
import FloatingNavigation from "@/components/FloatingNavigation";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Hero 
          user={user} 
          onGetStarted={() => navigate("/register")} 
          onSignIn={() => navigate("/login")} 
          onDashboard={() => navigate("/dashboard")} 
        />
        <WhatWeOffer />
        <HowItWorks />
        <Features />
        <DynamicMatches />
        <FloatingNavigation />
      </div>
    </Layout>
  );
};

export default Index;
