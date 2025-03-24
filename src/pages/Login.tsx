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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, Phone, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import SocialLogin from "@/components/onboarding/SocialLogin";
import ThemeToggle from "@/components/onboarding/ThemeToggle";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";

const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const mobileFormSchema = z.object({
  mobile: z.string().min(10, "Please enter a valid mobile number"),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, "Please enter the complete OTP"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const forgotPasswordMobileSchema = z.object({
  mobile: z.string().min(10, "Please enter a valid mobile number"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("email");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordMethod, setForgotPasswordMethod] = useState<string>("email");
  const { signInWithOTP, resetPassword, resetPasswordWithOTP } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get('email') || '';
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: emailFromQuery,
      password: "",
    },
  });

  const mobileForm = useForm<z.infer<typeof mobileFormSchema>>({
    resolver: zodResolver(mobileFormSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: emailFromQuery,
    },
  });

  const forgotPasswordMobileForm = useForm<z.infer<typeof forgotPasswordMobileSchema>>({
    resolver: zodResolver(forgotPasswordMobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const onEmailLogin = async (values: z.infer<typeof emailFormSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log("Login attempt with email:", values.email);
    
    try {
      const loginPromise = supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Login timeout - server not responding")), 30000);
      });
      
      const { data, error } = await Promise.race([
        loginPromise,
        timeoutPromise
      ]) as any;
      
      if (error) {
        console.error("Login error:", error.message);
        
        let errorMessage = "Login failed. Please try again.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Incorrect email or password. Please try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email before logging in.";
        } else if (error.message.includes("rate limit")) {
          errorMessage = "Too many login attempts. Please try again later.";
        }
        
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (data?.user) {
        console.log("Login successful for user:", data.user.id);
        toast.success("Login successful!");
        
        localStorage.removeItem("supabase.auth.token");
        
        window.location.href = "/dashboard";
      } else {
        console.error("No user returned after successful login");
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const onMobileLogin = async (values: z.infer<typeof mobileFormSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await signInWithOTP(values.mobile);
      setOtpSent(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onVerifyOTP = async (values: z.infer<typeof otpFormSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const mobile = mobileForm.getValues().mobile;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: mobile,
        token: values.otp,
        type: 'sms',
      });
      
      if (error) {
        console.error("OTP verification error:", error);
        toast.error(error.message || "Invalid OTP. Please try again.");
        setIsLoading(false);
        return;
      }
      
      if (data?.user) {
        console.log("OTP verification successful for user:", data.user.id);
        toast.success("Login successful!");
        
        window.location.href = "/dashboard";
      } else {
        toast.error("Verification failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Unexpected OTP verification error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const onForgotPasswordEmail = async (values: z.infer<typeof forgotPasswordSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message || "Failed to send reset instructions. Please try again.");
      } else {
        toast.success("Password reset instructions sent to your email!");
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Unexpected password reset error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const onForgotPasswordMobile = async (values: z.infer<typeof forgotPasswordMobileSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await resetPasswordWithOTP(values.mobile);
      setIsLoading(false);
      setOtpSent(true);
    } catch (error) {
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
          
          {showForgotPassword ? (
            <>
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  className="p-0 -ml-2"
                  onClick={() => setShowForgotPassword(false)}
                >
                  ← Back to Login
                </Button>
                <h2 className="text-xl font-semibold mt-2">Reset Your Password</h2>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to reset your password
                </p>
              </div>
              
              <Tabs defaultValue="email" onValueChange={setForgotPasswordMethod}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="email">Via Email</TabsTrigger>
                  <TabsTrigger value="mobile">Via Mobile</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <Form {...forgotPasswordForm}>
                    <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordEmail)} className="space-y-6">
                      <FormField
                        control={forgotPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Your registered email" type="email" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending reset instructions..." : "Send Reset Instructions"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="mobile">
                  {!otpSent ? (
                    <Form {...forgotPasswordMobileForm}>
                      <form onSubmit={forgotPasswordMobileForm.handleSubmit(onForgotPasswordMobile)} className="space-y-6">
                        <FormField
                          control={forgotPasswordMobileForm.control}
                          name="mobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Your registered mobile number" type="tel" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <Form {...otpForm}>
                      <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} className="space-y-6">
                        <FormField
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter OTP</FormLabel>
                              <FormControl>
                                <div className="flex justify-center py-4">
                                  <InputOTP maxLength={6} onChange={field.onChange}>
                                    <InputOTPGroup>
                                      <InputOTPSlot index={0} />
                                      <InputOTPSlot index={1} />
                                      <InputOTPSlot index={2} />
                                      <InputOTPSlot index={3} />
                                      <InputOTPSlot index={4} />
                                      <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                              </FormControl>
                              <FormMessage />
                              <div className="text-center text-sm mt-4">
                                <Button 
                                  variant="link" 
                                  className="p-0" 
                                  type="button"
                                  onClick={() => {
                                    setOtpSent(false);
                                    otpForm.reset();
                                  }}
                                >
                                  Use a different number
                                </Button>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Verifying..." : "Verify & Reset Password"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Tabs defaultValue="email" value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="email">Email Login</TabsTrigger>
                <TabsTrigger value="mobile">Mobile Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailLogin)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
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
                      control={emailForm.control}
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
                            onClick={(e) => {
                              e.preventDefault();
                              setShowForgotPassword(true);
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
              </TabsContent>
              
              <TabsContent value="mobile">
                {!otpSent ? (
                  <Form {...mobileForm}>
                    <form onSubmit={mobileForm.handleSubmit(onMobileLogin)} className="space-y-6">
                      <FormField
                        control={mobileForm.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter your mobile number" type="tel" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-xs" 
                              onClick={(e) => {
                                e.preventDefault();
                                setShowForgotPassword(true);
                                setForgotPasswordMethod("mobile");
                              }}
                            >
                              Forgot password?
                            </Button>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Get OTP"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} className="space-y-6">
                      <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enter OTP</FormLabel>
                            <FormControl>
                              <div className="flex justify-center py-4">
                                <InputOTP maxLength={6} onChange={field.onChange}>
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                            </FormControl>
                            <FormMessage />
                            <div className="text-center text-sm mt-4">
                              <Button 
                                variant="link" 
                                className="p-0" 
                                type="button"
                                onClick={() => {
                                  setOtpSent(false);
                                  otpForm.reset();
                                }}
                              >
                                Use a different number
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify & Login"}
                      </Button>
                    </form>
                  </Form>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {!showForgotPassword && (
            <>
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
