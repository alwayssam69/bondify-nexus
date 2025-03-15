
export interface ChatMessage {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: Date;
}

export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unread: number;
  online: boolean;
  lastSeen?: Date;
}

export interface RecentMatch {
  id: string;
  name: string;
  matchPercentage: number;
  avatar: string;
  location: string;
  isNew: boolean;
}
