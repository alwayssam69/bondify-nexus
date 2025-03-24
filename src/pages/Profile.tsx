
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
  }, [id, user, authProfile, navigate]);
  
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
  
  if (isLoading) {
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
