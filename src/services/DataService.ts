
import { supabase } from "@/integrations/supabase/client";
import { ChatContact, ChatMessage, CityMatchData, RecentMatch } from "@/types/chat";

/**
 * Fetch user notifications from Supabase
 */
export const fetchUserNotifications = async (userId: string) => {
  try {
    // In a real implementation, we would query a notifications table
    // For now, we'll return mock data
    return getMockNotifications();
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
    // In a real implementation, we would query a messages table
    // For now, we'll return mock data
    return getMockMessages();
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
        matched_user_id
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching matches:", error);
      return getMockMatches();
    }

    // If no data yet, return mock data
    if (!data || data.length === 0) {
      return getMockMatches();
    }

    // Get user profiles for the matched users
    const matchedUserIds = data.map(match => match.matched_user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, location')
      .in('id', matchedUserIds);

    if (profilesError || !profiles) {
      console.error("Error fetching match profiles:", profilesError);
      return getMockMatches();
    }

    // Get timestamp from 24 hours ago to mark new matches
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // Transform the data to match our frontend format
    return data.map(match => {
      const profile = profiles.find(p => p.id === match.matched_user_id);
      return {
        id: match.matched_user_id,
        name: profile?.full_name || "Unknown User",
        location: profile?.location || "Unknown Location",
        matchPercentage: Math.round((match.match_score || 0) * 100),
        isNew: new Date(match.created_at) > oneDayAgo
      };
    });
  } catch (error) {
    console.error("Error in fetchRecentMatchesForUser:", error);
    return getMockMatches();
  }
};

/**
 * Fetch recent city-based matches for the application
 */
export const fetchRecentMatches = async (limit = 6): Promise<CityMatchData[]> => {
  try {
    // For this demo, we'll just return mock city data
    // In a real app, we would aggregate data from user_matches to show popular cities
    return getMockCityMatches(limit);
  } catch (error) {
    console.error("Error in fetchRecentMatches:", error);
    return getMockCityMatches(limit);
  }
};

/**
 * Fetch chat contacts for a user
 */
export const fetchChatContacts = async (userId: string): Promise<ChatContact[]> => {
  try {
    // In a real implementation, we would query for chat contacts
    // For now, return mock data
    return getMockChatContacts();
  } catch (error) {
    console.error("Error in fetchChatContacts:", error);
    return getMockChatContacts();
  }
};

/**
 * Fetch chat messages between two users
 */
export const fetchChatMessages = async (userId: string, contactId: string): Promise<ChatMessage[]> => {
  try {
    // In a real implementation, we would query for chat messages
    // For now, return mock data
    return getMockChatMessages();
  } catch (error) {
    console.error("Error in fetchChatMessages:", error);
    return getMockChatMessages();
  }
};

/**
 * Send a message to another user
 */
