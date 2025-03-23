
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      // First try to get from user_profiles table (new structure)
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching from user_profiles:", error);
      }

      if (!data) {
        console.log("No profile found in user_profiles, trying profiles table");
        // Fall back to profiles table (old structure) if needed
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (result.error) {
          console.error("Error fetching profile from profiles table:", result.error);
          return;
        }
        
        // Convert old profile structure to match new structure's expected fields
        if (result.data) {
          data = {
            id: result.data?.id,
            full_name: result.data?.full_name,
            email: result.data?.email,
            location: result.data?.location,
            bio: result.data?.bio,
            skills: result.data?.skills ? [result.data.skills] : [],
            // Set defaults for required fields in the new structure
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
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      setProfileLoaded(true); // Set to true even on error to stop loading state
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setProfileLoaded(true);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfileLoaded(true);
      }
      
      // Set loading to false only after profile is loaded or if there's no user
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Extra effect to ensure we're not stuck in loading state
  useEffect(() => {
    // If it's taking too long, stop the loading state after 5 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Force ending loading state after timeout");
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Update loading state when profile is loaded
  useEffect(() => {
    if (profileLoaded && isLoading) {
      setIsLoading(false);
    }
  }, [profileLoaded, isLoading]);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error(error.message);
        throw error;
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("An error occurred while signing out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
