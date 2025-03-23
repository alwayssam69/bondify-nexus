
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { UserCheck, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import DynamicSkillSelect from "@/components/form/DynamicSkillSelect";
import MultiInterestSelect from "@/components/form/MultiInterestSelect";
import LocationSelector from "@/components/form/LocationSelector";
import { industryOptions, experienceLevels } from "@/data/formOptions";

interface Step2ProfileProps {
  email: string;
  onNextStep: (profileData: ProfileData) => void;
  onPrevStep: () => void;
}

export interface ProfileData {
  fullName: string;
  profession: string;
  industry: string;
  location: string;
  university?: string;
  skills: string[];
  bio: string;
  experienceLevel: string;
  interests: string[];
  state: string;
  city: string;
  useCurrentLocation: boolean;
}

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  profession: z.string().min(2, "Please enter your profession"),
  industry: z.string().min(1, "Please select your industry"),
  state: z.string().min(1, "Please select your state"),
  city: z.string().optional(),
  location: z.string().min(2, "Please enter your location"),
  university: z.string().optional(),
  bio: z.string().min(10, "Please tell us a bit about yourself"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  useCurrentLocation: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const Step2Profile = ({ email, onNextStep, onPrevStep }: Step2ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  // Watch the industry field to update skills
  const selectedIndustry = form.watch("industry");
  const selectedState = form.watch("state");
  const useCurrentLocation = form.watch("useCurrentLocation");

  const onSubmit = async (values: FormValues) => {
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
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="John Doe" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Software Engineer" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="useCurrentLocation"
                render={({ field }) => (
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field: stateField }) => (
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field: cityField }) => (
                          <LocationSelector
                            stateValue={stateField.value}
                            cityValue={cityField.value}
                            useLocationValue={field.value}
                            onStateChange={stateField.onChange}
                            onCityChange={cityField.onChange}
                            onUseLocationChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                // If using current location, store the location in the location field
                                // You could also get and store coordinates here if needed
                                form.setValue("location", "Current Location");
                              } else if (form.getValues("location") === "Current Location") {
                                // Clear the location field if it was set to "Current Location"
                                form.setValue("location", "");
                              }
                            }}
                          />
                        )}
                      />
                    )}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder={useCurrentLocation ? "Using current location" : "e.g., Area, Landmark"} 
                          className="pl-10" 
                          {...field} 
                          disabled={useCurrentLocation}
                          value={useCurrentLocation ? "Current Location" : field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University/College <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Stanford University" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us a bit about yourself, your background, and what you're looking for" 
                    className="min-h-24 resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
