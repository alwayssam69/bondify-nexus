
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
