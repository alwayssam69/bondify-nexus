
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight, AlertCircle } from "lucide-react";

interface ProfileCompletionCardProps {
  completion: number;
  suggestedActions: string[];
  className?: string;
  onUpdateProfile?: () => void;
}

const ProfileCompletionCard = ({ 
  completion, 
  suggestedActions = [],
  className,
  onUpdateProfile
}: ProfileCompletionCardProps) => {
  const getCompletionColor = (completion: number) => {
    if (completion < 40) return "text-red-500";
    if (completion < 70) return "text-amber-500";
    return "text-green-500";
  };
  
  const getProgressColor = (completion: number) => {
    if (completion < 40) return "bg-red-500";
    if (completion < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span>Completion</span>
          <span className={`font-medium ${getCompletionColor(completion)}`}>{completion}%</span>
        </div>
        <Progress value={completion} className={`h-2 ${getProgressColor(completion)}`} />
        
        {suggestedActions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Suggested Actions
            </h4>
            <ul className="space-y-2">
              {suggestedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0">
                    <ChevronRight className="h-3 w-3" />
                  </div>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={onUpdateProfile}
            >
              Update Profile
            </Button>
          </div>
        )}
        
        {suggestedActions.length === 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-500" />
              Your Profile
            </h4>
            <p className="text-sm text-muted-foreground">
              Your profile is complete! This helps you get better matches and more connection opportunities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
