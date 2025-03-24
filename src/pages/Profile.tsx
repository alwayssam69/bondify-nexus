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
  
  const isPublicProfile = !!id && id !== user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        const profileId = id || user?.id;
        
        if (!profileId) {
          setIsLoading(false);
          return;
        }
        
        setIsCurrentUser(profileId === user?.id);
        
        if (profileId === user?.id && authProfile) {
          setUserProfile(authProfile);
          setIsProfileIncomplete(isProfileMissingData(authProfile));
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          
          const altResult = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .single();
            
          if (altResult.error) {
            throw error;
          }
          
          if (altResult.data) {
            setUserProfile(altResult.data);
            setIsProfileIncomplete(isProfileMissingData(altResult.data));
            setIsLoading(false);
            return;
          }
          
          throw error;
        }
        
        if (data) {
          setUserProfile(data);
          setIsProfileIncomplete(isProfileMissingData(data));
        } else {
          if (profileId === user?.id) {
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
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
    
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, user, authProfile, navigate, refreshProfile]);
  
  const isProfileMissingData = (profile: any) => {
    const requiredFields = ['full_name', 'bio', 'industry', 'user_type'];
    return !profile || requiredFields.some(field => !profile[field]);
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

  if (!userProfile && loadingTimeout) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="text-center min-h-[60vh] flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Profile Data Unavailable</h2>
            <p className="mb-4">We couldn't load your profile information. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mx-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
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
