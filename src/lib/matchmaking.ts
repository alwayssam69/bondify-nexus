
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
  university?: string;
  courseYear?: string;
  networkingGoals?: string[];
  projectInterests?: string[];
  latitude?: number;
  longitude?: number;
}

// Removed sample users - we'll use real data instead

export const calculateMatchScore = (
  userProfile: Partial<UserProfile>,
  otherProfile: Partial<UserProfile>
): number => {
  let score = 50; // Base score
  
  // Calculate based on shared interests
  const userInterests = userProfile.interests || [];
  const otherInterests = otherProfile.interests || [];
  const sharedInterests = userInterests.filter(interest => 
    otherInterests.includes(interest)
  );
  
  if (userInterests.length > 0) {
    score += Math.min(30, (sharedInterests.length / userInterests.length) * 30);
  }
  
  // Calculate based on shared skills
  const userSkills = userProfile.skills || [];
  const otherSkills = otherProfile.skills || [];
  const sharedSkills = userSkills.filter(skill => 
    otherSkills.includes(skill)
  );
  
  if (userSkills.length > 0) {
    score += Math.min(20, (sharedSkills.length / userSkills.length) * 20);
  }
  
  // Bonus for same industry
  if (userProfile.industry && otherProfile.industry && 
      userProfile.industry.toLowerCase() === otherProfile.industry.toLowerCase()) {
    score += 10;
  }
  
  // Adjust for distance if available
  if (typeof otherProfile.distance === 'number') {
    // Closer distance gives higher score
    const distanceScore = Math.max(0, 10 - Math.min(10, otherProfile.distance / 10));
    score += distanceScore;
  }
  
  // Cap at 100
  return Math.min(100, Math.round(score));
}
