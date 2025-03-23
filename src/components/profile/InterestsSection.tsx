
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
          <FormItem>
            <FormLabel>Personal Interests</FormLabel>
            <MultiInterestSelect
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Select your personal interests"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="projectInterests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Interests</FormLabel>
            <MultiInterestSelect
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Select your project interests"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default InterestsSection;
