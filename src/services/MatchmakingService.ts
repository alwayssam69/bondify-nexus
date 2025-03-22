
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/matchmaking";

export interface DatabaseUserProfile {
  id: string;
  full_name: string;
  email: string;
  location: string;
  bio: string | null;
  industry: string | null;
  user_type: string | null;
  experience_level: string | null;
  skills: string[] | null;
  interests: string[] | null;
  university: string | null;
  course_year: string | null;
  networking_goals: string[] | null;
  project_interests: string[] | null;
  profile_photos: string[] | null;
  image_url: string | null;
  activity_score: number | null;
  profile_completeness: number | null;
  created_at: string;
  updated_at: string;
}

export const getMatches = async (userId: string, limit: number = 20): Promise<UserProfile[]> => {
  try {
    // Get current user's profile for matching criteria
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user profile:", userError);
      return [];
    }
    
    // Create basic query for potential matches
    let query = supabase
      .from('user_profiles')
      .select('*')
      .neq('id', userId);
    
    // Apply filters if user profile has data
    if (userProfile) {
      // Filter by industry if user has one
      if (userProfile.industry) {
        query = query.eq('industry', userProfile.industry);
      }
      
      // Filter by university if university networking mode
      if (userProfile.university) {
        query = query.eq('university', userProfile.university);
      }
    }
    
    // Execute the query
    const { data: matchProfiles, error: matchError } = await query.limit(limit);
    
    if (matchError) {
      console.error("Error fetching potential matches:", matchError);
      return [];
    }
    
    if (!matchProfiles || matchProfiles.length === 0) {
      return [];
    }
    
    // Convert database profiles to UserProfile format
    const matches: UserProfile[] = matchProfiles.map((profile: DatabaseUserProfile) => {
      // Calculate match score based on profile similarity
      const matchScore = calculateMatchScore(userProfile, profile);
      
      return {
        id: profile.id,
        name: profile.full_name,
        age: estimateAgeFromExperienceLevel(profile.experience_level), // Placeholder
        gender: "unspecified", // Not stored in our schema
        interests: profile.interests || [],
        location: profile.location,
        bio: profile.bio || "",
        skills: profile.skills || [],
        language: "English", // Default
        imageUrl: profile.image_url || "bg-gradient-to-br from-blue-400 to-indigo-600",
        matchScore: matchScore,
        industry: profile.industry || "",
        userType: profile.user_type || "",
        experienceLevel: profile.experience_level || "",
        activityScore: profile.activity_score || 70,
        profileCompleteness: profile.profile_completeness || 50,
        university: profile.university || "",
        courseYear: profile.course_year || "",
        projectInterests: profile.project_interests || [],
        profilePhotos: profile.profile_photos || [],
        relationshipGoal: "networking", // Default for this app
        networkingGoals: profile.networking_goals || [],
      };
    });
    
    // Sort by match score
    matches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    return matches;
  } catch (error) {
    console.error("Error in getMatches:", error);
    return [];
  }
};

export const recordSwipeAction = async (userId: string, targetId: string, action: string): Promise<boolean> => {
  try {
    // Record the swipe action
    const { error } = await supabase
      .from('user_swipes')
      .insert({
        user_id: userId,
        target_id: targetId,
        action: action
      });
    
    if (error) {
      console.error("Error recording swipe:", error);
      return false;
    }
    
    // If the action is 'like', check if the other person has liked too
    if (action === 'like') {
      const { data, error: matchError } = await supabase
        .from('user_swipes')
        .select('*')
        .eq('user_id', targetId)
        .eq('target_id', userId)
        .eq('action', 'like')
        .single();
      
      // If there's a mutual like, create a match
      if (!matchError && data) {
        const { error: createMatchError } = await supabase
          .from('user_matches')
          .insert([
            {
              user_id: userId,
              matched_user_id: targetId,
              status: 'matched'
            },
            {
              user_id: targetId,
              matched_user_id: userId,
              status: 'matched'
            }
          ]);
        
        if (createMatchError) {
          console.error("Error creating match:", createMatchError);
          return false;
        }
        
        return true; // Match created
      }
    }
    
    return false; // No match yet
  } catch (error) {
    console.error("Error in recordSwipeAction:", error);
    return false;
  }
};

