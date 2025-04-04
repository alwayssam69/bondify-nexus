
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { toast } from "sonner";
import MultiInterestSelect from "@/components/form/MultiInterestSelect";

interface Step3PreferencesProps {
  onNextStep: (preferencesData: PreferencesData) => void;
  onPrevStep: () => void;
}

export interface PreferencesData {
  networkingGoals: string[];
  connectionPreferences: string;
  experienceLevel: string;
  locationPreference: string;
  interests: string[];
  projectInterests: string[];
}

const formSchema = z.object({
  networkingGoals: z.array(z.string()).min(1, "Please select at least one networking goal"),
  connectionPreferences: z.string().min(1, "Please select your connection preference"),
  experienceLevel: z.string().min(1, "Please select your preferred connection experience level"),
  locationPreference: z.string().min(1, "Please select your location preference"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  projectInterests: z.array(z.string()).min(1, "Please select at least one project interest"),
});

type FormValues = z.infer<typeof formSchema>;

const networkingGoals = [
  { id: "job-seeking", label: "Job Seeking" },
  { id: "mentorship", label: "Mentorship" },
  { id: "networking", label: "Professional Networking" },
  { id: "collaboration", label: "Project Collaboration" },
  { id: "learning", label: "Skill Development" },
  { id: "entrepreneurship", label: "Entrepreneurship" },
];

const projectInterests = [
  { id: "web-development", label: "Web Development" },
  { id: "mobile-app", label: "Mobile App Development" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "data-science", label: "Data Science" },
  { id: "blockchain", label: "Blockchain" },
  { id: "iot", label: "Internet of Things" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "ui-ux", label: "UI/UX Design" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "content-creation", label: "Content Creation" },
  { id: "e-commerce", label: "E-Commerce" },
  { id: "saas", label: "SaaS Development" },
  { id: "research", label: "Research Projects" },
  { id: "social-impact", label: "Social Impact" },
  { id: "startup", label: "Startup" },
];

const Step3Preferences = ({ onNextStep, onPrevStep }: Step3PreferencesProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      networkingGoals: [],
      connectionPreferences: "",
      experienceLevel: "",
      locationPreference: "",
      interests: [],
      projectInterests: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // Prepare preferences data
      const preferencesData: PreferencesData = {
        networkingGoals: values.networkingGoals,
        connectionPreferences: values.connectionPreferences,
        experienceLevel: values.experienceLevel,
        locationPreference: values.locationPreference,
        interests: values.interests,
        projectInterests: values.projectInterests,
      };
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onNextStep(preferencesData);
    } catch (error) {
      console.error("Step 3 error:", error);
      toast.error("An error occurred while saving your preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">What are your networking goals?</h3>
            <FormField
              control={form.control}
              name="networkingGoals"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    {networkingGoals.map((goal) => (
                      <FormField
                        key={goal.id}
                        control={form.control}
                        name="networkingGoals"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={goal.id}
                              className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(goal.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, goal.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== goal.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {goal.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="connectionPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who would you like to connect with?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                      <SelectItem value="mentors">Mentors</SelectItem>
                      <SelectItem value="all">All types</SelectItem>
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
                  <FormLabel>Preferred experience level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 year)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                      <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      <SelectItem value="all">All levels</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="locationPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Location preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="local" />
                      </FormControl>
                      <FormLabel className="font-normal">Local connections (same city/area)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="state" />
                      </FormControl>
                      <FormLabel className="font-normal">State connections (same state)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="national" />
                      </FormControl>
                      <FormLabel className="font-normal">National connections (same country)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="global" />
                      </FormControl>
                      <FormLabel className="font-normal">Global connections (worldwide)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <MultiInterestSelect
                label="Professional Interests"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select your professional interests"
              />
            )}
          />
          
          <div>
            <h3 className="text-lg font-medium mb-4">What projects are you interested in?</h3>
            <FormField
              control={form.control}
              name="projectInterests"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    {projectInterests.map((interest) => (
                      <FormField
                        key={interest.id}
                        control={form.control}
                        name="projectInterests"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={interest.id}
                              className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, interest.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== interest.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {interest.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
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
                  <span className="mr-2">Saving preferences</span>
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

export default Step3Preferences;
