
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  location?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  avatar_url?: string;
  latitude?: number;
  longitude?: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  updateUsername: (username: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use navigate safely with a try/catch
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    // If useNavigate fails, provide a no-op function
    navigate = (path: string) => {
      console.warn('Navigation attempted outside router context to:', path);
      // Could use window.location as fallback if needed
      // window.location.href = path;
    };
  }

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Exception in fetchProfile:', error);
      return null;
    }
  };

  // Update the user's profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProfile = data as UserProfile;
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + error.message);
      throw error;
    }
  };

  // Special function to update username (can only be done once)
  const updateUsername = async (username: string): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');

    try {
      // First check if the username is already taken
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .maybeSingle();

      if (existingUser) {
        toast.error('Username already taken');
        return false;
      }

      // Check if user can change username
      const { data: canChange, error: checkError } = await supabase
        .rpc('can_change_username', { user_id: user.id });

      if (checkError) throw checkError;
      
      if (!canChange) {
        toast.error('You can only change your username once');
        return false;
      }

      // Update username and set the changed timestamp
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          username, 
          username_changed_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      toast.success('Username updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username: ' + error.message);
      return false;
    }
  };

  // Refresh the user's profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await fetchProfile(user.id);
      if (profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // The session will be updated via the auth state listener
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email, password and full name
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast.success('Signed up successfully! Please check your email for confirmation.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up auth state listener and initialize session
  useEffect(() => {
    setIsLoading(true);
    
    // Set up the auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Update session and user
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we have a user, fetch their profile
        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          const userProfile = await fetchProfile(initialSession.user.id);
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updateUsername,
        refreshProfile,
      }}
    >
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

export default AuthProvider;
