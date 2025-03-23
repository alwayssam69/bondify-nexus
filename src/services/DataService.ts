
import { supabase } from "@/integrations/supabase/client";
import { ChatContact, ChatMessage, CityMatchData, RecentMatch } from "@/types/chat";

/**
 * Fetch user notifications from Supabase
 */
export const fetchUserNotifications = async (userId: string) => {
  try {
    // Query notifications table
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    
    // If no data, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transform to expected format
    return data.map(item => ({
      id: item.id,
      type: item.type as 'match' | 'message' | 'view',
      message: item.message,
      time: formatTimeAgo(item.created_at)
    }));
  } catch (error) {
    console.error("Error in fetchUserNotifications:", error);
    return [];
  }
};

/**
 * Fetch user messages from Supabase
 */
export const fetchUserMessages = async (userId: string) => {
  try {
    // Query the latest message from each conversation
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender,
        receiver,
        content,
        created_at,
        profiles:sender_profile(full_name)
      `)
      .or(`sender.eq.${userId},receiver.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    
    // If no data, return empty array
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group by conversation and take the latest message
    const latestMessages = new Map();
    data.forEach(msg => {
      const contactId = msg.sender === userId ? msg.receiver : msg.sender;
      if (!latestMessages.has(contactId)) {
        latestMessages.set(contactId, {
          id: latestMessages.size + 1,
          name: msg.profiles?.full_name || 'Unknown User',
          message: msg.content,
          time: formatTimeAgo(msg.created_at)
        });
      }
    });
    
    return Array.from(latestMessages.values());
  } catch (error) {
    console.error("Error in fetchUserMessages:", error);
    return [];
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
      return [];
    }

    // If no data, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Get user profiles for the matched users
    const matchedUserIds = data.map(match => match.matched_user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, location')
      .in('id', matchedUserIds);

    if (profilesError || !profiles) {
      console.error("Error fetching match profiles:", profilesError);
      return [];
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
    return [];
  }
};

/**
 * Fetch recent city-based matches for the application
 */
export const fetchRecentMatches = async (limit = 6): Promise<CityMatchData[]> => {
  try {
    // Query for city match data grouped by location
    const { data, error } = await supabase
      .from('user_matches')
      .select(`
        id,
        created_at,
        user_profiles:matched_user_id(location)
      `)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching city matches:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group by city and count matches
    const cityMap = new Map<string, {count: number, lastMatched: string}>();
    
    data.forEach(match => {
      const city = match.user_profiles?.location || 'Unknown';
      if (!cityMap.has(city)) {
        cityMap.set(city, {
          count: 1,
          lastMatched: formatTimeAgo(match.created_at)
        });
      } else {
        const current = cityMap.get(city)!;
        cityMap.set(city, {
          count: current.count + 1,
          lastMatched: current.lastMatched // Keep the earliest "last matched" time
        });
      }
    });
    
    // Define colors for city backgrounds
    const colors = [
      'bg-gradient-to-r from-indigo-400 to-indigo-600',
      'bg-gradient-to-r from-blue-400 to-blue-600',
      'bg-gradient-to-r from-purple-400 to-purple-600',
      'bg-gradient-to-r from-pink-400 to-pink-600',
      'bg-gradient-to-r from-red-400 to-red-600',
      'bg-gradient-to-r from-orange-400 to-orange-600',
      'bg-gradient-to-r from-emerald-400 to-emerald-600',
      'bg-gradient-to-r from-cyan-400 to-cyan-600',
      'bg-gradient-to-r from-violet-400 to-violet-600',
      'bg-gradient-to-r from-fuchsia-400 to-fuchsia-600'
    ];
    
    // Convert to array and sort by count
    const result: CityMatchData[] = Array.from(cityMap.entries())
      .map(([city, data], index) => ({
        city,
        count: data.count,
        lastMatched: data.lastMatched,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return result;
  } catch (error) {
    console.error("Error in fetchRecentMatches:", error);
    return [];
  }
};

/**
 * Fetch chat contacts for a user
 */
export const fetchChatContacts = async (userId: string): Promise<ChatContact[]> => {
  try {
    // First get all messages to/from this user
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        sender,
        receiver,
        content,
        created_at,
        read
      `)
      .or(`sender.eq.${userId},receiver.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return [];
    }
    
    if (!messages || messages.length === 0) {
      return [];
    }
    
    // Get unique contacts that the user has messaged with
    const contactIds = new Set<string>();
    messages.forEach(msg => {
      if (msg.sender === userId) {
        contactIds.add(msg.receiver);
      } else {
        contactIds.add(msg.sender);
      }
    });
    
    // Fetch user profiles for these contacts
    const { data: contactProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, last_active, avatar_url')
      .in('id', Array.from(contactIds));
    
    if (profilesError) {
      console.error("Error fetching contact profiles:", profilesError);
      return [];
    }
    
    // Prepare the contacts data
    const contacts: ChatContact[] = [];
    const avatarColors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
      'bg-indigo-100 text-indigo-600'
    ];
    
    contactIds.forEach(contactId => {
      const profile = contactProfiles.find(p => p.id === contactId);
      if (!profile) return;
      
      // Get last message for this contact
      const lastMessage = messages.find(msg => 
        (msg.sender === contactId && msg.receiver === userId) || 
        (msg.sender === userId && msg.receiver === contactId)
      );
      
      if (!lastMessage) return;
      
      // Count unread messages
      const unreadCount = messages.filter(msg => 
        msg.sender === contactId && 
        msg.receiver === userId && 
        !msg.read
      ).length;
      
      // Determine if user is online (active in last 5 minutes)
      const lastActive = profile.last_active ? new Date(profile.last_active) : null;
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      const isOnline = lastActive ? lastActive > fiveMinutesAgo : false;
      
      contacts.push({
        id: contactId,
        name: profile.full_name || 'Unknown User',
        lastMessage: lastMessage.content,
        lastMessageTime: formatTimeAgo(lastMessage.created_at),
        unreadCount,
        online: isOnline,
        avatar: profile.avatar_url || avatarColors[contacts.length % avatarColors.length],
        lastSeen: lastActive,
        unread: unreadCount
      });
    });
    
    // Sort by last message time (newest first)
    return contacts.sort((a, b) => {
      const dateA = new Date(a.lastMessageTime);
      const dateB = new Date(b.lastMessageTime);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error in fetchChatContacts:", error);
    return [];
  }
};

/**
 * Fetch chat messages between two users
 */
export const fetchChatMessages = async (userId: string, contactId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender.eq.${userId},receiver.eq.${contactId}),and(sender.eq.${contactId},receiver.eq.${userId})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Convert to ChatMessage format
    return data.map(msg => ({
      id: msg.id.toString(),
      sender: msg.sender,
      receiver: msg.receiver,
      content: msg.content,
      text: msg.content, // For compatibility
      timestamp: new Date(msg.created_at),
      read: msg.read
    }));
  } catch (error) {
    console.error("Error in fetchChatMessages:", error);
    return [];
  }
};

/**
 * Send a message to another user
 */
export const sendMessage = async (senderId: string, receiverId: string, content: string): Promise<ChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender: senderId,
          receiver: receiverId,
          content,
          read: false
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Error sending message:", error);
      return null;
    }
    
    return {
      id: data.id.toString(),
      sender: data.sender,
      receiver: data.receiver,
      content: data.content,
      text: data.content, // For compatibility
      timestamp: new Date(data.created_at),
      read: data.read
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
