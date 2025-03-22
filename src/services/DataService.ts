
import { supabase } from "@/integrations/supabase/client";
import { ChatContact, ChatMessage, RecentMatch } from "@/types/chat";
import { UserProfile } from "@/lib/matchmaking";

// Fetch recent matches for the landing page
export async function fetchRecentMatches(limit = 6): Promise<{ city: string; count: number; lastMatched: string; color: string }[]> {
  try {
    // Get actual match data grouped by location
    const { data, error } = await supabase
      .from('user_matches')
      .select('matched_user_id, last_activity, user_profiles!user_matches_matched_user_id_fkey(location)')
      .order('last_activity', { ascending: false })
      .limit(limit * 3); // Fetch extra to ensure we have enough unique cities
    
    if (error) throw error;
    
    // Process the data to group by location
    const locationMap = new Map<string, { count: number; lastMatched: Date }>();
    
    data?.forEach(match => {
      const location = match.user_profiles?.location || 'Unknown';
      
      if (!locationMap.has(location)) {
        locationMap.set(location, { 
          count: 1, 
          lastMatched: new Date(match.last_activity) 
        });
      } else {
        const current = locationMap.get(location)!;
        current.count += 1;
        
        // Update last matched time if newer
        const matchTime = new Date(match.last_activity);
        if (matchTime > current.lastMatched) {
          current.lastMatched = matchTime;
        }
      }
    });
    
    // If we don't have enough cities, fall back to some popular ones with estimated data
    const popularCities = [
      { city: "Delhi", color: "from-blue-400 to-blue-600" },
      { city: "Bangalore", color: "from-indigo-400 to-indigo-600" },
      { city: "Mumbai", color: "from-purple-400 to-purple-600" },
      { city: "Hyderabad", color: "from-pink-400 to-pink-600" },
      { city: "Chennai", color: "from-red-400 to-red-600" },
      { city: "Kolkata", color: "from-orange-400 to-orange-600" },
    ];
    
    // Format the result with required fields
    const result = Array.from(locationMap.entries())
      .map(([city, data]) => {
        const timeAgo = getTimeAgo(data.lastMatched);
        // Find matching color or use a default
        const matchingCity = popularCities.find(c => c.city === city);
        return {
          city,
          count: data.count,
          lastMatched: timeAgo,
          color: matchingCity?.color || "from-blue-400 to-blue-600"
        };
      })
      .slice(0, limit);
    
    // If we don't have enough real data, fill with placeholder data
    while (result.length < limit) {
      const remaining = popularCities.filter(city => 
        !result.some(r => r.city === city.city)
      );
      
      if (remaining.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * remaining.length);
      const city = remaining[randomIndex];
      
      result.push({
        city: city.city,
        count: Math.floor(Math.random() * 50) + 50,
        lastMatched: "recently",
        color: city.color
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    return [];
  }
}

// Fetch user's notifications
export async function fetchUserNotifications(userId: string): Promise<{ 
  id: number; type: 'match' | 'message' | 'view'; message: string; time: string 
}[]> {
  try {
    const { data: matchNotifications, error: matchError } = await supabase
      .from('user_matches')
      .select('id, user_id, matched_user_id, last_activity, user_profiles!user_matches_matched_user_id_fkey(full_name)')
      .eq('user_id', userId)
      .eq('status', 'matched')
      .order('last_activity', { ascending: false })
      .limit(10);
    
    if (matchError) throw matchError;
    
    // Fetch recent message notifications
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('id, sender_id, created_at, content')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (messageError && messageError.code !== 'PGRST116') {
      // PGRST116 means the table doesn't exist - we'll handle that gracefully
      throw messageError;
    }
    
    // Get sender names separately since the foreign key isn't set up in the database
    const messageNotifications = messageData || [];
    const senderIds = messageNotifications.map(msg => msg.sender_id);
    
    // Get sender profiles
    const { data: senderProfiles } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .in('id', senderIds)
      .then(({ data }) => ({ data: data || [] }));
    
    // Create a map of sender ids to names for easier lookup
    const senderMap = new Map();
    senderProfiles?.forEach(profile => {
      senderMap.set(profile.id, profile.full_name);
    });
    
    // Fetch profile view notifications
    const { data: viewData, error: viewError } = await supabase
      .from('profile_views')
      .select('id, viewer_id, viewed_at')
      .eq('profile_id', userId)
      .eq('is_notified', false)
      .order('viewed_at', { ascending: false })
      .limit(5);
    
    if (viewError && viewError.code !== 'PGRST116') {
      throw viewError;
    }
    
    // Get viewer profiles separately
    const viewNotifications = viewData || [];
    const viewerIds = viewNotifications.map(view => view.viewer_id);
    
    // Get viewer profiles
    const { data: viewerProfiles } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .in('id', viewerIds)
      .then(({ data }) => ({ data: data || [] }));
    
    // Create a map of viewer ids to names
    const viewerMap = new Map();
    viewerProfiles?.forEach(profile => {
      viewerMap.set(profile.id, profile.full_name);
    });
    
    // Format match notifications
    const formattedMatches = (matchNotifications || []).map((match, index) => ({
      id: index,
      type: 'match' as const,
      message: `You have a new match with ${match.user_profiles?.full_name || 'someone'}`,
      time: getTimeAgo(new Date(match.last_activity))
    }));
    
    // Format message notifications
    const formattedMessages = messageNotifications.map((message, index) => {
      const senderName = senderMap.get(message.sender_id) || 'Someone';
      return {
        id: formattedMatches.length + index,
        type: 'message' as const,
        message: `${senderName} sent you a message`,
        time: getTimeAgo(new Date(message.created_at))
      };
    });
    
    // Format view notifications
    const formattedViews = viewNotifications.map((view, index) => {
      const viewerName = viewerMap.get(view.viewer_id) || 'Someone';
      return {
        id: formattedMatches.length + formattedMessages.length + index,
        type: 'view' as const,
        message: `${viewerName} viewed your profile`,
        time: getTimeAgo(new Date(view.viewed_at))
      };
    });
    
    // Combine all notifications
    return [...formattedMatches, ...formattedMessages, ...formattedViews]
      .sort((a, b) => {
        // Convert time strings to comparable values for sorting
        const aTime = parseTimeAgo(a.time);
        const bTime = parseTimeAgo(b.time);
        return aTime - bTime;
      })
      .slice(0, 10); // Limit to 10 notifications
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return [];
  }
}

// Fetch user's recent matches for the dropdown
export async function fetchRecentMatchesForUser(userId: string): Promise<RecentMatch[]> {
  try {
    const { data, error } = await supabase
      .from('user_matches')
      .select(`
        id,
        matched_user_id,
        match_score,
        last_activity,
        user_profiles!user_matches_matched_user_id_fkey(
          full_name,
          location,
          image_url
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'matched')
      .order('last_activity', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    
    // Check if we have new matches (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return (data || []).map(match => ({
      id: match.matched_user_id,
      name: match.user_profiles?.full_name?.split(' ')[0] + ' ' + 
            (match.user_profiles?.full_name?.split(' ')[1]?.[0] || '') + '.' || 'User',
      matchPercentage: match.match_score || 80,
      avatar: match.user_profiles?.image_url || '',
      location: match.user_profiles?.location || 'Unknown',
      isNew: new Date(match.last_activity) > oneDayAgo
    }));
  } catch (error) {
    console.error("Error fetching user's recent matches:", error);
    return [];
  }
}

// Fetch user's messages for the dropdown
export async function fetchUserMessages(userId: string): Promise<{ 
  id: number; name: string; message: string; time: string 
}[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, content, created_at, sender_id')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    // If no messages table yet, return empty array
    if (!data) return [];
    
    // Get sender profiles separately
    const senderIds = data.map(msg => msg.sender_id);
    
    const { data: senderProfiles } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .in('id', senderIds)
      .then(({ data }) => ({ data: data || [] }));
    
    // Create a map of sender ids to names
    const senderMap = new Map();
    senderProfiles?.forEach(profile => {
      senderMap.set(profile.id, profile.full_name);
    });
    
    return data.map(message => ({
      id: parseInt(message.id.toString()) || Math.floor(Math.random() * 1000),
      name: senderMap.get(message.sender_id) || 'User',
      message: message.content,
      time: getTimeAgo(new Date(message.created_at))
    }));
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return [];
  }
}

// Fetch chat contacts
export async function fetchChatContacts(userId: string): Promise<ChatContact[]> {
  try {
    // Get all matches for the user
    const { data: matches, error: matchesError } = await supabase
      .from('user_matches')
      .select(`
        matched_user_id,
        match_score,
        user_profiles!user_matches_matched_user_id_fkey(
          full_name,
          location,
          image_url,
          last_active
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'matched')
      .order('last_activity', { ascending: false });
    
    if (matchesError) throw matchesError;
    
    if (!matches) return [];
    
    // Get message counts for each matched user
    const contactsData = await Promise.all(matches.map(async (match) => {
      // Get latest message
      const { data: latestMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id, content, created_at, sender_id, recipient_id, is_read')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${match.matched_user_id}),and(sender_id.eq.${match.matched_user_id},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(1);
        
      // Count unread messages
      const { count: unreadCount, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('sender_id', match.matched_user_id)
        .eq('recipient_id', userId)
        .eq('is_read', false);
      
      // Generate avatar color based on name
      const name = match.user_profiles?.full_name || 'User';
      const colors = ['bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-yellow-100'];
      const colorIndex = name.charCodeAt(0) % colors.length;
      
      const latestMessage = latestMessages && latestMessages.length > 0 
        ? latestMessages[0].content 
        : 'No messages yet';
        
      return {
        id: match.matched_user_id,
        name: match.user_profiles?.full_name || 'User',
        lastMessage: latestMessage,
        avatar: colors[colorIndex],
        unread: unreadCount || 0,
        online: isUserOnline(match.user_profiles?.last_active),
        lastSeen: match.user_profiles?.last_active ? new Date(match.user_profiles.last_active) : undefined
      };
    }));
    
    return contactsData;
  } catch (error) {
    console.error("Error fetching chat contacts:", error);
    return [];
  }
}

// Fetch chat messages between two users
export async function fetchChatMessages(
  userId: string, 
  contactId: string
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, recipient_id, content, created_at')
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // If no messages, return empty array
    if (!data) return [];
    
    return data.map(message => ({
      id: message.id.toString(),
      sender: message.sender_id === userId ? 'user' : 'match',
      text: message.content,
      timestamp: new Date(message.created_at)
    }));
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
}

// Send a message from one user to another
export async function sendMessage(
  senderId: string,
  recipientId: string,
  text: string
): Promise<ChatMessage | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content: text,
        is_read: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update the last activity in the match
    await supabase
      .from('user_matches')
      .update({ last_activity: new Date().toISOString() })
      .match({ user_id: senderId, matched_user_id: recipientId });
    
    return {
      id: data.id.toString(),
      sender: 'user',
      text: data.content,
      timestamp: new Date(data.created_at)
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

// Helper function to determine if a user is online
function isUserOnline(lastActive?: string): boolean {
  if (!lastActive) return false;
  
  const lastActiveTime = new Date(lastActive);
  const now = new Date();
  
  // Consider user online if active in the last 5 minutes
  return (now.getTime() - lastActiveTime.getTime()) < 5 * 60 * 1000;
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else {
    // Format date for older messages
    return date.toLocaleDateString();
  }
}

// Helper function to parse time ago string to comparable number (for sorting)
function parseTimeAgo(timeAgo: string): number {
  if (timeAgo === 'just now') return 0;
  
  const match = timeAgo.match(/(\d+)([mhd])/);
  if (!match) return 1000000; // Very old
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'm': return value;
    case 'h': return value * 60;
    case 'd': return value * 60 * 24;
    default: return 1000000;
  }
}
