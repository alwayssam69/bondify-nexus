
import React, { useState, useEffect } from "react";
import { RecommendedMatch } from "./RecommendationCard";
import { ProfileData } from "../Step2ProfileSchema";

interface RecommendationsContainerProps {
  profileData: ProfileData;
  onRecommendationsLoaded: (recommendations: RecommendedMatch[]) => void;
}

const RecommendationsContainer: React.FC<RecommendationsContainerProps> = ({ 
  profileData, 
  onRecommendationsLoaded 
}) => {
  useEffect(() => {
    // In a real app, this would be an API call to get personalized matches
    // Using mock data here
    setTimeout(() => {
      const matches: RecommendedMatch[] = [
        {
          id: "1",
          name: "Alex Johnson",
          profession: "Senior Developer",
          location: profileData.location,
          matchPercentage: 92,
          skills: ["JavaScript", "React", "Node.js"],
        },
        {
          id: "2",
          name: "Taylor Martinez",
          profession: "Product Manager",
          location: "New York, NY",
          matchPercentage: 87,
          skills: ["Project Management", "UI/UX", "Marketing"],
        },
        {
          id: "3",
          name: "Jordan Smith",
          profession: "UX Designer",
          location: profileData.location,
          matchPercentage: 85,
          skills: ["UI/UX", "Figma", "User Research"],
        },
        {
          id: "4",
          name: "Morgan Lewis",
          profession: "Marketing Director",
          location: "Chicago, IL",
          matchPercentage: 78,
          skills: ["Digital Marketing", "Strategy", "Analytics"],
        },
      ];
      
      onRecommendationsLoaded(matches);
    }, 800);
  }, [profileData, onRecommendationsLoaded]);

  return null; // This is just a data fetching component, no UI
};

export default RecommendationsContainer;
