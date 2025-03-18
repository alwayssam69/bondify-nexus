export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  interests: string[];
  location: string;
  country?: string;
  bio?: string;
  relationshipGoal: string;
  skills?: string[];
  language?: string;
  imageUrl?: string;
  matchScore?: number;
  distance?: number;
  industry?: string;
  userType?: string;
  experienceLevel?: string;
  activityScore?: number;
  profileCompleteness?: number;
  dailySwipes?: number;
  maxDailySwipes?: number;
  // Add missing properties to fix TypeScript errors
  latitude?: number;
  longitude?: number;
  networkingGoals?: string[];
  communicationPreference?: string;
  verified?: boolean;
  // University networking fields
  university?: string;
  courseYear?: string;
  projectInterests?: string[];
  profilePhotos?: string[];
};

export type MatchScore = {
  userId: string;
  score: number;
};

export type SwipeAction = 'like' | 'reject' | 'save';
export type SwipeHistory = {
  userId: string;
  targetId: string;
  action: SwipeAction;
  timestamp: Date;
};

const userBuckets: { [key: string]: UserProfile[] } = {};
const swipeHistory: SwipeHistory[] = [];
const savedProfiles: { [userId: string]: string[] } = {};

export function assignToBucket(user: UserProfile) {
  const ageGroup = getAgeGroup(user.age);
  const industryKey = user.industry || 'general';
  const expLevel = user.experienceLevel || 'intermediate';
  const userType = user.userType || 'general';
  
  const bucketKeys = [
    // Original keys
    `${ageGroup}-${user.location}-${user.relationshipGoal}`,
    `${ageGroup}-${user.relationshipGoal}`,
    `${user.location}-${user.relationshipGoal}`,
    // Professional networking keys
    `${industryKey}-${expLevel}-${user.location}`,
    `${userType}-${industryKey}`,
    `${industryKey}-${user.location}`,
    `${userType}-${user.location}`
  ];
  
  bucketKeys.forEach(key => {
    if (!userBuckets[key]) {
      userBuckets[key] = [];
    }
    
    const existingUserIndex = userBuckets[key].findIndex(u => u.id === user.id);
    if (existingUserIndex >= 0) {
      userBuckets[key][existingUserIndex] = user;
    } else {
      userBuckets[key].push(user);
    }
  });
}

/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

function getAgeGroup(age: number): string {
  if (age < 23) return '18-22';
  if (age < 28) return '23-27';
  if (age < 33) return '28-32';
  if (age < 38) return '33-37';
  if (age < 43) return '38-42';
  if (age < 48) return '43-47';
  return '48+';
}

export function findMatches(currentUser: UserProfile, maxResults: number = 20): UserProfile[] {
  const ageGroup = getAgeGroup(currentUser.age);
  const industryKey = currentUser.industry || 'general';
  const expLevel = currentUser.experienceLevel || 'intermediate';
  const userType = currentUser.userType || 'general';
  
  const bucketKeys = [
    // Original keys
    `${ageGroup}-${currentUser.location}-${currentUser.relationshipGoal}`,
    `${ageGroup}-${currentUser.relationshipGoal}`,
    `${currentUser.location}-${currentUser.relationshipGoal}`,
    // Professional networking keys
    `${industryKey}-${expLevel}-${currentUser.location}`,
    `${userType}-${industryKey}`,
    `${industryKey}-${currentUser.location}`,
    `${userType}-${currentUser.location}`
  ];
  
  let potentialMatches: UserProfile[] = [];
  
  bucketKeys.forEach(key => {
    if (userBuckets[key]) {
      potentialMatches = [
        ...potentialMatches,
        ...userBuckets[key].filter(u => u.id !== currentUser.id && 
          !potentialMatches.some(existing => existing.id === u.id))
      ];
    }
  });
  
  const scoredMatches = potentialMatches.map(match => {
    const score = calculateMatchScore(currentUser, match);
    return { ...match, matchScore: score };
  });
  
  scoredMatches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  
  return scoredMatches.slice(0, maxResults);
}

