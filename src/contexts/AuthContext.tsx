
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetPasswordWithOTP: (mobile: string) => Promise<void>;
  signInWithOTP: (mobile: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fetchProfile = async (userId: string): Promise<any> => {
    try {
      console.log("Fetching profile for user:", userId);
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching from user_profiles:", error);
        throw error;
      }

      if (!data) {
        console.log("No profile found in user_profiles, trying profiles table");
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (result.error) {
          console.error("Error fetching profile from profiles table:", result.error);
          
          if (!result.data) {
            const userData = await supabase.auth.getUser();
            if (userData.data?.user) {
              const userTag = userData.data.user.user_metadata?.user_tag || `user_${Math.floor(Math.random() * 10000)}`;
              
              const newProfile = {
                id: userId,
                full_name: userData.data.user.user_metadata?.full_name || userData.data.user.email?.split('@')[0] || "User",
                email: userData.data.user.email,
                user_tag: userTag,
              };
              
              const { error: profileError } = await supabase.from('profiles').insert(newProfile);
              if (profileError) {
                console.error("Error creating profile in profiles table:", profileError);
                throw profileError;
              }
              
              const userProfileData = {
                ...newProfile,
                activity_score: 0,
                experience_level: '',
                interests: [] as string[],
                industry: '',
                course_year: '',
                user_type: '',
                image_url: '',
                profile_completeness: 20,
                skills: [],
                last_active: new Date().toISOString(),
              };
              
              const { error: userProfileError } = await supabase.from('user_profiles').insert(userProfileData);
              if (userProfileError) {
                console.error("Error creating profile in user_profiles table:", userProfileError);
                throw userProfileError;
              }
              
              data = newProfile;
            }
          } else {
            data = result.data;
          }
        } else if (result.data) {
          data = {
            id: result.data?.id,
            full_name: result.data?.full_name,
            email: result.data?.email,
            location: result.data?.location,
            bio: result.data?.bio,
            skills: result.data?.skills ? [result.data.skills] : [],
            user_tag: result.data?.user_tag || `user_${Math.floor(Math.random() * 10000)}`,
            activity_score: 0,
            experience_level: '',
            interests: [] as string[],
            created_at: result.data?.created_at,
            updated_at: result.data?.updated_at,
            industry: '',
            course_year: '',
            user_type: '',
            image_url: '',
            profile_completeness: 0,
            last_active: new Date().toISOString(),
            latitude: null,
            longitude: null,
            match_preferences: {},
            networking_goals: [] as string[],
            profile_photos: [] as string[],
            project_interests: [] as string[],
            university: '',
          };
        }
      }

      console.log("Profile data retrieved:", data);
      setProfile(data);
      setProfileLoaded(true);
      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setProfileLoaded(true);
      throw error;
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    let isActive = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        if (!isActive) return;
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log("User signed in or token refreshed");
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            try {
              const profileData = await fetchProfile(newSession.user.id);
              setProfile(profileData);
            } catch (error) {
              console.error("Error fetching profile after sign in:", error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          setSession(null);
          setProfile(null);
        } else if (event === 'USER_UPDATED') {
          console.log("User updated");
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            try {
              const profileData = await fetchProfile(newSession.user.id);
              setProfile(profileData);
            } catch (error) {
              console.error("Error fetching profile after user update:", error);
            }
          }
        }
      }
    );

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isActive) return;
        
        console.log("Initial session check:", session?.user?.id);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          try {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          } catch (error) {
            console.error("Error fetching initial profile:", error);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    getSession();

    const timeout = setTimeout(() => {
      if (isActive && isLoading) {
        console.log("Force ending loading state after timeout");
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      isActive = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (profileLoaded && isLoading) {
      setIsLoading(false);
    }
  }, [profileLoaded, isLoading]);

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const data = await fetchProfile(user.id);
      return data;
    } catch (error) {
      console.error("Error in refreshProfile:", error);
      toast.error("Failed to refresh profile data");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting signOut process in AuthContext");
      setIsLoading(true);
      
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Error signing out from Supabase:", error);
        toast.error(error.message);
        throw error;
      } else {
        console.log("Supabase signOut successful, clearing state");
        setUser(null);
        setSession(null);
        setProfile(null);
        
        window.location.href = "/login";
        return;
      }
    } catch (error) {
      console.error("Exception during sign out:", error);
      toast.error("An error occurred while signing out");
      setIsLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Error resetting password:", error);
        toast.error(error.message || "Error sending password reset email");
        throw error;
      }
      
      toast.success("Password reset instructions sent to your email");
      return;
    } catch (error) {
      console.error("Exception during password reset:", error);
      toast.error("An error occurred while processing your request");
      throw error;
    }
  };

  const resetPasswordWithOTP = async (mobile: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: mobile,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error) {
        console.error("Error sending OTP for password reset:", error);
        toast.error(error.message || "Error sending OTP");
        throw error;
      }
      
      toast.success("OTP sent to your mobile number");
      return;
    } catch (error) {
      console.error("Exception during OTP send:", error);
      toast.error("An error occurred while sending OTP");
      throw error;
    }
  };

  const signInWithOTP = async (mobile: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: mobile,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) {
        console.error("Error sending OTP for login:", error);
        toast.error(error.message || "Error sending OTP");
        throw error;
      }
      
      toast.success("OTP sent to your mobile number");
      return;
    } catch (error) {
      console.error("Exception during OTP send:", error);
      toast.error("An error occurred while sending OTP");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading,
      loading: isLoading,
      signOut,
      refreshProfile,
      resetPassword,
      resetPasswordWithOTP,
      signInWithOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Make sure to export AuthProvider as the default and as a named export
export default AuthProvider;
export { AuthProvider as AuthContextProvider };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
