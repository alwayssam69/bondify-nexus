
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormGroup } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import DynamicSkillSelect from "@/components/form/DynamicSkillSelect";
import { industryOptions, experienceLevels } from "@/data/formOptions";
import { ProfileFormValues } from "./ProfileFormSchema";

interface ProfessionalDetailsSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const ProfessionalDetailsSection: React.FC<ProfessionalDetailsSectionProps> = ({ form }) => {
  const selectedIndustry = form.watch("industry");
  const { formState: { errors } } = form;

  return (
    <>
      <FormGroup>
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset skills when industry changes to avoid invalid selections
                  form.setValue("skills", []);
                }} 
                value={field.value || "select-industry"}
              >
                <FormControl>
                  <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="bg-white z-50">
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
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "select-type"}>
                <FormControl>
                  <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="bg-white z-50">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="founder">Founder</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="collaborator">Collaborator</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormGroup>
      
      <FormField
        control={form.control}
        name="experienceLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "select-level"}>
              <FormControl>
                <SelectTrigger className={errors.experienceLevel ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent position="popper" className="bg-white z-50">
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
      
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <DynamicSkillSelect
              industry={selectedIndustry}
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Select skills relevant to your industry"
              error={!!errors.skills}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfessionalDetailsSection;
