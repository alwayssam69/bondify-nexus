
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Check, Send } from "lucide-react";
import { toast } from "sonner";

export interface RecommendedMatch {
  id: string;
  name: string;
  profession: string;
  location: string;
  matchPercentage: number;
  avatar?: string;
  skills: string[];
}

interface RecommendationCardProps {
  match: RecommendedMatch;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ match }) => {
  const handleConnect = () => {
    toast.success(`Connection request sent to ${match.name}`);
  };
  
  const handleMessage = () => {
    toast.success(`Message panel opened for ${match.name}`);
  };

  return (
    <motion.div
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
                onClick={handleConnect}
              >
                <Check className="h-4 w-4" />
                Connect
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleMessage}
              >
                <Send className="h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
