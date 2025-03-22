
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import DynamicMatches from "@/components/DynamicMatches";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Hero user={user} onGetStarted={() => navigate("/register")} onSignIn={() => navigate("/login")} onDashboard={() => navigate("/dashboard")} />
        <HowItWorks />
        <Features />
        <Testimonials />
        <DynamicMatches />
      </div>
    </Layout>
  );
};

export default Index;
