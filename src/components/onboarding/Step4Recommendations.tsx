
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { User, MapPin, Briefcase, Check, Send } from "lucide-react";
import { ProfileData } from "./Step2Profile";
import { PreferencesData } from "./Step3Preferences";
import { toast } from "sonner";

interface Step4RecommendationsProps {
  profileData: ProfileData;
  preferencesData: PreferencesData;
  onNextStep: () => void;
  onPrevStep: () => void;
}

interface RecommendedMatch {
  id: string;
  name: string;
  profession: string;
  location: string;
  matchPercentage: number;
  avatar?: string;
  skills: string[];
}

const Step4Recommendations = ({
  profileData,
  preferencesData,
  onNextStep,
  onPrevStep,
}: Step4RecommendationsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [recommendedMatches, setRecommendedMatches] = useState<RecommendedMatch[]>([]);
  
  useEffect(() => {
    // Simulate typing effect
    const phrases = [
      "Analyzing your profile...",
      "Finding professionals that match your interests...",
      "Discovering connections in " + profileData.location + "...",
      "Looking for experts in " + profileData.industry + "...",
      "Finalizing your personalized recommendations...",
    ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const type = () => {
      if (currentPhraseIndex >= phrases.length) {
        // Finished typing all phrases, load matches
        setIsLoading(false);
        loadRecommendedMatches();
        return;
      }
      
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (currentCharIndex < currentPhrase.length) {
        setTypingText(currentPhrase.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        timeoutId = setTimeout(type, 50);
      } else {
        // Move to the next phrase after a delay
        timeoutId = setTimeout(() => {
          currentPhraseIndex++;
          currentCharIndex = 0;
          timeoutId = setTimeout(type, 100);
        }, 800);
      }
    };
    
    timeoutId = setTimeout(type, 300);
    
    return () => clearTimeout(timeoutId);
  }, [profileData]);
  
  const loadRecommendedMatches = () => {
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
      
      setRecommendedMatches(matches);
    }, 800);
  };
  
  const handleConnect = (match: RecommendedMatch) => {
    toast.success(`Connection request sent to ${match.name}`);
  };
  
  const handleMessage = (match: RecommendedMatch) => {
    toast.success(`Message panel opened for ${match.name}`);
  };
  
  const handleCompleteTour = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      onNextStep();
    } catch (error) {
      console.error("Step 4 error:", error);
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-16 h-16 mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary border-opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <motion.div
            className="text-lg font-medium text-center mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {typingText}
          </motion.div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Recommended Connections</h3>
            <p className="text-muted-foreground">
              Based on your profile and preferences, we found these professionals for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedMatches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-primary/30 to-primary/10 h-24" />
                      <Avatar className="absolute bottom-0 left-4 transform translate-y-1/2 w-16 h-16 border-4 border-background">
                        <AvatarImage src={match.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {match.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute top-4 right-4 bg-primary/90 text-white text-sm py-1 px-2 rounded-full">
                        {match.matchPercentage}% Match
                      </div>
                    </div>
                    
                    <div className="pt-12 pb-4 px-4">
                      <h4 className="font-medium text-lg">{match.name}</h4>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{match.profession}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{match.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {match.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleConnect(match)}
                        >
                          <Check className="h-4 w-4" />
                          Connect
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handleMessage(match)}
                        >
                          <Send className="h-4 w-4" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button 
              onClick={handleCompleteTour}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <motion.div className="flex items-center">
                  <span className="mr-2">Setting up dashboard</span>
                  <span className="relative flex h-2 w-12">
                    <motion.span
                      className="absolute h-full w-1/4 bg-white rounded-full"
                      animate={{ x: [0, 36, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    />
                  </span>
                </motion.div>
              ) : (
                "Complete & Go to Dashboard"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Recommendations;
