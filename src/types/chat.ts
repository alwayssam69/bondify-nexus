
/**
 * Interface for a recent match in the UI
 */
export interface RecentMatch {
  id: string;
  name: string;
  location: string;
  matchPercentage: number;
  isNew: boolean;
}

/**
 * Interface for a chat message
 */
export interface ChatMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
  read: boolean;
  text?: string; // Adding this for compatibility
}

/**
 * Interface for a chat contact
 */
export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  imageUrl?: string;
  avatar?: string; // Avatar background/color class
  lastSeen?: Date; // Last seen time
  unread?: number; // Alias for unreadCount for compatibility
}

/**
 * Interface for city-based match data
 */
export interface CityMatchData {
  city: string;
  count: number;
  lastMatched: string;
  color: string;
}
