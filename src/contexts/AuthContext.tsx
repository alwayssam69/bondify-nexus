
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First try to get from user_profiles table (new structure)
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        console.log("Trying fallback profile fetch from profiles table");
        // Fall back to profiles table (old structure) if needed
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (result.error) {
          console.error("Error fetching profile:", result.error);
          return;
        }
        
        // Convert old profile structure to match new structure's expected fields
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
          latitude: null,  // Add missing latitude property
          longitude: null, // Add missing longitude property
          // Set defaults for missing properties
          match_preferences: {},
          networking_goals: [] as string[],
          profile_photos: [] as string[],
          project_interests: [] as string[],
          university: '',
        };
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged out successfully");
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("An error occurred while signing out");
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
