export type UserProfile = {
  id: string;
  age: number;
  gender: string;
  interests: string[];
  location: string;
  relationshipGoal: string;
  language: string;
  activityScore: number;
};

type MatchScore = {
  userId: string;
  score: number;
};

// Bucket structure to store users
const userBuckets: { [key: string]: UserProfile[] } = {};

// Assign users to buckets
export function assignToBucket(user: UserProfile) {
  const bucketKey = `${user.age}-${user.location}-${user.relationshipGoal}`;
  if (!userBuckets[bucketKey]) {
    userBuckets[bucketKey] = [];
  }
  userBuckets[bucketKey].push(user);
}

// Find best matches
export function findMatches(currentUser: UserProfile): MatchScore[] {
  const bucketKey = `${currentUser.age}-${currentUser.location}-${currentUser.relationshipGoal}`;
  const potentialMatches = userBuckets[bucketKey] || [];

  const scoredMatches = potentialMatches
    .filter((match) => match.id !== currentUser.id) // Avoid self-match
    .map((match) => {
      let score = 0;

      // Interest Matching
      const commonInterests = match.interests.filter((i) => currentUser.interests.includes(i));
      score += commonInterests.length * 10;

      // Activity Score Boost
      score += match.activityScore * 5;

      // Language Preference
      if (match.language === currentUser.language) score += 15;

      return { userId: match.id, score };
    })
    .sort((a, b) => b.score - a.score); // Sort best matches first

  return scoredMatches;
}
