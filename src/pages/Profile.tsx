
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";
import { ProfileFormValues } from "@/components/profile/ProfileFormSchema";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { profile, refreshProfile, user } = useAuth();
  const [initialData, setInitialData] = useState<Partial<ProfileFormValues>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [publicProfile, setPublicProfile] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const isPublicProfile = params.id && params.id !== user?.id;
  
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        if (isPublicProfile) {
          // Load public profile by ID from params
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', params.id)
            .single();
            
          if (error) {
            console.error("Error loading public profile:", error);
            toast.error("Failed to load profile data");
            setHasError(true);
          } else if (data) {
            setPublicProfile(data);
          } else {
            toast.error("Profile not found");
            setHasError(true);
          }
        } else if (user) {
          // Load current user's profile
          try {
            await refreshProfile();
          } catch (error) {
            console.error("Error refreshing profile:", error);
            toast.error("Failed to load your profile data");
            setHasError(true);
          }
        }
      } catch (error) {
        console.error("Error in loadProfileData:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
    
    // Force end loading state after 5 seconds to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.info("Force ending loading state after timeout");
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [refreshProfile, user, params.id, isPublicProfile]);

  // Add window beforeunload event listener to catch unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
  
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

  useEffect(() => {
    if (publicProfile) {
      setInitialData({
        fullName: publicProfile.full_name || "",
        location: publicProfile.location || "",
        bio: publicProfile.bio || "",
        industry: publicProfile.industry || "",
        userType: publicProfile.user_type || "",
        experienceLevel: publicProfile.experience_level || "",
        university: publicProfile.university || "",
        courseYear: publicProfile.course_year || "",
        skills: publicProfile.skills || [],
        interests: publicProfile.interests || [],
        projectInterests: publicProfile.project_interests || [],
        state: publicProfile.state || "",
        city: publicProfile.city || "",
      });
    }
  }, [publicProfile]);

  const isProfileIncomplete = () => {
    if (!profile) return true;
    
    // Check if essential fields are missing
    const essentialFields = [
      profile.full_name,
      profile.industry,
      profile.skills?.length > 0,
      profile.interests?.length > 0,
      profile.user_type
    ];
    
    return essentialFields.some(field => !field);
  };

  const goBack = () => {
    if (isDirty) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirm) return;
    }
    navigate(-1);
  };

  const handleFormChange = () => {
    setIsDirty(true);
  };

  const handleFormSubmit = () => {
    setIsDirty(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      );
    }
    
    if (hasError) {
      return (
        <div className="text-center py-8">
          <p className="mb-4 text-muted-foreground">
            We encountered an error loading the profile. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      );
    }
    
    if (isPublicProfile) {
      if (!publicProfile) {
        return (
          <div className="text-center py-8">
            <p className="mb-4 text-muted-foreground">
              Profile not found or has been deleted.
            </p>
            <Button onClick={goBack}>Go Back</Button>
          </div>
        );
      }
      
      // View-only profile
      return (
        <div className="space-y-6">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold">{initialData.fullName || "Anonymous User"}</h2>
            <p className="text-muted-foreground">
              {initialData.userType || "Professional"} • {initialData.industry || "Industry not specified"}
            </p>
            <p className="mt-2">{initialData.bio || "No bio provided"}</p>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-medium mb-2">Skills</h3>
            {initialData.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {initialData.skills?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No skills listed</p>
            )}
          </div>
          
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            {initialData.interests?.length ? (
              <div className="flex flex-wrap gap-2">
                {initialData.interests?.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No interests listed</p>
            )}
          </div>
          
          <div className="flex justify-center py-4">
            <Button onClick={goBack}>Back to Matches</Button>
          </div>
        </div>
      );
    }
    
    if (!profile) {
      return (
        <div className="text-center py-8">
          <p className="mb-4 text-muted-foreground">
            Please complete your profile to start connecting with others.
          </p>
          <ProfileForm initialData={{}} onChange={handleFormChange} onSubmit={handleFormSubmit} />
        </div>
      );
    }
    
    // Show warning if profile is incomplete
    if (isProfileIncomplete()) {
      return (
        <div className="space-y-6">
          <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Your profile is incomplete</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              Please update your details for better matches and connectivity opportunities.
            </AlertDescription>
          </Alert>
          
          <ProfileForm initialData={initialData} onChange={handleFormChange} onSubmit={handleFormSubmit} />
        </div>
      );
    }
    
    return <ProfileForm initialData={initialData} onChange={handleFormChange} onSubmit={handleFormSubmit} />;
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
            <h1 className="text-3xl font-bold mb-2">
              {isPublicProfile ? publicProfile?.full_name || "User Profile" : "Your Profile"}
            </h1>
            <p className="text-muted-foreground">
              {isPublicProfile 
                ? `${publicProfile?.user_type || "Professional"} in ${publicProfile?.industry || "Industry"}`
                : !profile 
                  ? "Complete your profile to get better matches" 
                  : "Update your information to get better matches"}
            </p>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-8">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
