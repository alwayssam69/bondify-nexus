
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
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    toast.loading("Preparing registration form...");
    setTimeout(() => {
      navigate("/register");
      toast.dismiss();
    }, 500);
  };

  const handleSignIn = () => {
    toast.loading("Preparing login form...");
    setTimeout(() => {
      navigate("/login");
      toast.dismiss();
    }, 500);
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
