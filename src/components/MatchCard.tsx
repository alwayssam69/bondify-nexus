
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, MessageCircle, MapPin, Briefcase, Clock, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export interface MatchCardProps {
  name: string;
  age: number;
  location: string;
  matchPercentage: number;
  interests: string[];
  imageBg: string;
  delay?: number;
  userType?: string;
  industry?: string;
  experienceLevel?: string;
  networkingGoals?: string[];
  skills?: string[];
  verified?: boolean;
  bio?: string;
  availability?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  name,
  age,
  location,
  matchPercentage,
  interests,
  imageBg,
  delay = 0,
  userType,
  industry,
  experienceLevel,
  networkingGoals,
  skills,
  verified = false,
  bio,
  availability,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const initial = name.charAt(0);
  
  const handleConnect = () => {
    setIsConnected(true);
    toast.success(`Connection request sent to ${name}!`);
  };
  
  const handleViewProfile = () => {
    setIsProfileOpen(true);
  };
  
  // Format the user type for display
  const formatUserType = (type?: string) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Format the experience level for display
  const formatExperienceLevel = (level?: string) => {
    if (!level) return "";
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <>
      <div 
        className={cn(
          "card-glass rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform",
          "opacity-0 animate-scale-in"
        )}
        style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      >
        <div className={`${imageBg} h-48 flex items-center justify-center relative`}>
          <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-3xl font-light text-white">
            {initial}
          </div>
          {verified && (
            <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <Award className="h-3.5 w-3.5 mr-1" />
              Verified
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{name}, {age}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {location}
              </div>
            </div>
            <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {matchPercentage}% Match
            </div>
          </div>
          
          {(userType || industry) && (
            <div className="mb-3">
              {userType && (
                <div className="flex items-center text-sm mb-1">
                  <Briefcase className="h-3.5 w-3.5 mr-1 text-blue-600" />
                  <span>{formatUserType(userType)}</span>
                  {industry && <span className="mx-1">•</span>}
                  {industry && <span>{industry}</span>}
                </div>
              )}
              {experienceLevel && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  {formatExperienceLevel(experienceLevel)} Level
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mb-4">
            {interests.slice(0, 3).map((interest, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
              >
                {interest}
              </span>
            ))}
            {interests.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full text-muted-foreground">
                +{interests.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-1/2 rounded-lg"
              onClick={handleViewProfile}
            >
              <Eye className="mr-1 h-4 w-4" />
              Profile
            </Button>
            <Button 
              size="sm" 
              className={`w-1/2 rounded-lg ${isConnected ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? 'Connected' : (
                <>
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {name}, {age}
              {verified && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-800">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  Verified
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {location}
              {availability && (
                <span className="ml-3 flex items-center text-xs">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Available: {availability}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className={`${imageBg} h-48 rounded-md flex items-center justify-center`}>
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-3xl font-light text-white">
                {initial}
              </div>
            </div>
            
            {(userType || industry || experienceLevel) && (
              <div>
                <h4 className="text-sm font-medium mb-1">Professional Info</h4>
                <div className="space-y-1">
                  {userType && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-3.5 w-3.5 mr-1 text-blue-600" />
                      <span>{formatUserType(userType)}</span>
                    </div>
                  )}
                  {industry && (
                    <div className="flex items-center text-sm">
                      <span className="ml-5">{industry}</span>
                    </div>
                  )}
                  {experienceLevel && (
                    <div className="flex items-center text-sm">
                      <Award className="h-3.5 w-3.5 mr-1 text-blue-600" />
                      <span>{formatExperienceLevel(experienceLevel)} Level</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {bio && (
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm text-muted-foreground">{bio}</p>
              </div>
            )}
            
            {networkingGoals && networkingGoals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Networking Goals</h4>
                <div className="flex flex-wrap gap-1">
                  {networkingGoals.map((goal, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-800 rounded-full"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-1">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            {skills && skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 bg-green-50 text-green-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-2">
              <h4 className="text-sm font-medium">Match Score</h4>
              <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1">
                {matchPercentage}% Match
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? 'Connected' : 'Connect Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchCard;
