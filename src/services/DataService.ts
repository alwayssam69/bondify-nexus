
import { supabase } from "@/integrations/supabase/client";
import { RecentMatch } from "@/types/chat";

/**
 * Fetch user notifications from Supabase
 */
export const fetchUserNotifications = async (userId: string) => {
  try {
    // Query notifications table for this user
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    // If no data yet, return mock data
    if (!data || data.length === 0) {
      return getMockNotifications();
    }

    // Transform the data to match our frontend format
    return data.map(notification => ({
      id: notification.id,
      type: notification.type,
      message: notification.message,
      time: formatTimeAgo(notification.created_at)
    }));
  } catch (error) {
    console.error("Error in fetchUserNotifications:", error);
    return getMockNotifications();
  }
};

/**
 * Fetch user messages from Supabase
 */
export const fetchUserMessages = async (userId: string) => {
  try {
    // Query chat_messages table to get latest message from each conversation
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        id,
        user1,
        user2,
        last_message,
        last_message_time,
        user_profiles!user_profiles_id_fkey (
          id,
          full_name
        )
      `)
      .or(`user1.eq.${userId},user2.eq.${userId}`)
      .order('last_message_time', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    // If no data yet, return mock data
    if (!data || data.length === 0) {
      return getMockMessages();
    }

    // Transform the data to match our frontend format
    return data.map(conversation => {
      // Determine which user is the contact (not the current user)
      const contact = conversation.user1 === userId ? 
        conversation.user_profiles.find(p => p.id !== userId) :
        conversation.user_profiles.find(p => p.id !== userId);
      
      return {
        id: conversation.id,
        name: contact?.full_name || "Unknown User",
        message: conversation.last_message,
        time: formatTimeAgo(conversation.last_message_time)
      };
    });
  } catch (error) {
    console.error("Error in fetchUserMessages:", error);
    return getMockMessages();
  }
};

/**
 * Fetch recent matches for a user from Supabase
 */
export const fetchRecentMatchesForUser = async (userId: string): Promise<RecentMatch[]> => {
  try {
    // Query user_matches table for confirmed matches
    const { data, error } = await supabase
      .from('user_matches')
      .select(`
        id,
        created_at,
        match_score,
        status,
        profile:matched_with(id, full_name, location)
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching matches:", error);
      return [];
    }

    // If no data yet, return mock data
    if (!data || data.length === 0) {
      return getMockMatches();
    }

    // Get timestamp from 24 hours ago to mark new matches
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // Transform the data to match our frontend format
    return data.map(match => ({
      id: match.profile.id,
      name: match.profile.full_name,
      location: match.profile.location,
      matchPercentage: Math.round(match.match_score * 100),
      isNew: new Date(match.created_at) > oneDayAgo
    }));
  } catch (error) {
    console.error("Error in fetchRecentMatchesForUser:", error);
    return getMockMatches();
  }
};

// Helper function to format timestamp to "time ago" format
const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Mock data generators (used as fallback when no real data exists yet)
const getMockNotifications = () => [
  { id: 1, type: 'match', message: 'You matched with Alex Johnson!', time: '2h ago' },
  { id: 2, type: 'message', message: 'New message from Jordan Lee', time: '4h ago' },
  { id: 3, type: 'view', message: 'Taylor viewed your profile', time: '1d ago' },
  { id: 4, type: 'match', message: 'You matched with Casey Morgan!', time: '2d ago' }
];

const getMockMessages = () => [
  { id: 1, name: 'Alex J.', message: 'Looking forward to connecting soon!', time: '1h ago' },
  { id: 2, name: 'Jordan L.', message: 'That project sounds interesting.', time: '3h ago' },
  { id: 3, name: 'Taylor M.', message: 'Thanks for the advice!', time: '1d ago' }
];

const getMockMatches = (): RecentMatch[] => [
  { id: '1', name: 'Alex Johnson', location: 'San Francisco', matchPercentage: 95, isNew: true },
  { id: '2', name: 'Jordan Lee', location: 'New York', matchPercentage: 88, isNew: true },
  { id: '3', name: 'Taylor Morgan', location: 'Chicago', matchPercentage: 82, isNew: false },
  { id: '4', name: 'Casey Smith', location: 'Austin', matchPercentage: 79, isNew: false }
];
