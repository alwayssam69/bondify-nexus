
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import SocialLogin from "./SocialLogin";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step1EmailProps {
  onNextStep: (email: string, password: string) => void;
}

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Step1Email = ({ onNextStep }: Step1EmailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      console.log("Registering with email:", values.email);
      
      // Check if user exists first
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email);
      
      if (checkError) {
        console.error("Error checking existing user:", checkError);
        toast.error("Error checking if user exists, please try again");
        setIsLoading(false);
        return;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        toast.info("Welcome back! Redirecting to login...");
        // Redirect to login with email prefilled
        window.location.href = `/login?email=${encodeURIComponent(values.email)}`;
        return;
      }
      
      // Simulate validating
      setIsValidating(true);
      
      // Simulate typing "verifying email..." animation
      await simulateTyping("Verifying email", 800);
      
      onNextStep(values.email, values.password);
    } catch (error: any) {
      console.error("Step 1 error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  const simulateTyping = async (text: string, duration: number) => {
    return new Promise<void>((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i > 3) {
          clearInterval(interval);
          resolve();
        }
      }, duration / 4);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Welcome</h2>
        <p className="text-muted-foreground mt-2">
          Let's create your account to start connecting with professionals
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter your email" 
                      className="pl-10" 
                      {...field} 
                      disabled={isLoading || isValidating}
                    />
                  </div>
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password" 
                      className="pl-10" 
                      {...field} 
                      disabled={isLoading || isValidating}
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      }
                    </Button>
                  </div>
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password" 
                      className="pl-10" 
                      {...field} 
                      disabled={isLoading || isValidating}
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      }
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isValidating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground flex items-center"
            >
              <div className="mr-2 h-3 w-3 rounded-full bg-primary animate-pulse"></div>
              <span>Verifying email...</span>
            </motion.div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isValidating}
          >
            {isLoading ? "Please wait..." : "Continue with Email"}
          </Button>
          
          <div className="relative w-full my-6">
            <Separator className="my-4" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>
          
          <SocialLogin />
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium" 
              onClick={() => window.location.href = "/login"}
            >
              Sign in
            </Button>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default Step1Email;
