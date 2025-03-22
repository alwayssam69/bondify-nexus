
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
import { Mail } from "lucide-react";
import SocialLogin from "./SocialLogin";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step1EmailProps {
  onNextStep: (email: string) => void;
}

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const Step1Email = ({ onNextStep }: Step1EmailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', values.email)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing user:", checkError);
      }
      
      if (existingUser) {
        toast.info("Welcome back! Redirecting to login...");
        // Redirect to login with email prefilled
        window.location.href = `/login?email=${encodeURIComponent(values.email)}`;
        return;
      }
      
      // Simulate validating
      setIsValidating(true);
      
      // Simulate typing "verifying email..." animation
      await simulateTyping("Verifying email", 1500);
      
      onNextStep(values.email);
    } catch (error) {
      console.error("Step 1 error:", error);
      toast.error("An error occurred. Please try again.");
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

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Welcome</h2>
        <p className="text-muted-foreground mt-2">
          Let's create your account to start connecting with professionals
        </p>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <SocialLogin />
        
        <div className="relative w-full my-6">
          <Separator className="my-4" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>
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
            {isLoading ? "Please wait..." : "Continue"}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
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
