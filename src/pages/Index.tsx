import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhatWeOffer from "@/components/WhatWeOffer";
import FindMatchButton from "@/components/matchmaking/FindMatchButton";

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

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Hero 
          user={user} 
          onGetStarted={() => navigate("/register")} 
          onSignIn={() => navigate("/login")} 
          onDashboard={() => navigate("/dashboard")} 
          actionButton={<FindMatchButton />}
        />
        <WhatWeOffer />
        <HowItWorks />
      </div>
    </Layout>
  );
};

export default Index;
