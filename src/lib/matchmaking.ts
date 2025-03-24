
// Basic User Profile Interface
export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  location?: string;
  bio?: string;
  interests?: string[];
  imageUrl?: string;
  relationshipGoal?: string;
  skills?: string[];
  language?: string;
  industry?: string;
  experienceLevel?: string;
  userType?: string;
  activityScore?: number;
  matchScore?: number;
  profileCompleteness?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
  userTag?: string;  // Added user_tag field
}

// Match Preferences Interface
export interface MatchPreferences {
  ageRange?: [number, number];
  distance?: number;
  relationshipGoals?: string[];
  interests?: string[];
}

// Swipe Direction Types
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

// Match Category Types
export type MatchCategory = 'new' | 'recent' | 'suggested' | 'popular';
