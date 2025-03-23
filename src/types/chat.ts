
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
  timestamp: string;
  read: boolean;
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
}
