
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";
import { ProfileFormValues } from "@/components/profile/ProfileFormSchema";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile, user } = useAuth();
  const [initialData, setInitialData] = useState<Partial<ProfileFormValues>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Immediately refresh profile data when component mounts
    const loadProfileData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Set a timeout to ensure we don't load for more than 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Profile load timeout")), 5000);
        });
        
        try {
          await Promise.race([refreshProfile(), timeoutPromise]);
        } catch (error) {
          console.error("Error refreshing profile:", error);
          toast.error("Failed to load your profile data");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadProfileData();
    }
  }, [refreshProfile, user]);
  
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
    }
  }, [profile]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Layout className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            className="mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              {!profile ? 
                "Complete your profile to get better matches" : 
                "Update your information to get better matches"}
            </p>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-8">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your profile data...</p>
            </div>
          ) : !profile ? (
            <div className="text-center py-8">
              <p className="mb-4 text-muted-foreground">
                Please complete your profile to start connecting with others.
              </p>
              <ProfileForm initialData={{}} />
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
