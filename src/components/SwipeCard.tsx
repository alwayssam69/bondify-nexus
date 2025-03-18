
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, BookmarkPlus, Send, MapPin, Award, Briefcase, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/lib/matchmaking";
import { Badge } from "@/components/ui/badge";
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
  const getBadgeVariant = (index: number): "default" | "secondary" | "outline" | "destructive" => {
    const variants: Array<"default" | "secondary" | "outline" | "destructive"> = [
      "default", "secondary", "outline", "destructive"
    ];
    return variants[index % variants.length];
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.2 } 
    }
  };

  // Button animations
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <>
      <motion.div
        className={`w-full max-w-md mx-auto absolute ${isActive ? 'z-10' : 'z-0'}`}
        initial="hidden"
        animate={isActive ? "visible" : { scale: 0.95, opacity: 0.5 }}
        exit="exit"
        variants={cardVariants}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="overflow-hidden shadow-xl border border-border/40 bg-background/90 backdrop-blur">
          <div className={`${profile.imageUrl || 'bg-gradient-to-br from-blue-400 to-indigo-600'} h-72 relative`}>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Badge 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md"
              >
                {matchPercentage}% Match
              </Badge>
              
              {profile.experienceLevel && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 shadow-md"
                >
                  <Award size={12} />
                  {profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)}
                </Badge>
              )}
            </div>
            
            {distanceText && (
              <Badge 
                variant="outline" 
                className="absolute top-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm shadow-md"
              >
                <MapPin size={12} />
                {distanceText}
              </Badge>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
                  <div className="flex items-center gap-1 mt-1 text-white/90">
                    <MapPin size={14} className="text-blue-300" />
                    <p className="text-sm">{profile.location}{profile.country ? `, ${profile.country}` : ''}</p>
                  </div>
                </div>
                
                {profile.industry && (
                  <Badge 
                    variant="outline" 
                    className="bg-primary/20 border-primary/40 text-white"
                  >
                    {profile.industry.charAt(0).toUpperCase() + profile.industry.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <CardContent className="p-5">
            {profile.bio && (
              <div className="mb-4 bg-muted/30 p-3 rounded-lg relative">
                <p className="text-sm text-foreground/90 italic">{profile.bio}</p>
                <div className="absolute -top-2 -left-2 bg-background p-1 rounded-full">
                  <Sparkles size={16} className="text-amber-500" />
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {profile.userType && (
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  <span className="text-sm font-medium">
                    {profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)}
                  </span>
                </div>
              )}
              
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Globe size={14} className="text-emerald-500" />
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map((interest, idx) => (
                    <Badge 
                      key={idx}
                      variant={getBadgeVariant(idx)}
                      className="text-xs bg-primary/10 hover:bg-primary/20 text-foreground border-primary/30"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Award size={14} className="text-amber-500" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="text-xs border-indigo-300/50 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6 gap-3">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-1/3">
                <Button 
                  onClick={handleReject}
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-border/60 bg-background/80 hover:bg-muted/30 transition-all"
                >
                  <X className="text-muted-foreground mr-1" size={18} />
                  <span>Pass</span>
                </Button>
              </motion.div>
              
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-1/3">
                <Button 
                  onClick={handleSaveForLater}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-amber-300/60 text-amber-600 hover:bg-amber-50/80 transition-all"
                >
                  <BookmarkPlus size={18} className="mr-1" />
                  <span>Save</span>
                </Button>
              </motion.div>
              
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-1/3">
                <Button 
                  onClick={handleLike}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 border-none transition-all text-white"
                >
                  <Heart size={18} className="mr-1" />
                  <span>Connect</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <Dialog open={introDialogOpen} onOpenChange={setIntroDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl">Send an intro to {profile.name}</DialogTitle>
            <DialogDescription>
              Make a great first impression with a personalized message!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={introMessage}
              onChange={(e) => setIntroMessage(e.target.value)}
              placeholder={`Hi ${profile.name}! I noticed we both share an interest in ${profile.interests[0]}...`}
              className="min-h-[120px] border-border/50 bg-background/50 focus:border-primary/50 resize-none"
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
              className="border-border/50 hover:bg-muted/30"
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
