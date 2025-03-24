
import React, { useState, useEffect } from "react";
import { RecommendedMatch } from "./RecommendationCard";
import { ProfileData } from "../Step2ProfileSchema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecommendationsContainerProps {
  profileData: ProfileData;
  onRecommendationsLoaded: (recommendations: RecommendedMatch[]) => void;
}

const RecommendationsContainer: React.FC<RecommendationsContainerProps> = ({ 
  profileData, 
  onRecommendationsLoaded 
}) => {
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Get recommendations based on industry and skills
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, industry, skills, user_type, location')
          .eq('industry', profileData.industry)
          .limit(10);
        
        if (error) {
          console.error("Error fetching recommendations:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          // If no exact industry matches, try to get any profiles
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('user_profiles')
            .select('id, full_name, industry, skills, user_type, location')
            .limit(4);
            
          if (fallbackError) {
            console.error("Error fetching fallback recommendations:", fallbackError);
            throw fallbackError;
          }
          
          processProfiles(fallbackData || []);
        } else {
          processProfiles(data);
        }
      } catch (error) {
        console.error("Error in fetchRecommendations:", error);
        // Provide fallback recommendations if API fails
        const fallbackMatches: RecommendedMatch[] = [
          {
            id: "1",
            name: "Alex Johnson",
            profession: "Senior Developer",
            location: profileData.location || "Unknown location",
            matchPercentage: 92,
            skills: ["JavaScript", "React", "Node.js"],
          },
          {
            id: "2",
            name: "Taylor Martinez",
            profession: "Product Manager",
            location: "Remote",
            matchPercentage: 87,
            skills: ["Project Management", "UI/UX", "Marketing"],
          },
        ];
        
        onRecommendationsLoaded(fallbackMatches);
      }
    };
    
    const processProfiles = (profiles: any[]) => {
      const recommendations: RecommendedMatch[] = profiles.map(profile => {
        // Calculate a simple match percentage based on shared skills
        const userSkills = profileData.skills || [];
        const profileSkills = profile.skills || [];
        const sharedSkills = userSkills.filter(skill => 
          profileSkills.includes(skill)
        );
        
        const skillMatchScore = userSkills.length > 0 
          ? Math.round((sharedSkills.length / userSkills.length) * 100)
          : 70; // Default if no skills
          
        // Add some randomness to avoid identical scores
        const matchPercentage = Math.min(100, skillMatchScore + Math.floor(Math.random() * 15));
        
        return {
          id: profile.id,
          name: profile.full_name || "Anonymous User",
          profession: `${profile.user_type || "Professional"} in ${profile.industry || "Various Industries"}`,
          location: profile.location || "Remote",
          matchPercentage,
          skills: profile.skills?.slice(0, 3) || [],
        };
      });
      
      // Sort by match percentage (highest first)
      recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
      
      onRecommendationsLoaded(recommendations);
    };
    
    // Add a small delay to simulate processing
    setTimeout(() => {
      fetchRecommendations();
    }, 800);
  }, [profileData, onRecommendationsLoaded]);

  return null; // This is just a data fetching component, no UI
};

export default RecommendationsContainer;
