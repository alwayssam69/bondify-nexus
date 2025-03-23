
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Step2FormValues } from "../Step2ProfileSchema";
import DynamicSkillSelect from "@/components/form/DynamicSkillSelect";
import MultiInterestSelect from "@/components/form/MultiInterestSelect";
import { industryOptions, experienceLevels } from "@/data/formOptions";
import { Briefcase } from "lucide-react";

interface ProfessionalDetailsSectionProps {
  form: UseFormReturn<Step2FormValues>;
}

const ProfessionalDetailsSection: React.FC<ProfessionalDetailsSectionProps> = ({ form }) => {
  // Watch the industry field to update skills
  const selectedIndustry = form.watch("industry");

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset skills when industry changes
                  form.setValue("skills", []);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <DynamicSkillSelect
            industry={selectedIndustry}
            label="Skills"
            value={field.value}
            onChange={field.onChange}
            placeholder="Select skills relevant to your industry"
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <MultiInterestSelect
            label="Interests"
            value={field.value}
            onChange={field.onChange}
            placeholder="Select your personal interests"
          />
        )}
      />
    </>
  );
};

export default ProfessionalDetailsSection;
