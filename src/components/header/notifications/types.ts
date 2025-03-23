
export interface Notification {
  id: string;
  type: 'match' | 'message' | 'view';
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
  metadata?: Record<string, any>;
  related_entity_id?: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
}
