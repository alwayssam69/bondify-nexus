
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";
import { ProfileFormValues } from "@/components/profile/ProfileFormSchema";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { profile, refreshProfile } = useAuth();
  const [initialData, setInitialData] = useState<Partial<ProfileFormValues>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Immediately refresh profile data when component mounts
    const loadProfileData = async () => {
      setIsLoading(true);
      await refreshProfile();
      setIsLoading(false);
    };
    
    loadProfileData();
  }, [refreshProfile]);
  
  useEffect(() => {
    if (profile) {
      setInitialData({
        fullName: profile.full_name || "",
        location: profile.location || "",
        bio: profile.bio || "",
        industry: profile.industry || "",
        userType: profile.user_type || "",
        experienceLevel: profile.experience_level || "",
        university: profile.university || "",
        courseYear: profile.course_year || "",
        skills: profile.skills || [],
        interests: profile.interests || [],
        projectInterests: profile.project_interests || [],
        state: profile.state || "",
        city: profile.city || "",
        useCurrentLocation: profile.use_current_location || false,
      });
      setIsLoading(false);
    }
  }, [profile]);

  return (
    <Layout className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Update your information to get better matches
          </p>
        </div>
        
        <div className="card-glass rounded-xl p-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProfileForm initialData={initialData} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