export const getUserMatches = async (userId: string): Promise<UserProfile[]> => {
  try {
    // Get all matched users
    const { data, error } = await supabase
      .from('user_matches')
      .select('matched_user_id')
      .eq('user_id', userId)
      .eq('status', 'matched');
    
    if (error) {
      console.error("Error fetching matches:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get matched user profiles
    const matchedUserIds = data.map(match => match.matched_user_id);
    const { data: matchedProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', matchedUserIds);
    
    if (profilesError) {
      console.error("Error fetching matched profiles:", profilesError);
      return [];
    }
    
    // Convert to UserProfile format
    return matchedProfiles.map((profile: DatabaseUserProfile) => ({
      id: profile.id,
      name: profile.full_name,
      age: estimateAgeFromExperienceLevel(profile.experience_level),
      gender: "unspecified",
      interests: profile.interests || [],
      location: profile.location,
      bio: profile.bio || "",
      skills: profile.skills || [],
      language: "English",
      imageUrl: profile.image_url || "bg-gradient-to-br from-blue-400 to-indigo-600",
      matchScore: 100, // These are confirmed matches
      industry: profile.industry || "",
      userType: profile.user_type || "",
      experienceLevel: profile.experience_level || "",
      activityScore: profile.activity_score || 70,
      profileCompleteness: profile.profile_completeness || 50,
      university: profile.university || "",
      courseYear: profile.course_year || "",
      projectInterests: profile.project_interests || [],
      profilePhotos: profile.profile_photos || [],
      relationshipGoal: "networking",
      networkingGoals: profile.networking_goals || [],
    }));
  } catch (error) {
    console.error("Error in getUserMatches:", error);
    return [];
  }
};

export const getSavedProfiles = async (userId: string): Promise<UserProfile[]> => {
  try {
    // Get all saved profiles (user_swipes with action 'save')
    const { data, error } = await supabase
      .from('user_swipes')
      .select('target_id')
      .eq('user_id', userId)
      .eq('action', 'save');
    
    if (error) {
      console.error("Error fetching saved profiles:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get saved user profiles
    const savedUserIds = data.map(swipe => swipe.target_id);
    const { data: savedProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', savedUserIds);
    
    if (profilesError) {
      console.error("Error fetching saved profiles:", profilesError);
      return [];
    }
    
    // Convert to UserProfile format (similar to getUserMatches)
    return savedProfiles.map((profile: DatabaseUserProfile) => ({
      id: profile.id,
      name: profile.full_name,
      age: estimateAgeFromExperienceLevel(profile.experience_level),
      gender: "unspecified",
      interests: profile.interests || [],
      location: profile.location,
      bio: profile.bio || "",
      skills: profile.skills || [],
      language: "English",
      imageUrl: profile.image_url || "bg-gradient-to-br from-blue-400 to-indigo-600",
      industry: profile.industry || "",
      userType: profile.user_type || "",
      experienceLevel: profile.experience_level || "",
      activityScore: profile.activity_score || 70,
      profileCompleteness: profile.profile_completeness || 50,
      university: profile.university || "",
      courseYear: profile.course_year || "",
      projectInterests: profile.project_interests || [],
      profilePhotos: profile.profile_photos || [],
      relationshipGoal: "networking",
      networkingGoals: profile.networking_goals || [],
    }));
  } catch (error) {
    console.error("Error in getSavedProfiles:", error);
    return [];
  }
};

// Helper function to calculate match score based on profile similarity
const calculateMatchScore = (userProfile: any, otherProfile: any): number => {
  if (!userProfile || !otherProfile) return 0;
  
  let score = 0;
  
  // Industry match
  if (userProfile.industry && otherProfile.industry && userProfile.industry === otherProfile.industry) {
    score += 20;
  }
  
  // Experience level match
  if (userProfile.experience_level && otherProfile.experience_level) {
    if (userProfile.experience_level === otherProfile.experience_level) {
      score += 10;
    }
  }
  
  // Skills match
  if (userProfile.skills && otherProfile.skills) {
    const commonSkills = otherProfile.skills.filter((skill: string) => 
      userProfile.skills.includes(skill)
    );
    score += commonSkills.length * 5;
  }
  
  // Interests match
  if (userProfile.interests && otherProfile.interests) {
    const commonInterests = otherProfile.interests.filter((interest: string) => 
      userProfile.interests.includes(interest)
    );
    score += commonInterests.length * 5;
  }
  
  // University match
  if (userProfile.university && otherProfile.university && userProfile.university === otherProfile.university) {
    score += 15;
  }
  
  // Project interests match
  if (userProfile.project_interests && otherProfile.project_interests) {
    const commonProjectInterests = otherProfile.project_interests.filter((interest: string) => 
      userProfile.project_interests.includes(interest)
    );
    score += commonProjectInterests.length * 5;
  }
  
  // Location match
  if (userProfile.location === otherProfile.location) {
    score += 10;
  }
  
  // Add profile completeness bonus
  if (otherProfile.profile_completeness) {
    score += otherProfile.profile_completeness / 10;
  }
  
  // Cap at 100
  return Math.min(score, 100);
};

// Helper function to estimate age based on experience level
const estimateAgeFromExperienceLevel = (experienceLevel: string | null): number => {
  switch (experienceLevel) {
    case 'beginner':
      return 20 + Math.floor(Math.random() * 5);
    case 'intermediate':
      return 25 + Math.floor(Math.random() * 5);
    case 'expert':
      return 30 + Math.floor(Math.random() * 10);
    default:
      return 25 + Math.floor(Math.random() * 10);
  }
};
