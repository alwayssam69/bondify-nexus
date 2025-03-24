
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmftcwudxboyxahseqfx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZnRjd3VkeGJveXhhaHNlcWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjU1MTgsImV4cCI6MjA1NzQwMTUxOH0.s_qwaVYjTlCOpNuzJBde95VOIdiCDNwKJ3VrFKa8-Rw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Define extended types to account for user_notifications table
// This allows us to work with tables not yet in the generated types
// without modifying the read-only types.ts file
type ExtendedDatabase = Database & {
  public: {
    Tables: Database['public']['Tables'] & {
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          created_at: string;
          is_read: boolean;
          related_id?: string;
        }
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: string;
          created_at?: string;
          is_read?: boolean;
          related_id?: string;
        }
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          type?: string;
          created_at?: string;
          is_read?: boolean;
          related_id?: string;
        }
      }
    }
  }
}

// Create client with extended type support and explicit auth configuration
export const supabase = createClient<ExtendedDatabase>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
      detectSessionInUrl: true,
      flowType: 'implicit',
    }
  }
);