export const sendMessage = async (senderId: string, receiverId: string, content: string): Promise<ChatMessage | null> => {
  try {
    // In a real implementation, we would insert a new message
    // For now, just return a mock response
    const now = new Date();
    return {
      id: Math.random().toString(36).substring(2, 15),
      sender: senderId,
      receiver: receiverId,
      content,
      text: content, // For compatibility
      timestamp: now,
      read: false
    };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return null;
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

const getMockCityMatches = (limit: number): CityMatchData[] => {
  const cities = [
    { city: 'Mumbai', count: 124, lastMatched: 'just now', color: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
    { city: 'Delhi', count: 98, lastMatched: '2m ago', color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { city: 'Bangalore', count: 87, lastMatched: '5m ago', color: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { city: 'Hyderabad', count: 76, lastMatched: '12m ago', color: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { city: 'Chennai', count: 65, lastMatched: '25m ago', color: 'bg-gradient-to-r from-red-400 to-red-600' },
    { city: 'Kolkata', count: 54, lastMatched: '1h ago', color: 'bg-gradient-to-r from-orange-400 to-orange-600' },
    { city: 'Pune', count: 45, lastMatched: '3h ago', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
    { city: 'Ahmedabad', count: 43, lastMatched: 'today', color: 'bg-gradient-to-r from-cyan-400 to-cyan-600' },
    { city: 'Jaipur', count: 38, lastMatched: 'today', color: 'bg-gradient-to-r from-violet-400 to-violet-600' },
    { city: 'Lucknow', count: 36, lastMatched: 'yesterday', color: 'bg-gradient-to-r from-fuchsia-400 to-fuchsia-600' }
  ];
  
  return cities.slice(0, limit);
};

const getMockChatContacts = (): ChatContact[] => [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    lastMessage: 'Looking forward to our call tomorrow!', 
    lastMessageTime: '5m ago',
    unreadCount: 2,
    online: true,
    avatar: 'bg-blue-100 text-blue-600',
    unread: 2
  },
  { 
    id: '2', 
    name: 'Jordan Lee', 
    lastMessage: 'I can share some resources about that project.', 
    lastMessageTime: '1h ago',
    unreadCount: 0,
    online: false,
    avatar: 'bg-green-100 text-green-600',
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    unread: 0
  },
  { 
    id: '3', 
    name: 'Taylor Morgan', 
    lastMessage: 'Thanks for your advice on the proposal!', 
    lastMessageTime: '3h ago',
    unreadCount: 0,
    online: false,
    avatar: 'bg-purple-100 text-purple-600',
    lastSeen: new Date(Date.now() - 10800000), // 3 hours ago
    unread: 0
  }
];

const getMockChatMessages = (): ChatMessage[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      id: '1',
      sender: 'contact',
      receiver: 'user',
      content: 'Hello! I noticed your profile and wanted to connect.',
      text: 'Hello! I noticed your profile and wanted to connect.',
      timestamp: new Date(yesterday.setHours(14, 0, 0, 0)),
      read: true
    },
    {
      id: '2',
      sender: 'user',
      receiver: 'contact',
      content: 'Hi there! Thanks for reaching out. What do you do?',
      text: 'Hi there! Thanks for reaching out. What do you do?',
      timestamp: new Date(yesterday.setHours(14, 15, 0, 0)),
      read: true
    },
    {
      id: '3',
      sender: 'contact',
      receiver: 'user',
      content: "I'm a software engineer specializing in machine learning. I saw that you're working on some interesting projects in that space.",
      text: "I'm a software engineer specializing in machine learning. I saw that you're working on some interesting projects in that space.",
      timestamp: new Date(yesterday.setHours(14, 30, 0, 0)),
      read: true
    },
    {
      id: '4',
      sender: 'user',
      receiver: 'contact',
      content: "That's great! Yes, I've been working on a few ML projects lately. Would love to chat more about it.",
      text: "That's great! Yes, I've been working on a few ML projects lately. Would love to chat more about it.",
      timestamp: new Date(yesterday.setHours(15, 0, 0, 0)),
      read: true
    },
    {
      id: '5',
      sender: 'contact',
      receiver: 'user',
      content: 'Definitely! Do you have time for a quick call this week?',
      text: 'Definitely! Do you have time for a quick call this week?',
      timestamp: new Date(now.setHours(10, 0, 0, 0)),
      read: true
    },
    {
      id: '6',
      sender: 'user',
      receiver: 'contact',
      content: 'Sure, how about tomorrow at 4pm?',
      text: 'Sure, how about tomorrow at 4pm?',
      timestamp: new Date(now.setHours(10, 15, 0, 0)),
      read: true
    },
    {
      id: '7',
      sender: 'contact',
      receiver: 'user',
      content: 'That works for me! Looking forward to our call tomorrow!',
      text: 'That works for me! Looking forward to our call tomorrow!',
      timestamp: new Date(now.setHours(10, 30, 0, 0)),
      read: false
    }
  ];
};
