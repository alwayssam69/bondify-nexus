
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
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
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
  relationshipGoal: z.string().min(1, "Please select your relationship goal"),
  interests: z.string().min(1, "Please enter at least one interest"),
  dailyRoutine: z.string().min(1, "Please select your daily routine"),
  communicationStyle: z.string().min(1, "Please select your communication style"),
});

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: "",
      gender: "",
      location: "",
      relationshipGoal: "",
      interests: "",
      dailyRoutine: "",
      communicationStyle: "",
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
    } else if (step === totalSteps) {
      form.handleSubmit(onSubmit)();
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
            Join our community and find your perfect match
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
                "Preferences & Interests"
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
                    name="relationshipGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="What are you looking for?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual">Casual Dating</SelectItem>
                            <SelectItem value="serious">Serious Relationship</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="friendship">Friendship</SelectItem>
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
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests & Hobbies</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Photography, Travel, Hiking" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dailyRoutine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Routine</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Are you a morning or night person?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning Person</SelectItem>
                            <SelectItem value="night">Night Person</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="communicationStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How do you prefer to communicate?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
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
