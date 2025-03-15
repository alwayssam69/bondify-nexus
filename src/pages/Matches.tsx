import { assignToBucket, findMatches, UserProfile } from '../lib/matchmaking';

// Example user data
const user1: UserProfile = { 
  id: "1", age: 22, gender: "male", interests: ["music", "sports"], 
  location: "New York", relationshipGoal: "serious", language: "English", activityScore: 80 
};

const user2: UserProfile = { 
  id: "2", age: 22, gender: "female", interests: ["music", "movies"], 
  location: "New York", relationshipGoal: "serious", language: "English", activityScore: 90 
};

// Assign users to buckets
assignToBucket(user1);
assignToBucket(user2);

// Find matches
const matches = findMatches(user1);
console.log(matches);

