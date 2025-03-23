
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const SocialLogin = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showSetupInfo, setShowSetupInfo] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) {
        console.error("Google login error:", error);
        if (error.message.includes("provider is not enabled")) {
          toast.error("Google login is not properly configured in Supabase");
          setShowSetupInfo(true);
        } else {
          toast.error(`Login failed: ${error.message}`);
        }
      } else {
        toast.success("Redirecting to Google login...");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(`An error occurred during Google login: ${error.message}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    toast.info("Phone login will be available soon!");
    // Implementation for phone login would go here
  };

  return (
    <div className="space-y-4">
      {showSetupInfo && (
        <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200 mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Please configure Google OAuth provider in your Supabase dashboard under 
            Authentication &gt; Providers. You'll need to set up OAuth credentials in the Google 
            developer platform and add them to Supabase.
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isGoogleLoading ? "Connecting..." : "Continue with Google"}
      </Button>
      
      <Button
        variant="outline"
        type="button"
        onClick={handlePhoneLogin}
        className="w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" 
            stroke="#000000" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 18H12.01" 
            stroke="#000000" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Continue with Phone
      </Button>
    </div>
  );
};

export default SocialLogin;
