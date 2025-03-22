
import React, { useState } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { UserProfile } from "@/lib/matchmaking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Briefcase, GraduationCap, CheckCircle, X, Heart, BookmarkPlus, Send } from "lucide-react";
import { toast } from "sonner";

interface SwipeCardProps {
  profile: UserProfile;
  onSwipe: (profileId: string, action: 'like' | 'reject' | 'save') => void;
  onSendIntro?: (profileId: string, message: string) => void;
  isActive: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  onSendIntro,
  isActive,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showIntroDialog, setShowIntroDialog] = useState(false);
  const [introMessage, setIntroMessage] = useState("");
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  
  const background = useTransform(
    x,
    [-200, 0, 200],
    [
      "linear-gradient(to right, rgba(255, 100, 100, 0.2), rgba(255, 100, 100, 0))",
      "none",
      "linear-gradient(to left, rgba(100, 255, 100, 0.2), rgba(100, 255, 100, 0))",
    ]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe(profile.id, 'like');
    } else if (info.offset.x < -100) {
      onSwipe(profile.id, 'reject');
    }
  };
  
  const handleSendIntro = () => {
    if (introMessage.trim() === "") {
      toast.error("Please write a message");
      return;
    }

    if (onSendIntro) {
      onSendIntro(profile.id, introMessage);
    }
    
    setShowIntroDialog(false);
    setIntroMessage("");
    toast.success("Intro message sent!");
  };
  
  const getBadgeColor = (matchScore?: number) => {
    if (!matchScore) return "bg-blue-500";
    if (matchScore >= 90) return "bg-green-500";
    if (matchScore >= 70) return "bg-blue-500";
    if (matchScore >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <>
      <motion.div
        style={{
          x,
          rotate,
          opacity,
          background,
          top: 0,
          left: 0,
          right: 0,
          position: "absolute",
          touchAction: "none",
        }}
        drag={isActive ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.05 }}
        className="w-full touch-none select-none cursor-grab active:cursor-grabbing"
      >
        <Card className="overflow-hidden shadow-md w-full h-[550px] bg-card rounded-xl border border-border max-w-sm mx-auto">
          <div className="relative">
            {/* Profile Image or Gradient */}
            <div
              className={`h-72 flex items-center justify-center ${
                profile.imageUrl?.startsWith("bg-")
                  ? profile.imageUrl
                  : "bg-gradient-to-br from-blue-400 to-indigo-600"
              }`}
            >
              {!profile.imageUrl?.startsWith("http") && (
                <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-4xl font-light text-white">
                  {profile.name?.charAt(0)}
                </div>
              )}
              {profile.imageUrl?.startsWith("http") && (
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Match Score Badge */}
              {profile.matchScore && (
                <div className={`absolute top-4 right-4 ${getBadgeColor(profile.matchScore)} text-white px-2 py-1 rounded-full text-sm font-medium`}>
                  {profile.matchScore}% Match
                </div>
              )}
              
              {/* Distance Badge (if available) */}
              {profile.distance !== undefined && (
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profile.distance < 1 
                    ? 'Less than 1 km' 
                    : `${Math.round(profile.distance)} km away`}
                </div>
              )}
            </div>
            
            <div className="p-5">
              {/* Basic Info */}
              <div className="mb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  {profile.name}, {profile.age}
                  {profile.matchScore && profile.matchScore > 85 && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                  )}
                </h2>
                
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  <span>{profile.industry || "Professional"}</span>
                  {profile.experienceLevel && (
                    <span className="mx-1">•</span>
                  )}
                  {profile.experienceLevel && (
                    <span className="capitalize">{profile.experienceLevel}</span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{profile.location}</span>
                </div>
                
                {profile.university && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <GraduationCap className="h-3.5 w-3.5 mr-1" />
                    <span>{profile.university}</span>
                    {profile.courseYear && (
                      <span className="ml-1">• {profile.courseYear}</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Bio Preview */}
              {profile.bio && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {profile.bio}
                </p>
              )}
              
              {/* Skills/Interests Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {profile.skills?.slice(0, 3).map((skill, index) => (
                  <span 
                    key={`skill-${index}`}
                    className="bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {profile.interests?.slice(0, profile.skills?.length ? 1 : 4).map((interest, index) => (
                  <span 
                    key={`interest-${index}`}
                    className="bg-secondary text-secondary-foreground text-xs py-0.5 px-2 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
                {(profile.skills?.length || 0) + (profile.interests?.length || 0) > 4 && (
                  <span 
                    className="text-xs py-0.5 px-2 rounded-full border border-border cursor-pointer"
                    onClick={() => setShowDetails(true)}
                  >
                    + more
                  </span>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between gap-2 mt-auto">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-12 w-12 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-600"
                  onClick={() => onSwipe(profile.id, 'reject')}
                >
                  <X className="h-5 w-5 text-rose-500" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-12 w-12 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-600"
                  onClick={() => onSwipe(profile.id, 'save')}
                >
                  <BookmarkPlus className="h-5 w-5 text-amber-500" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="outline"
                  className="rounded-full h-12 w-12 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-600"
                  onClick={() => setShowIntroDialog(true)}
                >
                  <Send className="h-5 w-5 text-blue-500" />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full h-12 w-12 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-600"
                  onClick={() => onSwipe(profile.id, 'like')}
                >
                  <Heart className="h-5 w-5 text-green-500" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Profile Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{profile.name}, {profile.age}</DialogTitle>
            <DialogDescription>{profile.location}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            {profile.bio && (
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Interests</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-secondary text-secondary-foreground text-xs py-0.5 px-2 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.networkingGoals && profile.networkingGoals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Networking Goals</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.networkingGoals.map((goal, index) => (
                    <span 
                      key={index}
                      className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => onSwipe(profile.id, 'reject')}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Pass
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onSwipe(profile.id, 'save')}
              className="flex items-center"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={() => onSwipe(profile.id, 'like')}
              className="flex items-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send Intro Message Dialog */}
      <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send an Introduction to {profile.name}</DialogTitle>
            <DialogDescription>
              A personalized message increases your chances of connecting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={introMessage}
              onChange={(e) => setIntroMessage(e.target.value)}
              placeholder={`Hi ${profile.name}, I'm interested in connecting with you because...`}
              className="min-h-[120px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIntroDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendIntro} className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Send Intro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SwipeCard;
