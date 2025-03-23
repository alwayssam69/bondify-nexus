
import React from "react";
import { FormField } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import MultiInterestSelect from "@/components/form/MultiInterestSelect";
import { ProfileFormValues } from "./ProfileFormSchema";

interface InterestsSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <MultiInterestSelect
            label="Personal Interests"
            value={field.value}
            onChange={field.onChange}
            placeholder="Select your personal interests"
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="projectInterests"
        render={({ field }) => (
          <MultiInterestSelect
            label="Project Interests"
            value={field.value}
            onChange={field.onChange}
            placeholder="Select your project interests"
          />
        )}
      />
    </>
  );
};

export default InterestsSection;
