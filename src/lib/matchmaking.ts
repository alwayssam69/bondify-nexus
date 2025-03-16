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
};

export type MatchScore = {
  userId: string;
  score: number;
};

export type SwipeAction = 'like' | 'reject';
export type SwipeHistory = {
  userId: string;
  targetId: string;
  action: SwipeAction;
  timestamp: Date;
};

const userBuckets: { [key: string]: UserProfile[] } = {};
const swipeHistory: SwipeHistory[] = [];

export function assignToBucket(user: UserProfile) {
  const ageGroup = getAgeGroup(user.age);
  const bucketKeys = [
    `${ageGroup}-${user.location}-${user.relationshipGoal}`,
    `${ageGroup}-${user.relationshipGoal}`,
    `${user.location}-${user.relationshipGoal}`
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
  const bucketKeys = [
    `${ageGroup}-${currentUser.location}-${currentUser.relationshipGoal}`,
    `${ageGroup}-${currentUser.relationshipGoal}`,
    `${currentUser.location}-${currentUser.relationshipGoal}`
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
  
  const commonInterests = user2.interests.filter(i => user1.interests.includes(i));
  score += commonInterests.length * 10;
  
  if (user1.skills && user2.skills) {
    const commonSkills = user2.skills.filter(s => user1.skills?.includes(s));
    score += commonSkills.length * 6;
  }
  
  if (user2.location === user1.location) score += 20;
  
  if (user2.relationshipGoal === user1.relationshipGoal) score += 15;
  
  if (user2.language === user1.language) score += 15;
  
  score += Math.min(user2.activityScore / 5, 20);
  
  if (user2.profileCompleteness) {
    score += user2.profileCompleteness / 10;
  }
  
  return Math.min(score, 100);
}

export function recordSwipe(userId: string, targetId: string, action: SwipeAction): void {
  swipeHistory.push({
    userId,
    targetId,
    action,
    timestamp: new Date()
  });
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
        u.relationshipGoal === currentUser.relationshipGoal
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
      age: 22, 
      gender: "male", 
      interests: ["music", "sports", "hiking", "gaming"], 
      location: "New York", 
      relationshipGoal: "dating", 
      language: "English", 
      activityScore: 80,
      imageUrl: "bg-gradient-to-br from-blue-400 to-indigo-600",
      bio: "Music lover and sports enthusiast looking to meet new people",
      skills: ["guitar", "basketball"],
      profileCompleteness: 90,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "2", 
      name: "Taylor Morrison",
      age: 24, 
      gender: "female", 
      interests: ["music", "movies", "photography", "travel"], 
      location: "New York", 
      relationshipGoal: "dating", 
      language: "English", 
      activityScore: 90,
      imageUrl: "bg-gradient-to-br from-pink-400 to-purple-600",
      bio: "Photographer and film buff with a passion for travel",
      skills: ["photography", "languages"],
      profileCompleteness: 95,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "3", 
      name: "Jamie Chen",
      age: 23, 
      gender: "non-binary", 
      interests: ["art", "cooking", "reading", "music"], 
      location: "San Francisco", 
      relationshipGoal: "friendship", 
      language: "English", 
      activityScore: 75,
      imageUrl: "bg-gradient-to-br from-green-400 to-teal-600",
      bio: "Artist and foodie looking for creative connections",
      skills: ["painting", "cooking"],
      profileCompleteness: 85,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "4", 
      name: "Morgan Smith",
      age: 26, 
      gender: "female", 
      interests: ["technology", "coding", "hiking", "coffee"], 
      location: "Seattle", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 85,
      imageUrl: "bg-gradient-to-br from-purple-400 to-indigo-600",
      bio: "Software developer who loves the outdoors and good coffee",
      skills: ["JavaScript", "React", "hiking"],
      profileCompleteness: 90,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "5", 
      name: "Jordan Lee",
      age: 28, 
      gender: "male", 
      interests: ["fitness", "nutrition", "travel", "languages"], 
      location: "Los Angeles", 
      relationshipGoal: "dating", 
      language: "English", 
      activityScore: 95,
      imageUrl: "bg-gradient-to-br from-yellow-400 to-orange-600",
      bio: "Fitness coach with a passion for exploring new cultures",
      skills: ["personal training", "Spanish", "Portuguese"],
      profileCompleteness: 100,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "6", 
      name: "Casey Rivera",
      age: 25, 
      gender: "female", 
      interests: ["music", "dancing", "fashion", "social media"], 
      location: "Miami", 
      relationshipGoal: "friendship", 
      language: "Spanish", 
      activityScore: 88,
      imageUrl: "bg-gradient-to-br from-red-400 to-pink-600",
      bio: "Dancer and fashion enthusiast looking to expand my social circle",
      skills: ["choreography", "styling"],
      profileCompleteness: 85,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "7", 
      name: "Riley Wilson",
      age: 30, 
      gender: "male", 
      interests: ["business", "investing", "reading", "golf"], 
      location: "Chicago", 
      relationshipGoal: "networking", 
      language: "English", 
      activityScore: 70,
      imageUrl: "bg-gradient-to-br from-gray-500 to-gray-700",
      bio: "Entrepreneur looking to connect with like-minded professionals",
      skills: ["finance", "marketing", "public speaking"],
      profileCompleteness: 95,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "8", 
      name: "Avery Thompson",
      age: 22, 
      gender: "non-binary", 
      interests: ["gaming", "anime", "technology", "streaming"], 
      location: "Austin", 
      relationshipGoal: "friendship", 
      language: "English", 
      activityScore: 92,
      imageUrl: "bg-gradient-to-br from-blue-500 to-purple-700",
      bio: "Gamer and tech enthusiast looking for gaming buddies",
      skills: ["game development", "streaming", "video editing"],
      profileCompleteness: 80,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "9", 
      name: "Sydney Clark",
      age: 27, 
      gender: "female", 
      interests: ["environment", "sustainability", "hiking", "yoga"], 
      location: "Portland", 
      relationshipGoal: "dating", 
      language: "English", 
      activityScore: 75,
      imageUrl: "bg-gradient-to-br from-green-500 to-emerald-700",
      bio: "Environmental scientist passionate about sustainable living",
      skills: ["research", "yoga instruction", "gardening"],
      profileCompleteness: 90,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    },
    { 
      id: "10", 
      name: "Blake Martinez",
      age: 29, 
      gender: "male", 
      interests: ["cooking", "food", "travel", "languages"], 
      location: "New York", 
      relationshipGoal: "dating", 
      language: "Spanish", 
      activityScore: 83,
      imageUrl: "bg-gradient-to-br from-orange-400 to-red-600",
      bio: "Chef who loves exploring cuisines around the world",
      skills: ["cooking", "Italian", "French"],
      profileCompleteness: 95,
      dailySwipes: 0,
      maxDailySwipes: 20,
      matchScore: 0
    }
  ];
  
  sampleUsers.forEach(user => assignToBucket(user));
  return sampleUsers;
}
