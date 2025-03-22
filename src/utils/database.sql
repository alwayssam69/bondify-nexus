
-- This file contains the SQL statements needed to set up the database for the messaging system
-- Run these statements in your Supabase SQL editor

-- Create a messages table to store chat messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  
  CONSTRAINT messages_not_to_self CHECK (sender_id <> recipient_id)
);

-- Add RLS policies to the messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages that they sent or received
CREATE POLICY "Users can read their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can insert messages if they are the sender
CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Users can mark messages as read if they are the recipient
CREATE POLICY "Users can mark received messages as read" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- Create a profile_views table to track who viewed a profile
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id),
  viewer_id UUID NOT NULL REFERENCES auth.users(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_notified BOOLEAN DEFAULT false,
  
  CONSTRAINT profile_views_not_self CHECK (profile_id <> viewer_id)
);

-- Add RLS policies to the profile_views table
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Users can see who viewed their profile
CREATE POLICY "Users can see who viewed their profile" 
  ON public.profile_views 
  FOR SELECT 
  USING (auth.uid() = profile_id);

-- Users can record profile views
CREATE POLICY "Users can record profile views" 
  ON public.profile_views 
  FOR INSERT 
  WITH CHECK (auth.uid() = viewer_id);

-- Enable Supabase Realtime for messages table to support real-time updates
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable Supabase Realtime for profile_views table
ALTER TABLE public.profile_views REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_views;

-- Add last viewed timestamp to user_matches
ALTER TABLE public.user_matches 
ADD COLUMN IF NOT EXISTS last_viewed TIMESTAMP WITH TIME ZONE;

-- Make sure user_matches table has realtime enabled
ALTER TABLE public.user_matches REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_matches;

-- Create tables for Anonymous Industry Q&A feature
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  industry TEXT NOT NULL,
  content TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id),
  expert_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add expert_verified column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS expert_verified BOOLEAN DEFAULT false;

-- Add industry column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Enable RLS on questions and answers
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- RLS policies for questions
CREATE POLICY "Anyone can read questions" 
  ON public.questions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create questions" 
  ON public.questions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for answers
CREATE POLICY "Anyone can read answers" 
  ON public.answers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Experts can create answers" 
  ON public.answers 
  FOR INSERT 
  WITH CHECK (auth.uid() = expert_id);

-- Create table for AI-Driven Industry Insights feature
CREATE TABLE IF NOT EXISTS public.news_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT NOT NULL,
  image_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for news likes and comments
CREATE TABLE IF NOT EXISTS public.news_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news_feed(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  liked BOOLEAN DEFAULT false,
  comment TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on news tables
ALTER TABLE public.news_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for news_feed
CREATE POLICY "Anyone can read news" 
  ON public.news_feed 
  FOR SELECT 
  USING (true);

-- RLS policies for news_interactions
CREATE POLICY "Anyone can read news interactions" 
  ON public.news_interactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create interactions" 
  ON public.news_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their interactions" 
  ON public.news_interactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable Supabase Realtime for new tables
ALTER TABLE public.questions REPLICA IDENTITY FULL;
ALTER TABLE public.answers REPLICA IDENTITY FULL;
ALTER TABLE public.news_feed REPLICA IDENTITY FULL;
ALTER TABLE public.news_interactions REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_interactions;
