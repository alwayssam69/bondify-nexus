
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import SocialLogin from "@/components/onboarding/SocialLogin";
import ThemeToggle from "@/components/onboarding/ThemeToggle";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Extract email from query params if redirected from onboarding
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get('email') || '';
  
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
      email: emailFromQuery,
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log("Login attempt with email:", values.email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        console.log("Login successful for user:", data.user.id);
        toast.success("Login successful!");
        
        // Wait a moment to ensure auth state is properly updated
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        console.error("No user returned after successful login");
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout className="pt-28 pb-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="card-glass rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
            <ThemeToggle />
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="john.doe@example.com" type="email" className="pl-10" {...field} />
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
                        <Input placeholder="Enter your password" type="password" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs" 
                      onClick={async (e) => {
                        e.preventDefault();
                        const email = form.getValues().email;
                        if (!email) {
                          toast.error("Please enter your email first");
                          return;
                        }
                        
                        try {
                          const { error } = await supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: `${window.location.origin}/reset-password`,
                          });
                          
                          if (error) {
                            toast.error(error.message);
                          } else {
                            toast.success("Password reset link sent to your email");
                          }
                        } catch (error) {
                          console.error("Reset password error:", error);
                          toast.error("An error occurred while sending reset link");
                        }
                      }}
                    >
                      Forgot password?
                    </Button>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <motion.div className="flex items-center">
                    <span className="mr-2">Signing in</span>
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
                  "Sign In with Email"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative w-full my-6">
            <Separator className="my-4" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>
          
          <SocialLogin />
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/onboarding")}>
                Create Account
              </Button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
