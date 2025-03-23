
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingStep from "@/components/onboarding/OnboardingStep";
import Step1Email from "@/components/onboarding/Step1Email";
import Step2Profile from "@/components/onboarding/Step2Profile";
import { ProfileData } from "@/components/onboarding/Step2ProfileSchema";
import Step3Preferences, { PreferencesData } from "@/components/onboarding/Step3Preferences";
import Step4Recommendations from "@/components/onboarding/Step4Recommendations";
import { Mail, User, Settings, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = ["Email", "Your Profile", "Preferences", "Recommendations"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [preferencesData, setPreferencesData] = useState<PreferencesData | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleEmailStep = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setCurrentStep(1);
  };
  
  const handleProfileStep = (data: ProfileData) => {
    setProfileData(data);
    setCurrentStep(2);
  };
  
  const handlePreferencesStep = (data: PreferencesData) => {
    setPreferencesData(data);
    setCurrentStep(3);
  };
  
  const handleComplete = async () => {
    if (!email || !password || !profileData) {
      toast.error("Missing required information");
      return;
    }
    
    setIsCreatingAccount(true);
    
    try {
      console.log("Creating user account with email:", email);
      
      // 1. Create the user account
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (!userData.user) {
        throw new Error("Failed to create user account");
      }
      
      console.log("User account created successfully with ID:", userData.user.id);
      
      // 2. Insert a record in the profiles table for legacy support
      const { error: profilesError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          full_name: profileData.fullName,
          email: email,
          location: profileData.location || null,
          bio: profileData.bio || null,
        });
        
      if (profilesError) {
        console.error("Error inserting into profiles table:", profilesError);
      }
      
      // 3. Update the user profile with more data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userData.user.id,
          full_name: profileData.fullName,
          email: email,
          location: profileData.location || null,
          bio: profileData.bio || null,
          industry: profileData.industry || null,
          user_type: profileData.profession || null,
          skills: profileData.skills || [],
          university: profileData.university || null,
          profile_completeness: 80,
          project_interests: preferencesData?.interests || [],
          networking_goals: preferencesData?.networkingGoals || [],
          activity_score: 70,
          match_preferences: {
            connectionPreferences: preferencesData?.connectionPreferences || "all",
            experienceLevel: preferencesData?.experienceLevel || "all",
            locationPreference: preferencesData?.locationPreference || "global",
          },
        }, { onConflict: 'id' });
      
      if (profileError) {
        console.error("Error updating user_profiles:", profileError);
        // We can continue even with this error
      }
      
      // 3. Auto-login the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error("Error signing in after registration:", signInError);
        // If auto-login fails, redirect to login page
        toast.success("Account created successfully! Please log in.");
        navigate("/login", { state: { email } });
        return;
      }
      
      // 4. Redirect to dashboard
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error in account creation:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
      setIsCreatingAccount(false);
    } finally {
      setIsCreatingAccount(false);
    }
  };
  
  const handleStepClick = (step: number) => {
    // Only allow going back to previous steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <Layout className="pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-glass rounded-xl p-8 sm:p-10">
          <OnboardingProgress 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={handleStepClick}
          />
          
          <OnboardingStep
            isActive={currentStep === 0}
            title="Let's get started"
            description="Create your account to connect with professionals"
            icon={<Mail className="h-6 w-6" />}
          >
            <Step1Email onNextStep={handleEmailStep} />
          </OnboardingStep>
          
          <OnboardingStep
            isActive={currentStep === 1}
            title="Tell us about yourself"
            description="Complete your profile to help us find the right connections for you"
            icon={<User className="h-6 w-6" />}
          >
            <Step2Profile 
              email={email} 
              onNextStep={handleProfileStep} 
              onPrevStep={() => setCurrentStep(0)} 
            />
          </OnboardingStep>
          
          <OnboardingStep
            isActive={currentStep === 2}
            title="Set your preferences"
            description="Let us know what kind of connections you're looking for"
            icon={<Settings className="h-6 w-6" />}
          >
            <Step3Preferences 
              onNextStep={handlePreferencesStep} 
              onPrevStep={() => setCurrentStep(1)} 
            />
          </OnboardingStep>
          
          <OnboardingStep
            isActive={currentStep === 3}
            title="Your personalized recommendations"
            description="Based on your profile and preferences, we've found some great matches for you"
            icon={<Users className="h-6 w-6" />}
          >
            {profileData && preferencesData && (
              <Step4Recommendations 
                profileData={profileData}
                preferencesData={preferencesData}
                onNextStep={handleComplete}
                onPrevStep={() => setCurrentStep(2)}
                isLoading={isCreatingAccount}
              />
            )}
          </OnboardingStep>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
