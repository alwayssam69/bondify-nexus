
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  matchPercentage: number;
  interests: string[];
  imageBg: string;
  delay?: number;
}

const MatchCard: React.FC<MatchCardProps> = ({
  name,
  age,
  location,
  matchPercentage,
  interests,
  imageBg,
  delay = 0,
}) => {
  const initial = name.charAt(0);
  
  return (
    <div 
      className={cn(
        "card-glass rounded-xl overflow-hidden hover:translate-y-[-4px]",
        "opacity-0 animate-scale-in"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className={`${imageBg} h-48 flex items-center justify-center`}>
        <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-3xl font-light text-white">
          {initial}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{name}, {age}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {matchPercentage}% Match
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {interests.map((interest, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
            >
              {interest}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="w-1/2 rounded-lg">Profile</Button>
          <Button size="sm" className="w-1/2 rounded-lg">Connect</Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
