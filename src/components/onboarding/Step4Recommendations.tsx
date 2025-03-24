
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProfileData } from "./Step2ProfileSchema";
import { PreferencesData } from "./Step3Preferences";
import { toast } from "sonner";
import LoadingAnimation from "./recommendation/LoadingAnimation";
import RecommendationCard, { RecommendedMatch } from "./recommendation/RecommendationCard";
import RecommendationsContainer from "./recommendation/RecommendationsContainer";

interface Step4RecommendationsProps {
  profileData: ProfileData;
  preferencesData: PreferencesData;
  onNextStep: () => void;
  onPrevStep: () => void;
  isLoading?: boolean;
}

const Step4Recommendations = ({
  profileData,
  preferencesData,
  onNextStep,
  onPrevStep,
  isLoading: isAccountCreating = false,
}: Step4RecommendationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendedMatches, setRecommendedMatches] = useState<RecommendedMatch[]>([]);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  const handleRecommendationsLoaded = useCallback((recommendations: RecommendedMatch[]) => {
    setRecommendedMatches(recommendations);
    setIsLoading(false); 
  }, []);

  const handleCompleteTour = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing but make it quick
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
        <>
          <LoadingAnimation 
            profileData={profileData} 
            onLoadComplete={handleLoadComplete} 
          />
          <RecommendationsContainer 
            profileData={profileData}
            onRecommendationsLoaded={handleRecommendationsLoaded}
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Recommended Connections</h3>
            <p className="text-muted-foreground">
              Based on your profile and preferences, we found these professionals for you
            </p>
          </div>
          
          {recommendedMatches.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">
                No recommendations found at this time. You can find more professionals after completing your registration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedMatches.map((match) => (
                <RecommendationCard key={match.id} match={match} />
              ))}
            </div>
          )}
          
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={isProcessing || isAccountCreating}
            >
              Back
            </Button>
            <Button 
              onClick={handleCompleteTour}
              disabled={isProcessing || isAccountCreating}
            >
              {isProcessing || isAccountCreating ? (
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
