
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
import { ProfileFormValues } from "./ProfileFormSchema";

interface EducationSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const EducationSection: React.FC<EducationSectionProps> = ({ form }) => {
  return (
    <FormGroup>
      <FormField
        control={form.control}
        name="university"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University / College</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None/Not Applicable</SelectItem>
                <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
                <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
                <SelectItem value="IIT Madras">IIT Madras</SelectItem>
                <SelectItem value="IIT Kanpur">IIT Kanpur</SelectItem>
                <SelectItem value="IIT Kharagpur">IIT Kharagpur</SelectItem>
                <SelectItem value="BITS Pilani">BITS Pilani</SelectItem>
                <SelectItem value="Delhi University">Delhi University</SelectItem>
                <SelectItem value="NIT Trichy">NIT Trichy</SelectItem>
                <SelectItem value="NIT Warangal">NIT Warangal</SelectItem>
                <SelectItem value="VIT Vellore">VIT Vellore</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="courseYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Year</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None/Not Applicable</SelectItem>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
                <SelectItem value="4th Year">4th Year</SelectItem>
                <SelectItem value="5th Year">5th Year</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Alumni">Alumni</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormGroup>
  );
};

export default EducationSection;
