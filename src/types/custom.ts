
// Custom types for our application
export interface NewsItem {
  id: string;
  industry: string;
  title: string;
  content: string;
  source_url: string;
  image_url: string;
  timestamp: string;
  likes_count?: number;
  comments_count?: number;
}

export interface NewsInteraction {
  id: string;
  user_id: string;
  news_id: string;
  liked?: boolean;
  comment?: string;
  created_at: string;
}

export interface Question {
  id: string;
  user_id: string;
  content: string;
  industry: string;
  anonymous: boolean;
  timestamp: string;
  user?: {
    full_name: string;
    image_url?: string;
    expert_verified?: boolean;
  };
  answers_count?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  expert_id: string;
  content: string;
  timestamp: string;
  expert?: {
    full_name: string;
    image_url?: string;
  };
}
