
export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  location: string;
  interests: string[];
  bio: string;
  relationshipGoal: string;
  skills: string[];
  language: string;
  imageUrl: string;
  industry: string;
  userType: string;
  experienceLevel: string;
  matchScore?: number;
  distance?: number;
  activityScore: number;
  profileCompleteness: number;
}

export const loadSampleUsers = (): UserProfile[] => {
  return [
    {
      id: '1',
      name: 'Alex Johnson',
      age: 28,
      gender: 'Male',
      location: 'San Francisco',
      interests: ['AI', 'Machine Learning', 'Web Development'],
      bio: 'Senior Software Engineer passionate about AI and web technologies',
      relationshipGoal: 'Professional Networking',
      skills: ['React', 'Node.js', 'Python'],
      language: 'English',
      imageUrl: '/placeholder.svg',
      industry: 'Technology',
      userType: 'Professional',
      experienceLevel: 'Senior',
      matchScore: 95,
      activityScore: 85,
      profileCompleteness: 90
    },
    // Add more sample users as needed
  ];
};
