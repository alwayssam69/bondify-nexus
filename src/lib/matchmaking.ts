
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
  image_url?: string; // Add this alias for compatibility
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
  
  // Adding missing properties that were causing TypeScript errors
  university?: string;
  courseYear?: string;
  networkingGoals?: string[];
  projectInterests?: string[];
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

// Add a sample users function for fallback data
export const loadSampleUsers = (): UserProfile[] => {
  return [
    {
      id: "sample1",
      name: "Alex Johnson",
      age: 28,
      gender: "Male",
      location: "San Francisco",
      bio: "Product Manager with 5+ years of experience",
      interests: ["Technology", "Product Design", "UX Research"],
      skills: ["Product Management", "Agile", "User Testing"],
      industry: "Technology",
      experienceLevel: "Mid-level",
      userType: "Professional",
      matchScore: 92,
      userTag: "alexj"
    },
    {
      id: "sample2",
      name: "Sarah Miller",
      age: 32,
      gender: "Female",
      location: "New York",
      bio: "Senior Developer passionate about AI",
      interests: ["Machine Learning", "Mobile Development", "Open Source"],
      skills: ["Python", "TensorFlow", "React Native"],
      industry: "Software",
      experienceLevel: "Senior",
      userType: "Professional",
      matchScore: 87,
      userTag: "sarahm"
    },
    {
      id: "sample3",
      name: "Mike Chen",
      age: 25,
      gender: "Male",
      location: "Boston",
      bio: "UX Designer looking for collaboration",
      interests: ["UI Design", "Accessibility", "User Research"],
      skills: ["Figma", "Adobe XD", "Prototyping"],
      industry: "Design",
      experienceLevel: "Junior",
      userType: "Professional",
      matchScore: 79,
      userTag: "mikec"
    }
  ];
};
