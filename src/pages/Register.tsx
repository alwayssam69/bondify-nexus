
import React, { useState } from "react";
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
  FormDescription,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 18, {
    message: "You must be at least 18 years old",
  }),
  gender: z.string().min(1, "Please select your gender"),
  location: z.string().min(1, "Please enter your location"),
  locationPreference: z.string().optional(),
  remoteNetworking: z.boolean().optional(),
  relationshipGoal: z.string().min(1, "Please select your relationship goal"),
  interests: z.string().min(1, "Please enter at least one interest"),
  userType: z.string().min(1, "Please select who you are"),
  industry: z.string().min(1, "Please select your industry"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  networkingGoals: z.string().min(1, "Please select at least one networking goal"),
  skills: z.string().min(1, "Please enter at least one skill"),
  availability: z.string().min(1, "Please select your availability"),
  communicationPreference: z.string().min(1, "Please select your communication style"),
});

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: "",
      gender: "",
      location: "",
      locationPreference: "local",
      remoteNetworking: true,
      relationshipGoal: "",
      interests: "",
      userType: "",
      industry: "",
      experienceLevel: "",
      networkingGoals: "",
      skills: "",
      availability: "",
      communicationPreference: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you'd send this data to your backend
    console.log(values);
    toast.success("Registration successful! Redirecting to dashboard...");
    
    // Simulate a delay before redirect
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const nextStep = async () => {
    if (step === 1) {
      const nameValid = await form.trigger("name");
      const emailValid = await form.trigger("email");
      const passwordValid = await form.trigger("password");
      
      if (nameValid && emailValid && passwordValid) {
        setStep(step + 1);
      }
    } else if (step === 2) {
      const ageValid = await form.trigger("age");
      const genderValid = await form.trigger("gender");
      const locationValid = await form.trigger("location");
      const goalValid = await form.trigger("relationshipGoal");
      
      if (ageValid && genderValid && locationValid && goalValid) {
        setStep(step + 1);
      }
    } else if (step === 3) {
      const userTypeValid = await form.trigger("userType");
      const industryValid = await form.trigger("industry");
      const expLevelValid = await form.trigger("experienceLevel");
      const networkingGoalsValid = await form.trigger("networkingGoals");
      
      if (userTypeValid && industryValid && expLevelValid && networkingGoalsValid) {
        setStep(step + 1);
      }
    } else if (step === 4) {
      const skillsValid = await form.trigger("skills");
      const availabilityValid = await form.trigger("availability");
      const communicationValid = await form.trigger("communicationPreference");
      const interestsValid = await form.trigger("interests");
      
      if (skillsValid && availabilityValid && communicationValid && interestsValid) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Layout className="pt-28 pb-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="card-glass rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground mb-6">
            Join our community and find your perfect professional network
          </p>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 rounded-full flex-1 mx-1 ${
                    index + 1 <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Step {step} of {totalSteps}: {
                step === 1 ? "Basic Information" : 
                step === 2 ? "Personal Details" : 
                step === 3 ? "Professional Profile" :
                "Skills & Preferences"
              }
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Create a secure password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 25" type="number" min="18" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locationPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "local"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose location preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="local">Local (Same City)</SelectItem>
                            <SelectItem value="regional">Regional (Same Country)</SelectItem>
                            <SelectItem value="global">Global (Worldwide)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="remoteNetworking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Open to Remote Networking</FormLabel>
                          <FormDescription>
                            I'm open to virtual meetings and remote collaboration
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="relationshipGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="What are you looking for?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="networking">Professional Networking</SelectItem>
                            <SelectItem value="mentoring">Mentorship</SelectItem>
                            <SelectItem value="collaboration">Project Collaboration</SelectItem>
                            <SelectItem value="hiring">Hiring/Recruitment</SelectItem>
                            <SelectItem value="job-seeking">Job Seeking</SelectItem>
                            <SelectItem value="investing">Investment Opportunities</SelectItem>
                            <SelectItem value="friendship">Industry Friendships</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {step === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who You Are</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your professional identity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="founder">Startup Founder</SelectItem>
                            <SelectItem value="entrepreneur">Aspiring Entrepreneur</SelectItem>
                            <SelectItem value="professional">Working Professional</SelectItem>
                            <SelectItem value="student">Student/Recent Graduate</SelectItem>
                            <SelectItem value="job-seeker">Job Seeker</SelectItem>
                            <SelectItem value="mentor">Mentor/Expert</SelectItem>
                            <SelectItem value="collaborator">Collaborator</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
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
                        <FormLabel>Industry & Domain</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology & IT</SelectItem>
                            <SelectItem value="finance">Finance & Investment</SelectItem>
                            <SelectItem value="marketing">Marketing & Sales</SelectItem>
                            <SelectItem value="design">Design & Creativity</SelectItem>
                            <SelectItem value="business">Business & Consulting</SelectItem>
                            <SelectItem value="healthcare">Healthcare & Science</SelectItem>
                            <SelectItem value="legal">Legal & Compliance</SelectItem>
                            <SelectItem value="education">Education & Research</SelectItem>
                            <SelectItem value="sustainability">Sustainability & Environment</SelectItem>
                            <SelectItem value="arts">Arts & Entertainment</SelectItem>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                            <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                            <SelectItem value="advanced">Advanced (6-10 years)</SelectItem>
                            <SelectItem value="expert">Expert (10+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="networkingGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Networking Goals</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="What are your networking objectives?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="finding mentors">Looking for mentors</SelectItem>
                            <SelectItem value="finding professionals">Finding like-minded professionals</SelectItem>
                            <SelectItem value="finding co-founders">Seeking startup co-founders</SelectItem>
                            <SelectItem value="learning from experts">Learning from industry experts</SelectItem>
                            <SelectItem value="finding opportunities">Finding job & internship opportunities</SelectItem>
                            <SelectItem value="collaborating on projects">Collaborating on projects</SelectItem>
                            <SelectItem value="seeking investment">Seeking investment for my startup</SelectItem>
                            <SelectItem value="finding startups to invest">Finding startups to invest in</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your primary goal. You can add more in your profile later.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {step === 4 && (
                <>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills & Expertise</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. JavaScript, Marketing, Leadership" {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate with commas. These help with better matching.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests & Hobbies</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Photography, Travel, Hiking" {...field} />
                        </FormControl>
                        <FormDescription>
                          Personal interests help with casual connections.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="When are you available to connect?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekdays">Weekdays</SelectItem>
                            <SelectItem value="evenings">Evenings</SelectItem>
                            <SelectItem value="weekends">Weekends</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                            <SelectItem value="by appointment">By Appointment Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="communicationPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How do you prefer to communicate?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual chat">Casual Chat</SelectItem>
                            <SelectItem value="in-depth discussions">In-Depth Discussions</SelectItem>
                            <SelectItem value="video calls">Video Calls</SelectItem>
                            <SelectItem value="mixed">Mixed (Flexible)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Alert>
                    <AlertDescription>
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </AlertDescription>
                  </Alert>
                </>
              )}
              
              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                <Button type="button" onClick={nextStep}>
                  {step === totalSteps ? "Create Account" : "Next"}
                </Button>
              </div>
            </form>
          </Form>
          
          <Separator className="my-6" />
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
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
