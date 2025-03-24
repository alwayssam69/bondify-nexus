
import React, { useEffect, useState } from "react";
import { RecommendedMatch } from "./RecommendationCard";
import { ProfileData } from "../Step2ProfileSchema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateMatchScore } from "@/lib/matchmaking";

interface RecommendationsContainerProps {
  profileData: ProfileData;
  onRecommendationsLoaded: (recommendations: RecommendedMatch[]) => void;
}

const RecommendationsContainer: React.FC<RecommendationsContainerProps> = ({ 
  profileData, 
  onRecommendationsLoaded 
}) => {
  const [isTimeoutExceeded, setIsTimeoutExceeded] = useState(false);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Set a timeout to ensure we don't load for more than 5 seconds
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => {
            setIsTimeoutExceeded(true);
            reject(new Error('Recommendations fetch timeout'));
          }, 5000);
        });
        
        // Actual fetch logic
        const fetchPromise = async () => {
          try {
            if (!profileData.industry) {
              onRecommendationsLoaded([]);
              return;
            }
            
            // Get profiles matching the industry
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
              
              if (fallbackData && fallbackData.length > 0) {
                processProfiles(fallbackData);
              } else {
                // No profiles found
                onRecommendationsLoaded([]);
              }
            } else {
              processProfiles(data);
            }
          } catch (error) {
            console.error("Error in fetchRecommendations:", error);
            onRecommendationsLoaded([]);
          }
        };
        
        // Race the timeout and the fetch
        await Promise.race([fetchPromise(), timeoutPromise]);
      } catch (error) {
        // If we get here, the timeout was exceeded
        if (isTimeoutExceeded) {
          console.log("Recommendation fetch timeout exceeded");
          onRecommendationsLoaded([]);
        } else {
          console.error("Error in fetchRecommendations:", error);
          onRecommendationsLoaded([]);
        }
      }
    };
    
    const processProfiles = (profiles: any[]) => {
      if (!profiles || profiles.length === 0) {
        onRecommendationsLoaded([]);
        return;
      }
      
      const recommendations: RecommendedMatch[] = profiles.map(profile => {
        // Build a simple userProfile object for match calculation
        const userProfileForMatching = {
          skills: profileData.skills || [],
          interests: [],
          industry: profileData.industry
        };
        
        const otherProfileForMatching = {
          skills: profile.skills || [],
          interests: [],
          industry: profile.industry
        };
        
        // Calculate match score
        const matchPercentage = calculateMatchScore(
          userProfileForMatching, 
          otherProfileForMatching
        );
        
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
    
    // Start fetching immediately, no artificial delay
    fetchRecommendations();
  }, [profileData, onRecommendationsLoaded, isTimeoutExceeded]);

  return null; // This is just a data fetching component, no UI
};

export default RecommendationsContainer;
