
-- This is a helper SQL file that you can run in the Supabase SQL Editor
-- to create the user_notifications table for real notifications

-- Create the user_notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('match', 'message', 'view')),
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    related_entity_id UUID, -- Optional reference to another entity (match, message, etc.)
    metadata JSONB DEFAULT '{}'::jsonb -- For additional data that may be needed
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON public.user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON public.user_notifications(created_at);

-- Set up RLS (Row Level Security)
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" 
ON public.user_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.user_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to get notifications
CREATE OR REPLACE FUNCTION public.get_notifications(user_id UUID)
RETURNS SETOF public.user_notifications
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.user_notifications
  WHERE user_id = get_notifications.user_id
  ORDER BY created_at DESC
  LIMIT 5;
$$;

-- Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(user_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.user_notifications
  SET is_read = true
  WHERE user_id = mark_all_notifications_read.user_id;
$$;

-- Create function to create a new notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_message TEXT,
  p_related_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.user_notifications (
    user_id,
    type,
    message,
    related_entity_id,
    metadata,
    created_at
  )
  VALUES (
    p_user_id,
    p_type,
    p_message,
    p_related_entity_id,
    p_metadata,
    now()
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;

-- Example: How to insert a new notification
/*
SELECT create_notification(
  'user-uuid-here',
  'match',
  'You have a new match with Jane Doe',
  NULL,
  '{"matchId": "match-uuid-here"}'::jsonb
);
*/
