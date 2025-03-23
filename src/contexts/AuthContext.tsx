
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
          // Create a basic profile if none exists
          if (!result.data) {
            const userData = await supabase.auth.getUser();
            if (userData.data?.user) {
              const userTag = userData.data.user.user_metadata?.user_tag || `user_${Math.floor(Math.random() * 10000)}`;
              
              const newProfile = {
                id: userId,
                full_name: userData.data.user.user_metadata?.full_name || "User",
                email: userData.data.user.email,
                user_tag: userTag,
              };
              
              // Insert basic profile
              const { error: profileError } = await supabase.from('profiles').insert(newProfile);
              if (profileError) {
                console.error("Error creating profile in profiles table:", profileError);
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
              }
              
              data = newProfile;
            }
          } else {
            data = result.data;
          }
        } else if (result.data) {
          // Convert old profile structure to match new structure's expected fields
          data = {
            id: result.data?.id,
            full_name: result.data?.full_name,
            email: result.data?.email,
            location: result.data?.location,
            bio: result.data?.bio,
            skills: result.data?.skills ? [result.data.skills] : [],
            user_tag: result.data?.user_tag || `user_${Math.floor(Math.random() * 10000)}`,
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
    let isActive = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (!isActive) return;
        
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
      if (!isActive) return;
      
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
      isActive = false;
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
      console.log("Starting signOut process in AuthContext");
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out from Supabase:", error);
        toast.error(error.message);
        throw error;
      } else {
        console.log("Supabase signOut successful, clearing state");
        setUser(null);
        setSession(null);
        setProfile(null);
        setIsLoading(false);
        
        // Use window.location for a complete refresh after sign out
        window.location.href = "/login";
        return; // Return successfully
      }
    } catch (error) {
      console.error("Exception during sign out:", error);
      toast.error("An error occurred while signing out");
      setIsLoading(false);
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
