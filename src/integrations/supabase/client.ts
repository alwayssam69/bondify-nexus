// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmftcwudxboyxahseqfx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZnRjd3VkeGJveXhhaHNlcWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjU1MTgsImV4cCI6MjA1NzQwMTUxOH0.s_qwaVYjTlCOpNuzJBde95VOIdiCDNwKJ3VrFKa8-Rw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);