export function calculateMatchScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;
  
  // Common interests matching
  const commonInterests = user2.interests.filter(i => user1.interests.includes(i));
  score += commonInterests.length * 8;
  
  // Skills matching
  if (user1.skills && user2.skills) {
    const commonSkills = user2.skills.filter(s => user1.skills?.includes(s));
    score += commonSkills.length * 6;
  }
  
  // Location matching
  if (user2.location === user1.location) score += 15;
  
  // Proximity bonus if distance is available
  if (user1.latitude && user1.longitude && user2.latitude && user2.longitude) {
    const distance = calculateDistance(
      user1.latitude, 
      user1.longitude, 
      user2.latitude, 
      user2.longitude
    );
    
    // Add bonus points for proximity (up to 10 points)
    if (distance < 5) score += 10;     // Very close
    else if (distance < 10) score += 8;  // Close
    else if (distance < 20) score += 6;  // Somewhat close
    else if (distance < 50) score += 4;  // Moderate distance
    else if (distance < 100) score += 2; // Further away
  }
  
  // Relationship goal matching
  if (user2.relationshipGoal === user1.relationshipGoal) score += 10;
  
  // Language matching
  if (user2.language === user1.language) score += 5;
  
  // Activity score consideration
  score += Math.min(user2.activityScore / 10, 10);
  
  // Profile completeness consideration
  if (user2.profileCompleteness) {
    score += user2.profileCompleteness / 20;
  }
  
  // Professional networking specific matching
  
  // Industry matching (high priority)
  if (user1.industry && user2.industry && user1.industry === user2.industry) {
    score += 20;
  }
  
  // Experience level matching
  if (user1.experienceLevel && user2.experienceLevel) {
    if (user1.experienceLevel === user2.experienceLevel) {
      score += 10;
    } else {
      // Some value for adjacent experience levels
      score += 5;
    }
  }
  
  // User type complementary matching
  if (user1.userType && user2.userType) {
    // Mentor-Student match
    if ((user1.userType === 'mentor' && user2.userType === 'student') || 
        (user1.userType === 'student' && user2.userType === 'mentor')) {
      score += 15;
    }
    
    // Founder-Investor match
    if ((user1.userType === 'founder' && user2.userType === 'investor') || 
        (user1.userType === 'investor' && user2.userType === 'founder')) {
      score += 15;
    }
    
    // Collaborator-Collaborator match
    if (user1.userType === 'collaborator' && user2.userType === 'collaborator') {
      score += 12;
    }
  }
  
  // Networking goals matching
  if (user1.networkingGoals && user2.networkingGoals) {
    const commonGoals = user2.networkingGoals.filter(g => user1.networkingGoals?.includes(g));
    score += commonGoals.length * 10;
  }
  
  // Communication preference matching
  if (user1.communicationPreference && user2.communicationPreference && 
      user1.communicationPreference === user2.communicationPreference) {
    score += 8;
  }
  
  // Verified user bonus
  if (user2.verified) {
    score += 10;
  }
  
  // Cap at 100%
  return Math.min(score, 100);
}

export function recordSwipe(userId: string, targetId: string, action: SwipeAction): void {
  swipeHistory.push({
    userId,
    targetId,
    action,
    timestamp: new Date()
  });
  
  // If action is 'save', add to saved profiles
  if (action === 'save') {
    if (!savedProfiles[userId]) {
      savedProfiles[userId] = [];
    }
    
    if (!savedProfiles[userId].includes(targetId)) {
      savedProfiles[userId].push(targetId);
    }
  }
}

export function getSavedProfiles(userId: string): string[] {
  return savedProfiles[userId] || [];
}

