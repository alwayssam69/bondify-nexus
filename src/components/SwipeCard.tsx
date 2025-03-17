
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, BookmarkPlus, Send, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/lib/matchmaking";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SwipeCardProps {
  profile: UserProfile;
  onSwipe: (profileId: string, action: 'like' | 'reject' | 'save') => void;
  onSendIntro: (profileId: string, message: string) => void;
  isActive: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe, onSendIntro, isActive }) => {
  const [introMessage, setIntroMessage] = useState("");
  const [introDialogOpen, setIntroDialogOpen] = useState(false);
  
  // Calculate distance if available
  const distanceText = profile.distance ? 
    `${profile.distance < 1 ? 'Less than 1' : Math.round(profile.distance)} km away` : 
    null;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIntroDialogOpen(true);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe(profile.id, 'reject');
  };
  
  const handleSaveForLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSwipe(profile.id, 'save');
    toast.success(`${profile.name} saved for later!`);
  };
  
  const handleSendIntro = () => {
    if (introMessage.trim()) {
      onSendIntro(profile.id, introMessage.trim());
      onSwipe(profile.id, 'like');
      setIntroDialogOpen(false);
      setIntroMessage("");
      toast.success(`Intro message sent to ${profile.name}`);
    } else {
      onSwipe(profile.id, 'like');
      setIntroDialogOpen(false);
    }
  };

  // Calculate match percentage (based on the profile's matchScore property if available)
  const matchPercentage = profile.matchScore !== undefined ? Math.floor(profile.matchScore) : 85;

  // Function to get a valid badge variant based on index
  const getBadgeVariant = (index: number): "info" | "purple" | "teal" | "pink" | "indigo" => {
    const variants: Array<"info" | "purple" | "teal" | "pink" | "indigo"> = [
      "info", "purple", "teal", "pink", "indigo"
    ];
    return variants[index % variants.length];
  };

  // Function to get a valid badge variant for skills
  const getSkillBadgeVariant = (index: number): "success" | "warning" | "info" | "purple" | "teal" => {
    const variants: Array<"success" | "warning" | "info" | "purple" | "teal"> = [
      "success", "warning", "info", "purple", "teal"
    ];
    return variants[index % variants.length];
  };

  return (
    <>
      <motion.div
        className={`w-full max-w-md mx-auto absolute ${isActive ? 'z-10' : 'z-0'}`}
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: isActive ? 1 : 0.95, opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="overflow-hidden shadow-lg">
          <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-400 to-indigo-600'} h-64 relative`}>
            <Badge 
              variant="gradient" 
              animation="pulse" 
              className="absolute top-3 right-3"
            >
              {matchPercentage}% Match
            </Badge>
            {distanceText && (
              <Badge 
                variant="info" 
                className="absolute top-3 left-3 flex items-center gap-1"
              >
                <MapPin size={12} />
                {distanceText}
              </Badge>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h3 className="text-xl font-semibold">{profile.name}, {profile.age}</h3>
              <p className="text-sm opacity-90">{profile.location}</p>
            </div>
          </div>
          <CardContent className="p-4">
            {profile.bio && (
              <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>
            )}
            
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-1">INTERESTS</h4>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((interest, idx) => (
                  <Badge 
                    key={idx}
                    variant={getBadgeVariant(idx)}
                    className="text-xs"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 mb-1">SKILLS</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, idx) => (
                    <Badge 
                      key={idx}
                      variant={getSkillBadgeVariant(idx)}
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <Button 
                onClick={handleReject}
                variant="outline" 
                className="h-12 rounded-full border-2 border-gray-300 transition-transform hover:scale-105"
              >
                <X className="text-gray-500" size={20} />
                <span className="ml-1">Pass</span>
              </Button>
              
              <Button 
                onClick={handleSaveForLater}
                variant="outline"
                className="h-12 rounded-full border-2 border-amber-300 text-amber-600 transition-transform hover:scale-105 hover:bg-amber-50"
              >
                <BookmarkPlus size={20} />
                <span className="ml-1">Save</span>
              </Button>
              
              <Button 
                onClick={handleLike}
                className="h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-transform hover:scale-105"
              >
                <Heart size={20} />
                <span className="ml-1">Connect</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <Dialog open={introDialogOpen} onOpenChange={setIntroDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send an intro to {profile.name}</DialogTitle>
            <DialogDescription>
              Make a great first impression with a personalized message!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={introMessage}
              onChange={(e) => setIntroMessage(e.target.value)}
              placeholder={`Hi ${profile.name}! I noticed we both share an interest in ${profile.interests[0]}...`}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onSwipe(profile.id, 'like');
                setIntroDialogOpen(false);
              }}
            >
              Connect without message
            </Button>
            <Button 
              type="button" 
              onClick={handleSendIntro}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SwipeCard;
