export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  interests: string[];
  location: string;
  relationshipGoal: string;
  language: string;
  activityScore: number;
  imageUrl?: string;
  bio?: string;
  skills?: string[];
  profileCompleteness?: number;
  dailySwipes?: number;
  maxDailySwipes?: number;
  matchScore?: number;
  distance?: number;
  // Professional networking fields
  userType?: string;
  industry?: string;
  experienceLevel?: string;
  networkingGoals?: string[];
  communicationPreference?: string;
  availability?: string;
  lastActive?: Date;
  remoteNetworking?: boolean;
  locationPreference?: string;
  verified?: boolean;
  // Location data (latitude/longitude)
  latitude?: number;
  longitude?: number;
  // Saved status
  saved?: boolean;
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

export function loadSampleUsers() {
  const sampleUsers: UserProfile[] = [
    { 
      id: "1", 
      name: "Alex Johnson",
      age: 28, 
      gender: "male", 
      interests: ["startups", "technology", "investing", "hiking"], 
      location: "New York", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 80,
      imageUrl: "bg-gradient-to-br from-blue-400 to-indigo-600",
      bio: "Startup founder with 5 years of experience in fintech. Looking to connect with developers and potential investors.",
      skills: ["product management", "fundraising", "market analysis"],
      profileCompleteness: 90,
      userType: "founder",
      industry: "technology",
      experienceLevel: "intermediate",
      networkingGoals: ["finding co-founders", "seeking investment", "mentorship"],
      communicationPreference: "video calls",
      availability: "evenings",
      lastActive: new Date(),
      remoteNetworking: true,
      verified: true
    },
    { 
      id: "2", 
      name: "Taylor Morrison",
      age: 34, 
      gender: "female", 
      interests: ["venture capital", "AI", "SaaS", "travel"], 
      location: "San Francisco", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 90,
      imageUrl: "bg-gradient-to-br from-pink-400 to-purple-600",
      bio: "Angel investor with focus on early-stage tech startups. Previously founded and exited a SaaS company.",
      skills: ["investing", "business strategy", "scaling"],
      profileCompleteness: 95,
      userType: "investor",
      industry: "finance",
      experienceLevel: "expert",
      networkingGoals: ["finding startups to invest", "mentoring founders"],
      communicationPreference: "in-depth discussions",
      availability: "flexible",
      lastActive: new Date(),
      verified: true
    },
    { 
      id: "3", 
      name: "Jamie Chen",
      age: 23, 
      gender: "non-binary", 
      interests: ["design", "UX/UI", "startups", "music"], 
      location: "San Francisco", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 75,
      imageUrl: "bg-gradient-to-br from-green-400 to-teal-600",
      bio: "UI/UX designer with passion for creating intuitive user experiences. Looking to join an early-stage startup.",
      skills: ["UI design", "prototyping", "user research"],
      profileCompleteness: 85,
      userType: "professional",
      industry: "design",
      experienceLevel: "intermediate",
      networkingGoals: ["finding job opportunities", "meeting startup founders"],
      communicationPreference: "casual chat",
      availability: "weekdays",
      lastActive: new Date()
    },
    { 
      id: "4", 
      name: "Morgan Smith",
      age: 26, 
      gender: "female", 
      interests: ["programming", "open source", "AI/ML", "coffee"], 
      location: "Seattle", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 85,
      imageUrl: "bg-gradient-to-br from-purple-400 to-indigo-600",
      bio: "Software engineer specializing in machine learning and AI. Looking for collaborators on open-source projects.",
      skills: ["Python", "TensorFlow", "React", "cloud computing"],
      profileCompleteness: 90,
      userType: "collaborator",
      industry: "technology",
      experienceLevel: "expert",
      networkingGoals: ["collaborating on projects", "knowledge exchange", "mentorship"],
      communicationPreference: "in-depth discussions",
      availability: "evenings",
      lastActive: new Date(),
      remoteNetworking: true
    },
    { 
      id: "5", 
      name: "Jordan Lee",
      age: 38, 
      gender: "male", 
      interests: ["entrepreneurship", "marketing", "growth hacking", "travel"], 
      location: "Los Angeles", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 95,
      imageUrl: "bg-gradient-to-br from-yellow-400 to-orange-600",
      bio: "Serial entrepreneur with 3 successful exits. Now mentoring first-time founders and advising startups.",
      skills: ["business development", "fundraising", "marketing strategy"],
      profileCompleteness: 100,
      userType: "mentor",
      industry: "business",
      experienceLevel: "expert",
      networkingGoals: ["mentoring entrepreneurs", "advisory roles"],
      communicationPreference: "video calls",
      availability: "flexible",
      lastActive: new Date(),
      verified: true
    },
    { 
      id: "6", 
      name: "Casey Rivera",
      age: 25, 
      gender: "female", 
      interests: ["digital marketing", "content creation", "social media", "startups"], 
      location: "Miami", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 88,
      imageUrl: "bg-gradient-to-br from-red-400 to-pink-600",
      bio: "Digital marketing specialist with focus on growth strategies for early-stage startups.",
      skills: ["SEO", "content strategy", "social media management"],
      profileCompleteness: 85,
      userType: "professional",
      industry: "marketing",
      experienceLevel: "intermediate",
      networkingGoals: ["finding clients", "knowledge exchange"],
      communicationPreference: "casual chat",
      availability: "weekdays",
      lastActive: new Date()
    },
    { 
      id: "7", 
      name: "Riley Wilson",
      age: 30, 
      gender: "male", 
      interests: ["finance", "blockchain", "investing", "reading"], 
      location: "Chicago", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 70,
      imageUrl: "bg-gradient-to-br from-gray-500 to-gray-700",
      bio: "Finance professional with expertise in blockchain and cryptocurrency investments.",
      skills: ["financial analysis", "crypto investing", "risk management"],
      profileCompleteness: 95,
      userType: "professional",
      industry: "finance",
      experienceLevel: "expert",
      networkingGoals: ["finding partners", "knowledge exchange"],
      communicationPreference: "in-depth discussions",
      availability: "evenings",
      lastActive: new Date()
    },
    { 
      id: "8", 
      name: "Avery Thompson",
      age: 22, 
      gender: "non-binary", 
      interests: ["coding", "web3", "gaming", "startups"], 
      location: "Austin", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 92,
      imageUrl: "bg-gradient-to-br from-blue-500 to-purple-700",
      bio: "Computer science student looking for internships in web3 and blockchain projects.",
      skills: ["JavaScript", "Solidity", "React"],
      profileCompleteness: 80,
      userType: "student",
      industry: "technology",
      experienceLevel: "beginner",
      networkingGoals: ["finding internships", "learning from experts"],
      communicationPreference: "casual chat",
      availability: "flexible",
      lastActive: new Date()
    },
    { 
      id: "9", 
      name: "Sydney Clark",
      age: 29, 
      gender: "female", 
      interests: ["sustainability", "social impact", "entrepreneurship", "yoga"], 
      location: "Portland", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 75,
      imageUrl: "bg-gradient-to-br from-green-500 to-emerald-700",
      bio: "Social entrepreneur building a sustainability-focused startup. Looking for impact investors and like-minded founders.",
      skills: ["social impact", "sustainability", "fundraising"],
      profileCompleteness: 90,
      userType: "founder",
      industry: "sustainability",
      experienceLevel: "intermediate",
      networkingGoals: ["seeking investment", "finding co-founders"],
      communicationPreference: "video calls",
      availability: "weekdays",
      lastActive: new Date()
    },
    { 
      id: "10", 
      name: "Blake Martinez",
      age: 42, 
      gender: "male", 
      interests: ["venture capital", "SaaS", "enterprise software", "business strategy"], 
      location: "New York", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 83,
      imageUrl: "bg-gradient-to-br from-orange-400 to-red-600",
      bio: "VC partner at a major fund focusing on B2B SaaS investments at Series A and B stages.",
      skills: ["venture capital", "due diligence", "scaling strategies"],
      profileCompleteness: 95,
      userType: "investor",
      industry: "finance",
      experienceLevel: "expert",
      networkingGoals: ["finding startups to invest", "advisory roles"],
      communicationPreference: "in-depth discussions",
      availability: "by appointment",
      lastActive: new Date(),
      verified: true
    }
  ];
  
  sampleUsers.forEach(user => assignToBucket(user));
  return sampleUsers;
}