export function checkMatch(user1Id: string, user2Id: string): boolean {
  const user1LikedUser2 = swipeHistory.some(
    swipe => swipe.userId === user1Id && swipe.targetId === user2Id && swipe.action === 'like'
  );
  
  const user2LikedUser1 = swipeHistory.some(
    swipe => swipe.userId === user2Id && swipe.targetId === user1Id && swipe.action === 'like'
  );
  
  return user1LikedUser2 && user2LikedUser1;
}

export function getUserMatches(userId: string): string[] {
  const userLikes = swipeHistory.filter(
    swipe => swipe.userId === userId && swipe.action === 'like'
  ).map(swipe => swipe.targetId);
  
  const likedByUsers = swipeHistory.filter(
    swipe => swipe.targetId === userId && swipe.action === 'like'
  ).map(swipe => swipe.userId);
  
  return userLikes.filter(id => likedByUsers.includes(id));
}

export function getRandomChatMatches(currentUser: UserProfile, count: number = 3): UserProfile[] {
  let potentialMatches: UserProfile[] = [];
  
  Object.values(userBuckets).forEach(bucket => {
    potentialMatches = [
      ...potentialMatches,
      ...bucket.filter(u => 
        u.id !== currentUser.id && 
        !potentialMatches.some(existing => existing.id === u.id) &&
        (u.relationshipGoal === currentUser.relationshipGoal || 
         (u.industry && currentUser.industry && u.industry === currentUser.industry))
      )
    ];
  });
  
  potentialMatches.sort(() => 0.5 - Math.random());
  
  return potentialMatches.slice(0, count);
}

export function getAllUsers(): UserProfile[] {
  const allUsers: UserProfile[] = [];
  const addedIds = new Set<string>();
  
  Object.values(userBuckets).forEach(bucket => {
    bucket.forEach(user => {
      if (!addedIds.has(user.id)) {
        allUsers.push(user);
        addedIds.add(user.id);
      }
    });
  });
  
  return allUsers;
}

