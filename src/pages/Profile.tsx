import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileAlert from "@/components/profile/ProfileAlert";
import PublicProfile from "@/components/profile/PublicProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { loadSampleUsers } from "@/lib/matchmaking";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut, profile: authProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  const isPublicProfile = !!id && id !== user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const profileId = id || user?.id;
        
        if (!profileId) {
          console.log("No profile ID available");
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching profile for ID:", profileId);
        setIsCurrentUser(profileId === user?.id);
        
        if (profileId === user?.id && authProfile) {
          console.log("Using profile from auth context:", authProfile);
          setUserProfile(authProfile);
          setIsProfileIncomplete(isProfileMissingData(authProfile));
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching profile from database");
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (error) {
          console.error("Error fetching profile from user_profiles:", error);
          
          const altResult = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .single();
            
          if (altResult.error) {
            console.error("Error fetching profile from profiles table:", altResult.error);
            throw new Error("Could not fetch profile from any table");
          }
          
          if (altResult.data) {
            console.log("Profile found in profiles table:", altResult.data);
            setUserProfile(altResult.data);
            setIsProfileIncomplete(isProfileMissingData(altResult.data));
            setIsLoading(false);
            return;
          }
          
          throw error;
        }
        
        if (data) {
          console.log("Profile found in user_profiles:", data);
          setUserProfile(data);
          setIsProfileIncomplete(isProfileMissingData(data));
        } else {
          console.log("No profile found in database");
          
          if (profileId === user?.id) {
            console.log("Creating minimal profile for current user");
            const minimalProfile = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              created_at: new Date().toISOString()
            };
            setUserProfile(minimalProfile);
            setIsProfileIncomplete(true);
            refreshProfile();
          } else {
            toast.error("Profile not found");
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Error in profile fetch:", error);
        setHasError(true);
        
        if (isPublicProfile && loadAttempts > 1) {
          const sampleUsers = loadSampleUsers();
          const sampleProfile = sampleUsers.find(u => u.id === id) || sampleUsers[0];
          
          if (sampleProfile) {
            console.log("Using sample profile as fallback:", sampleProfile);
            setUserProfile({
              id: sampleProfile.id,
              full_name: sampleProfile.name,
              bio: sampleProfile.bio,
              industry: sampleProfile.industry,
              experience_level: sampleProfile.experienceLevel,
              user_type: sampleProfile.userType,
              skills: sampleProfile.skills,
              interests: sampleProfile.interests,
              created_at: new Date().toISOString()
            });
            setIsLoading(false);
            return;
          }
        }
        
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
    setLoadAttempts(prev => prev + 1);
    
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached");
        setLoadingTimeout(true);
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, user, authProfile, navigate, refreshProfile, loadAttempts, isPublicProfile]);
  
  const isProfileMissingData = (profile: any) => {
    if (!profile) return true;
    
    const requiredFields = ['full_name', 'bio', 'industry', 'user_type'];
    const missingFields = requiredFields.filter(field => !profile[field]);
    
    if (missingFields.length > 0) {
      console.log("Missing profile fields:", missingFields);
      return true;
    }
    return false;
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };
  
  const handleRefreshPage = () => {
    setLoadAttempts(0);
    setHasError(false);
    setIsLoading(true);
    setLoadingTimeout(false);
    window.location.reload();
  };
  
  if (isLoading && !loadingTimeout) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if ((!userProfile || hasError) && (loadingTimeout || loadAttempts > 2)) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
            <img 
              src="/public/lovable-uploads/e13f7eb2-283f-483a-a27d-b8a33c7d9f9d.png" 
              alt="Profile Data Unavailable" 
              className="w-full max-w-md mb-4 rounded-lg shadow-md"
            />
            <h2 className="text-2xl font-bold mb-4">Profile Data Unavailable</h2>
            <p className="mb-6 text-muted-foreground max-w-md">
              We couldn't load your profile information. This could be due to a network issue or a problem with our servers.
            </p>
            <button 
              onClick={handleRefreshPage}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 shadow-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isPublicProfile) {
    return (
      <Layout>
        <PublicProfile userProfile={userProfile} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileSidebar 
            userProfile={userProfile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSignOut={handleSignOut}
          />
          
          <div className="flex-1">
            <ProfileAlert isProfileIncomplete={isProfileIncomplete} />
            
            <ProfileTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              userProfile={userProfile}
              refreshProfile={refreshProfile}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
