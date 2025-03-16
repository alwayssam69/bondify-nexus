
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  
  return (
    <>
      <div 
        className={cn(
          "card-glass rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform",
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
            <DialogTitle>{name}, {age}</DialogTitle>
            <DialogDescription>{location}</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className={`${imageBg} h-48 rounded-md flex items-center justify-center`}>
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-3xl font-light text-white">
                {initial}
              </div>
            </div>
            
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
