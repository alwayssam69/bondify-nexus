
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ProfileCompletionCardProps {
  completion: number;
  suggestedActions: string[];
  className?: string;
  onUpdateProfile?: () => void;
}

const ProfileCompletionCard = ({ 
  completion, 
  suggestedActions, 
  className = "",
  onUpdateProfile
}: ProfileCompletionCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Profile Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{completion}% complete</span>
              <span className="text-sm font-medium">
                {completion < 70 ? "Needs attention" : "Looking good!"}
              </span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {completion < 70 
                ? "Complete your profile to increase your chances of finding great matches" 
                : "Your profile is well-completed, but you can still improve it"}
            </p>
            <ul className="space-y-1">
              {suggestedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  {completion < 70 ? (
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-muted-foreground">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={onUpdateProfile} className="w-full">
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
