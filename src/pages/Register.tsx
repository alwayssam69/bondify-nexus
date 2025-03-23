
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormGroup,
  FormSection,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import SocialLogin from "@/components/onboarding/SocialLogin";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, User, Briefcase, GraduationCap, Tag } from "lucide-react";
import { industryOptions, experienceLevels } from "@/data/formOptions";
import DynamicSkillSelect from "@/components/form/DynamicSkillSelect";
import LocationSelector from "@/components/form/LocationSelector";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  profession: z.string().min(1, "Please select your profession"),
  industry: z.string().min(1, "Please select your industry"),
  location: z.string().min(2, "Location is required"),
  skills: z.array(z.string()).min(1, "Please enter at least one skill"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  state: z.string().min(1, "Please select your state"),
  city: z.string().optional(),
  userTag: z.string().min(1, "Please enter a personal tag").max(20, "Tag must be 20 characters or less"),
  useCurrentLocation: z.boolean().default(false),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const professions = [
  "Professional", 
  "Student", 
  "Mentor", 
  "Founder", 
  "Investor", 
  "Freelancer", 
  "Collaborator",
  "Other"
];

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const geolocation = useGeolocation({ watch: false });
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profession: "",
      industry: "",
      location: "",
      skills: [],
      experienceLevel: "",
      state: "",
      city: "",
      userTag: "",
      useCurrentLocation: false,
      agreeTerms: false,
    },
  });

  // Watch the industry field to update skills
  const selectedIndustry = form.watch("industry");
  const useCurrentLocation = form.watch("useCurrentLocation");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("Creating user account with email:", values.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            user_tag: values.userTag,
          },
        },
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast.error(error.message || "Registration failed");
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        // Create user profile with additional information
        const locationData = values.useCurrentLocation && geolocation.latitude && geolocation.longitude 
          ? { latitude: geolocation.latitude, longitude: geolocation.longitude }
          : {};
        
        const profileData = {
          id: data.user.id,
          full_name: values.fullName,
          email: values.email,
          user_type: values.profession,
          industry: values.industry,
          location: values.location,
          state: values.state,
          city: values.city,
          skills: values.skills,
          experience_level: values.experienceLevel,
          user_tag: values.userTag,
          profile_completeness: 60, // Give higher score for more complete profile
          activity_score: 50, // Initial activity score
          ...locationData,
        };
        
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert(profileData);
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Continue despite error to ensure user creation completes
        }
        
        // Insert into profiles table for legacy support
        const { error: legacyProfileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: values.fullName,
            email: values.email,
            location: values.location || null,
            user_tag: values.userTag,
          });
          
        if (legacyProfileError) {
          console.error("Error creating legacy profile:", legacyProfileError);
        }
        
        toast.success("Registration successful! Please check your email to verify your account.");
        
        // Login automatically after successful registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (signInError) {
          console.error("Error signing in after registration:", signInError);
          navigate("/login", { state: { email: values.email } });
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout className="pt-16 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card-glass rounded-xl p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-6">
            Join our professional networking platform to connect with like-minded professionals
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormSection title="Account Information">
                <FormGroup>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="John Doe" type="text" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Create a password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm your password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormGroup>
                
                <FormField
                  control={form.control}
                  name="userTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Tag</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Your unique tag (e.g. CodeWhiz)" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
              
              <FormSection title="Professional Profile">
                <FormGroup>
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your profession" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {professions.map((profession) => (
                              <SelectItem key={profession} value={profession.toLowerCase()}>
                                {profession}
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
                </FormGroup>
                
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
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
              </FormSection>
              
              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{" "}
                        <Button variant="link" className="h-auto p-0" 
                          onClick={(e) => { e.preventDefault(); navigate("/terms"); }}>
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="h-auto p-0"
                          onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>
                          Privacy Policy
                        </Button>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          
          <Separator className="my-6" />
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Or sign up with</p>
            <SocialLogin />
            
            <p className="text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
