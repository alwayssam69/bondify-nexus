
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/matchmaking";

// Add missing functions
export async function getMatchRecommendations(userId: string, limit = 10): Promise<UserProfile[]> {
  try {
    // In a real app, this would use an algorithm to find matches based on interests, goals, etc.
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', userId)
      .limit(limit);
    
    if (error) {
      console.error("Error fetching match recommendations:", error);
      throw error;
    }
    
    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.full_name || 'Anonymous User',
      age: profile.age || Math.floor(Math.random() * 15) + 25,
      location: profile.location || 'Unknown location',
      bio: profile.bio || '',
      relationshipGoal: 'networking',
      skills: profile.skills || [],
      interests: profile.interests || [],
      imageUrl: profile.image_url || '',
      industry: profile.industry || '',
      userType: profile.user_type || '',
      experienceLevel: profile.experience_level || '',
      matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      distance: Math.floor(Math.random() * 50),
      activityScore: profile.activity_score || 75,
      profileCompleteness: profile.profile_completeness || 80,
    }));
  } catch (error) {
    console.error("Error in getMatchRecommendations:", error);
    return generateFallbackMatches();
  }
}

export async function getProximityMatches(userId: string, lat: number, lng: number, radiusKm = 50): Promise<UserProfile[]> {
  try {
    // This is a simplified version - in a real app this would use geospatial queries
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', userId)
      .limit(10);
    
    if (error) {
      console.error("Error fetching proximity matches:", error);
      throw error;
    }
    
    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.full_name || 'Anonymous User',
      age: profile.age || Math.floor(Math.random() * 15) + 25,
      location: profile.location || 'Unknown location',
      bio: profile.bio || '',
      relationshipGoal: 'networking',
      skills: profile.skills || [],
      interests: profile.interests || [],
      imageUrl: profile.image_url || '',
      industry: profile.industry || '',
      userType: profile.user_type || '',
      experienceLevel: profile.experience_level || '',
      matchScore: Math.floor(Math.random() * 30) + 70,
      distance: Math.floor(Math.random() * radiusKm),
      activityScore: profile.activity_score || 75,
      profileCompleteness: profile.profile_completeness || 80,
    }));
  } catch (error) {
    console.error("Error in getProximityMatches:", error);
    return generateFallbackMatches();
  }
}

export async function recordSwipeAction(userId: string, targetId: string, action: 'like' | 'dislike' | 'superlike'): Promise<void> {
  try {
    // Record the swipe action in the database
    const { error } = await supabase
      .from('swipe_actions')
      .insert([
        { 
          user_id: userId, 
          target_id: targetId, 
          action 
        }
      ]);
    
    if (error) {
      console.error("Error recording swipe action:", error);
      throw error;
    }
    
    console.log(`Recorded ${action} from ${userId} to ${targetId}`);
  } catch (error) {
    console.error("Error in recordSwipeAction:", error);
  }
}

export async function getConfirmedMatches(userId: string): Promise<UserProfile[]> {
  try {
    // In a real app, you'd fetch from a matches or connections table
    // For now, we'll fetch from user_profiles excluding the current user
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', userId)
      .limit(5);
    
    if (error) {
      console.error("Error fetching confirmed matches:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No matches found, returning empty array");
      return [];
    }
    
    return data.map(profile => ({
      id: profile.id,
      name: profile.full_name || 'Anonymous User',
      age: profile.age || Math.floor(Math.random() * 15) + 25,
      location: profile.location || 'Unknown location',
      bio: profile.bio || '',
      relationshipGoal: 'networking',
      skills: profile.skills || [],
      interests: profile.interests || [],
      imageUrl: profile.image_url || '',
      industry: profile.industry || '',
      userType: profile.user_type || '',
      experienceLevel: profile.experience_level || '',
      matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      distance: Math.floor(Math.random() * 50),
      activityScore: profile.activity_score || 75,
      profileCompleteness: profile.profile_completeness || 80,
    }));
  } catch (error) {
    console.error("Error in getConfirmedMatches:", error);
    // Return fallback data if there's an error
    return generateFallbackMatches();
  }
}

function generateFallbackMatches(): UserProfile[] {
  const fallbackMatches: UserProfile[] = [
    {
      id: "1",
      name: "Alex Johnson",
      age: 28,
      location: "New York, NY",
      bio: "Senior developer passionate about creating intuitive user experiences",
      relationshipGoal: "networking",
      skills: ["JavaScript", "React", "Node.js"],
      interests: ["Web Development", "UI/UX", "Open Source"],
      imageUrl: "",
      industry: "Technology",
      userType: "Professional",
      experienceLevel: "expert",
      matchScore: 92,
      distance: 5,
      activityScore: 85,
      profileCompleteness: 95,
    },
    {
      id: "2",
      name: "Taylor Martinez",
      age: 32,
      location: "San Francisco, CA",
      bio: "Product manager with a background in design thinking",
      relationshipGoal: "networking",
      skills: ["Product Management", "UX Research", "Agile"],
      interests: ["Product Strategy", "User Testing", "Design"],
      imageUrl: "",
      industry: "Technology",
      userType: "Professional",
      experienceLevel: "expert",
      matchScore: 88,
      distance: 15,
      activityScore: 92,
      profileCompleteness: 90,
    },
    {
      id: "3",
      name: "Jamie Lee",
      age: 26,
      location: "Chicago, IL",
      bio: "UX designer focused on creating accessible digital experiences",
      relationshipGoal: "networking",
      skills: ["UI Design", "Figma", "Prototyping"],
      interests: ["Accessibility", "Inclusive Design", "User Research"],
      imageUrl: "",
      industry: "Design",
      userType: "Professional",
      experienceLevel: "intermediate",
      matchScore: 85,
      distance: 8,
      activityScore: 78,
      profileCompleteness: 85,
    }
  ];
  
  return fallbackMatches;
}
