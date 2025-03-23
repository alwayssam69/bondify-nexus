
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle } from "lucide-react";

interface ProfileCompletionCardProps {
  completion: number;
  suggestedActions: string[];
  className?: string;
}

const ProfileCompletionCard = ({ 
  completion, 
  suggestedActions,
  className = ""
}: ProfileCompletionCardProps) => {
  // Determine status color based on completion percentage
  const getStatusColor = () => {
    if (completion < 40) return "text-red-500";
    if (completion < 70) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Profile Completion</span>
          <span className={`text-xl font-bold ${getStatusColor()}`}>{completion}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completion} className="h-2" />
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Improve Your Match Quality
          </h3>
          <ul className="space-y-2">
            {suggestedActions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <PlusCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{action}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="w-full mt-2">
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
