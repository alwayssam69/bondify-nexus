
export interface Notification {
  id: string;
  type: 'match' | 'message' | 'view' | 'system' | 'profile_view';
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
  metadata?: Record<string, any>;
  related_entity_id?: string | null;
  createdAt?: Date;
  isRead?: boolean;
  userId?: string;
  relatedId?: string;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications?: (page: number, limit: number) => Promise<Notification[]>;
}
