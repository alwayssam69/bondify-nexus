
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PersonalInfoSection from "./ProfileSections/PersonalInfoSection";
import ProfessionalDetailsSection from "./ProfileSections/ProfessionalDetailsSection";
import LocationSection from "./ProfileSections/LocationSection";
import { step2FormSchema, Step2FormValues, ProfileData } from "./Step2ProfileSchema";

interface Step2ProfileProps {
  email: string;
  onNextStep: (profileData: ProfileData) => void;
  onPrevStep: () => void;
}

const Step2Profile = ({ email, onNextStep, onPrevStep }: Step2ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2FormSchema),
    defaultValues: {
      fullName: "",
      profession: "",
      industry: "",
      location: "",
      state: "",
      city: "",
      university: "",
      bio: "",
      skills: [],
      interests: [],
      experienceLevel: "",
      useCurrentLocation: false,
    },
  });

  const onSubmit = async (values: Step2FormValues) => {
    setIsLoading(true);
    
    try {
      // Prepare profile data
      const profileData: ProfileData = {
        fullName: values.fullName,
        profession: values.profession,
        industry: values.industry,
        location: values.location,
        university: values.university,
        skills: values.skills,
        bio: values.bio,
        experienceLevel: values.experienceLevel,
        interests: values.interests,
        state: values.state,
        city: values.city || "",
        useCurrentLocation: values.useCurrentLocation,
      };
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onNextStep(profileData);
    } catch (error) {
      console.error("Step 2 error:", error);
      toast.error("An error occurred while saving your profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoSection form={form} />
          <ProfessionalDetailsSection form={form} />
          <LocationSection form={form} />
          
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <motion.div className="flex items-center">
                  <span className="mr-2">Saving profile</span>
                  <span className="relative flex h-2 w-12">
                    <motion.span
                      className="absolute h-full w-1/4 bg-white rounded-full"
                      animate={{ x: [0, 36, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    />
                  </span>
                </motion.div>
              ) : (
                "Next Step"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Step2Profile;
