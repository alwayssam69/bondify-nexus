
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

-- Example: How to insert a new notification
/*
INSERT INTO public.user_notifications (user_id, type, message)
VALUES 
('user-uuid-here', 'match', 'You have a new match with Jane Doe'),
('user-uuid-here', 'message', 'You received a new message from John Smith'),
('user-uuid-here', 'view', 'Someone viewed your profile');
*/

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;
