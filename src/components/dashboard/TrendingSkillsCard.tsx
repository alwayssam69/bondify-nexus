
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Code, LineChart, Brain, Database, Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TrendingSkillsCardProps {
  industry: string;
  className?: string;
}

const TrendingSkillsCard = ({ industry, className = "" }: TrendingSkillsCardProps) => {
  // These would come from your API based on the user's industry
  const getTrendingSkills = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'technology':
        return [
          { name: "Machine Learning", demand: 92, icon: <Brain className="h-4 w-4 text-purple-500" /> },
          { name: "Cloud Architecture", demand: 89, icon: <Database className="h-4 w-4 text-blue-500" /> },
          { name: "React", demand: 85, icon: <Code className="h-4 w-4 text-cyan-500" /> },
          { name: "Data Science", demand: 82, icon: <LineChart className="h-4 w-4 text-green-500" /> },
          { name: "Cybersecurity", demand: 78, icon: <Globe className="h-4 w-4 text-red-500" /> },
        ];
      case 'finance':
        return [
          { name: "Blockchain", demand: 88, icon: <Database className="h-4 w-4 text-blue-500" /> },
          { name: "Financial Analysis", demand: 85, icon: <LineChart className="h-4 w-4 text-green-500" /> },
          { name: "Risk Management", demand: 83, icon: <Brain className="h-4 w-4 text-red-500" /> },
          { name: "RegTech", demand: 79, icon: <Code className="h-4 w-4 text-purple-500" /> },
          { name: "ESG Investing", demand: 76, icon: <Globe className="h-4 w-4 text-amber-500" /> },
        ];
      default:
        return [
          { name: "Digital Marketing", demand: 90, icon: <Globe className="h-4 w-4 text-blue-500" /> },
          { name: "Project Management", demand: 87, icon: <LineChart className="h-4 w-4 text-green-500" /> },
          { name: "Data Analysis", demand: 85, icon: <Database className="h-4 w-4 text-purple-500" /> },
          { name: "Content Creation", demand: 82, icon: <Code className="h-4 w-4 text-red-500" /> },
          { name: "Public Speaking", demand: 78, icon: <Brain className="h-4 w-4 text-amber-500" /> },
        ];
    }
  };

  const trendingSkills = getTrendingSkills(industry);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Trending Skills in {industry}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingSkills.map((skill, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {skill.icon}
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {skill.demand}% demand
                </span>
              </div>
              <Progress value={skill.demand} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingSkillsCard;
