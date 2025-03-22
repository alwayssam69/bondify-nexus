
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
import { MapPin, User, Briefcase, GraduationCap } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  profession: z.string().min(1, "Please select your profession"),
  industry: z.string().min(1, "Please select your industry"),
  location: z.string().min(2, "Location is required"),
  skills: z.string().min(1, "Please enter at least one skill"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  shareLocation: z.boolean().default(false),
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

const industries = [
  "Technology", 
  "Finance", 
  "Healthcare", 
  "Education", 
  "Marketing",
  "Design",
  "Engineering",
  "Legal",
  "Entertainment",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Real Estate",
  "Nonprofit",
  "Other"
];

const experienceLevels = [
  "Beginner",
  "Intermediate",
  "Expert"
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
      skills: "",
      experienceLevel: "",
      shareLocation: false,
      agreeTerms: false,
    },
  });

  // If geolocation is available, pre-fill location
  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude && !geolocation.error) {
      // Use reverse geocoding to get location name
      const getLocationName = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${geolocation.latitude}&lon=${geolocation.longitude}&zoom=10`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || '';
            const country = data.address.country || '';
            
            let locationString = '';
            if (city) locationString += city;
            if (state && state !== city) locationString += locationString ? `, ${state}` : state;
            if (country) locationString += locationString ? `, ${country}` : country;
            
            if (locationString && !form.getValues('location')) {
              form.setValue('location', locationString);
            }
          }
        } catch (error) {
          console.error("Error getting location name:", error);
        }
      };
      
      getLocationName();
    }
  }, [geolocation.latitude, geolocation.longitude, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });
      
      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        // Create user profile with additional information
        const skillsArray = values.skills.split(',').map(skill => skill.trim());
        
        const profileData = {
          full_name: values.fullName,
          user_type: values.profession,
          industry: values.industry,
          location: values.location,
          skills: skillsArray,
          experience_level: values.experienceLevel.toLowerCase(),
          profile_completeness: 60, // Give higher score for more complete profile
          activity_score: 50, // Initial activity score
        };
        
        // Add location coordinates if permission granted
        if (values.shareLocation && geolocation.latitude && geolocation.longitude) {
          Object.assign(profileData, {
            latitude: geolocation.latitude,
            longitude: geolocation.longitude,
          });
        }
        
        // Update user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', data.user.id);
        
        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
        
        toast.success("Registration successful! Please check your email to verify your account.");
        navigate("/login");
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
              </FormSection>
              
              <FormSection title="Professional Profile">
                <FormGroup>
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry.toLowerCase()}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="City, Country" className="pl-10" {...field} />
                          </div>
                        </FormControl>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level} value={level.toLowerCase()}>
                                {level}
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
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. JavaScript, React, Project Management (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>
              
              <FormField
                control={form.control}
                name="shareLocation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Share my location</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable location-based matching to find professionals near you
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
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