export const loadSampleUsers = (): UserProfile[] => {
  const users: UserProfile[] = [
    {
      id: "user1",
      name: "Alex Johnson",
      age: 28,
      gender: "male",
      interests: ["technology", "startups", "hiking", "photography"],
      location: "San Francisco",
      country: "United States",
      bio: "Tech entrepreneur with a passion for innovative solutions. Looking to connect with like-minded professionals.",
      relationshipGoal: "networking",
      skills: ["javascript", "react", "product-management", "leadership"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-blue-400 to-indigo-600",
      industry: "technology",
      userType: "founder",
      experienceLevel: "expert",
      activityScore: 95,
      profileCompleteness: 90,
      university: "Stanford University",
      courseYear: "Masters",
      projectInterests: ["machine-learning", "blockchain", "web-development"],
    },
    {
      id: "user2",
      name: "Sophia Kim",
      age: 31,
      gender: "female",
      interests: ["finance", "investment", "yoga", "travel"],
      location: "New York",
      country: "United States",
      bio: "Investment banker with 8+ years of experience. Looking to expand my professional network.",
      relationshipGoal: "networking",
      skills: ["financial-analysis", "investment", "risk-management", "leadership"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-purple-400 to-pink-600",
      industry: "finance",
      userType: "professional",
      experienceLevel: "expert",
      activityScore: 88,
      profileCompleteness: 95,
    },
    {
      id: "user3",
      name: "David Chen",
      age: 24,
      gender: "male",
      interests: ["design", "art", "technology", "music"],
      location: "Los Angeles",
      country: "United States",
      bio: "UI/UX designer passionate about creating beautiful, functional interfaces. Looking for project collaborations.",
      relationshipGoal: "networking",
      skills: ["ui-ux", "graphic-design", "figma", "illustration"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-green-400 to-teal-600",
      industry: "design",
      userType: "collaborator",
      experienceLevel: "intermediate",
      activityScore: 75,
      profileCompleteness: 85,
    },
    {
      id: "user4",
      name: "Rachel Torres",
      age: 29,
      gender: "female",
      interests: ["marketing", "social media", "travel", "cooking"],
      location: "Chicago",
      country: "United States",
      bio: "Digital marketing specialist with a focus on growth strategies. Seeking connections in the industry.",
      relationshipGoal: "networking",
      skills: ["digital-marketing", "social-media", "seo", "content-creation"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-yellow-400 to-orange-600",
      industry: "marketing",
      userType: "professional",
      experienceLevel: "intermediate",
      activityScore: 92,
      profileCompleteness: 88,
    },
    {
      id: "user5",
      name: "Michael Lewis",
      age: 35,
      gender: "male",
      interests: ["business", "entrepreneurship", "sports", "reading"],
      location: "Miami",
      country: "United States",
      bio: "Serial entrepreneur with 3 successful exits. Looking to mentor promising startups and founders.",
      relationshipGoal: "networking",
      skills: ["strategy", "entrepreneurship", "leadership", "fundraising"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-red-400 to-pink-600",
      industry: "business",
      userType: "mentor",
      experienceLevel: "expert",
      activityScore: 98,
      profileCompleteness: 100,
    },
    {
      id: "user6",
      name: "Emma Parker",
      age: 26,
      gender: "female",
      interests: ["education", "technology", "reading", "volunteering"],
      location: "Austin",
      country: "United States",
      bio: "EdTech specialist focused on educational innovation. Seeking connections with educators and tech professionals.",
      relationshipGoal: "networking",
      skills: ["edtech", "teaching", "curriculum-dev", "research"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-pink-400 to-rose-600",
      industry: "education",
      userType: "collaborator",
      experienceLevel: "intermediate",
      activityScore: 85,
      profileCompleteness: 92,
    },
    {
      id: "user7",
      name: "James Wilson",
      age: 32,
      gender: "male",
      interests: ["technology", "artificial intelligence", "gaming", "hiking"],
      location: "Seattle",
      country: "United States",
      bio: "AI researcher and engineer with a passion for machine learning applications. Looking to collaborate on innovative projects.",
      relationshipGoal: "networking",
      skills: ["python", "ai", "machine-learning", "algorithms"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-cyan-400 to-blue-600",
      industry: "technology",
      userType: "professional",
      experienceLevel: "expert",
      activityScore: 90,
      profileCompleteness: 94,
    },
    {
      id: "user8",
      name: "Olivia Martinez",
      age: 27,
      gender: "female",
      interests: ["healthcare", "fitness", "nutrition", "travel"],
      location: "Portland",
      country: "United States",
      bio: "Healthcare professional specializing in digital health solutions. Interested in connecting with healthcare innovators.",
      relationshipGoal: "networking",
      skills: ["healthcare-tech", "medicine", "research", "public-health"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-emerald-400 to-green-600",
      industry: "healthcare",
      userType: "professional",
      experienceLevel: "intermediate",
      activityScore: 82,
      profileCompleteness: 88,
    },
    {
      id: "user9",
      name: "Samuel Patel",
      age: 33,
      gender: "male",
      interests: ["finance", "cryptocurrency", "technology", "travel"],
      location: "London",
      country: "United Kingdom",
      bio: "FinTech entrepreneur focused on blockchain solutions. Looking to connect with finance and tech professionals.",
      relationshipGoal: "networking",
      skills: ["fintech", "blockchain", "investment", "strategy"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-blue-500 to-violet-600",
      industry: "finance",
      userType: "founder",
      experienceLevel: "expert",
      activityScore: 94,
      profileCompleteness: 97,
    },
    {
      id: "user10",
      name: "Isabella Wong",
      age: 30,
      gender: "female",
      interests: ["legal", "policy", "technology", "arts"],
      location: "Sydney",
      country: "Australia",
      bio: "Legal tech specialist with expertise in regulatory compliance. Seeking connections with legal and tech professionals.",
      relationshipGoal: "networking",
      skills: ["legal-tech", "compliance", "contracts", "ip-law"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-amber-400 to-orange-600",
      industry: "legal",
      userType: "professional",
      experienceLevel: "expert",
      activityScore: 87,
      profileCompleteness: 91,
    },
    {
      id: "user11",
      name: "Priya Sharma",
      age: 29,
      gender: "female",
      interests: ["technology", "startups", "meditation", "dance"],
      location: "Bangalore",
      country: "India",
      bio: "Software architect with a passion for scalable solutions. Looking to connect with tech enthusiasts and startup founders.",
      relationshipGoal: "networking",
      skills: ["java", "cloud", "system-design", "leadership"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-violet-400 to-purple-600",
      industry: "technology",
      userType: "professional",
      experienceLevel: "expert",
      activityScore: 91,
      profileCompleteness: 89,
      university: "IIT Bombay",
      courseYear: "4th Year",
      projectInterests: ["machine-learning", "web-development", "mobile-app"],
    },
    {
      id: "user12",
      name: "Daniel Park",
      age: 25,
      gender: "male",
      interests: ["marketing", "social media", "photography", "travel"],
      location: "Berlin",
      country: "Germany",
      bio: "Creative marketer specializing in social media strategy. Looking to expand my professional network in Europe.",
      relationshipGoal: "networking",
      skills: ["social-media", "content-creation", "brand-strategy", "analytics"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-pink-400 to-red-600",
      industry: "marketing",
      userType: "collaborator",
      experienceLevel: "intermediate",
      activityScore: 88,
      profileCompleteness: 86,
    },
    {
      id: "user13",
      name: "Rahul Verma",
      age: 21,
      gender: "male",
      interests: ["technology", "coding", "football", "music"],
      location: "Delhi",
      country: "India",
      bio: "Computer Science student passionate about AI and machine learning. Looking for project partners and mentors.",
      relationshipGoal: "networking",
      skills: ["python", "machine-learning", "java", "algorithms"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-blue-400 to-teal-600",
      industry: "technology",
      userType: "student",
      experienceLevel: "beginner",
      activityScore: 75,
      profileCompleteness: 80,
      university: "IIT Delhi",
      courseYear: "3rd Year",
      projectInterests: ["machine-learning", "web-development", "robotics"],
    },
    {
      id: "user14",
      name: "Ananya Patel",
      age: 20,
      gender: "female",
      interests: ["design", "art", "photography", "innovation"],
      location: "Mumbai",
      country: "India",
      bio: "Design student looking for collaboration opportunities on creative projects.",
      relationshipGoal: "networking",
      skills: ["ui-ux", "illustration", "figma", "adobe-suite"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-rose-400 to-pink-600",
      industry: "design",
      userType: "student",
      experienceLevel: "intermediate",
      activityScore: 82,
      profileCompleteness: 85,
      university: "NIT Trichy",
      courseYear: "2nd Year",
      projectInterests: ["ui-ux", "web-development", "mobile-app"],
    },
    {
      id: "user15",
      name: "Vikram Singh",
      age: 22,
      gender: "male",
      interests: ["startups", "entrepreneurship", "basketball", "reading"],
      location: "Bangalore",
      country: "India",
      bio: "Engineering student with a passion for startups. Looking for co-founders and mentors.",
      relationshipGoal: "networking",
      skills: ["business-model", "marketing", "node-js", "react"],
      language: "English",
      imageUrl: "bg-gradient-to-br from-amber-400 to-orange-600",
      industry: "business",
      userType: "student",
      experienceLevel: "beginner",
      activityScore: 78,
      profileCompleteness: 75,
      university: "BITS Pilani",
      courseYear: "4th Year",
      projectInterests: ["web-development", "blockchain", "startup"],
    },
  ];

  return users;
};
