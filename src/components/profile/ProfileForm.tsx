
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { profileFormSchema, calculateCompletenessScore, ProfileFormValues } from "./ProfileFormSchema";
import PersonalInfoSection from "./PersonalInfoSection";
import ProfessionalDetailsSection from "./ProfessionalDetailsSection";
import EducationSection from "./EducationSection";
import InterestsSection from "./InterestsSection";
import LocationSection from "./LocationSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ProfileFormProps {
  initialData?: Partial<ProfileFormValues>;
  onChange?: () => void;
  onSubmit?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onChange, onSubmit }) => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      location: initialData?.location || "",
      bio: initialData?.bio || "",
      industry: initialData?.industry || "",
      userType: initialData?.userType || "",
      experienceLevel: initialData?.experienceLevel || "",
      university: initialData?.university || "",
      courseYear: initialData?.courseYear || "",
      skills: initialData?.skills || [],
      interests: initialData?.interests || [],
      projectInterests: initialData?.projectInterests || [],
      state: initialData?.state || "",
      city: initialData?.city || "",
      useCurrentLocation: initialData?.useCurrentLocation || false,
    },
  });
  
  // Update form values when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Reset form with new values
      form.reset({
        fullName: initialData.fullName || "",
        location: initialData.location || "",
        bio: initialData.bio || "",
        industry: initialData.industry || "",
        userType: initialData.userType || "",
        experienceLevel: initialData.experienceLevel || "",
        university: initialData.university || "",
        courseYear: initialData.courseYear || "",
        skills: initialData.skills || [],
        interests: initialData.interests || [],
        projectInterests: initialData.projectInterests || [],
        state: initialData.state || "",
        city: initialData.city || "",
        useCurrentLocation: initialData.useCurrentLocation || false,
      });
      setFormTouched(false);
    }
  }, [initialData, form]);
  
  // Check for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (!formTouched) {
        setFormTouched(true);
        if (onChange) {
          onChange();
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, onChange, formTouched]);
  
  const handleSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const completenessScore = calculateCompletenessScore(values);
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: values.fullName,
          location: values.location,
          bio: values.bio,
          industry: values.industry,
          user_type: values.userType,
          experience_level: values.experienceLevel,
          university: values.university,
          course_year: values.courseYear,
          skills: values.skills,
          interests: values.interests,
          project_interests: values.projectInterests,
          state: values.state,
          city: values.city,
          use_current_location: values.useCurrentLocation,
          updated_at: new Date().toISOString(),
          profile_completeness: completenessScore,
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Reset form touched state
      setFormTouched(false);
      
      // Refresh the profile data immediately after update
      await refreshProfile();
      
      toast.success("Profile updated successfully!");
      
      if (onSubmit) {
        onSubmit();
      }
      
      // Redirect to dashboard after successful update
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (formTouched) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirm) return;
    }
    navigate(-1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {formTouched && (
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              You have unsaved changes. Don't forget to save your profile before leaving.
            </AlertDescription>
          </Alert>
        )}
        
        <FormSection title="Personal Information">
          <PersonalInfoSection form={form} />
        </FormSection>
        
        <FormSection title="Professional Details">
          <ProfessionalDetailsSection form={form} />
        </FormSection>
        
        <FormSection title="Education">
          <EducationSection form={form} />
        </FormSection>
        
        <FormSection title="Interests & Projects">
          <InterestsSection form={form} />
        </FormSection>
        
        <FormSection title="Location">
          <LocationSection form={form} />
        </FormSection>
        
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
