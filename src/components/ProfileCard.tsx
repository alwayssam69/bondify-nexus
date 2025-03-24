
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/lib/matchmaking';
import { MapPin, Briefcase, Award, MessageSquare, UserPlus } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onViewProfile?: (id: string) => void;
  onConnect?: (id: string) => void;
  onMessage?: (id: string) => void;
  showConnectButton?: boolean;
  showMessageButton?: boolean;
  showDistance?: boolean;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewProfile,
  onConnect,
  onMessage,
  showConnectButton = true,
  showMessageButton = false,
  showDistance = false,
  className = '',
}) => {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(profile.id);
    }
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConnect) {
      onConnect(profile.id);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMessage) {
      onMessage(profile.id);
    }
  };

  // Set default image if none is provided
  const profileImage = profile.imageUrl && profile.imageUrl.startsWith('http')
    ? profile.imageUrl
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=random';

  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={handleViewProfile}
    >
      <div className="relative">
        {/* Profile header background */}
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40"></div>
        
        {/* Profile image */}
        <div className="absolute -bottom-10 left-4">
          <div className="relative">
            <img
              src={profileImage}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-4 border-background object-cover"
            />
            {profile.matchScore && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {profile.matchScore}%
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="pt-12 pb-4">
        <h3 className="text-lg font-semibold">{profile.name}</h3>
        
        {profile.industry && (
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <Briefcase className="w-4 h-4 mr-1" />
            <span>{profile.industry}</span>
          </div>
        )}
        
        <div className="flex items-center text-muted-foreground text-sm mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{profile.location}</span>
          {showDistance && profile.distance && (
            <span className="ml-1">• {Math.round(profile.distance)}km</span>
          )}
        </div>
        
        {profile.experienceLevel && (
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <Award className="w-4 h-4 mr-1" />
            <span className="capitalize">{profile.experienceLevel}</span>
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-1">
          {profile.skills?.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {profile.skills && profile.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{profile.skills.length - 3} more
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {profile.bio || `${profile.name} is a ${profile.experienceLevel || ''} professional in ${profile.industry || 'the industry'}.`}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex gap-2">
        {showConnectButton && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleConnect}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Connect
          </Button>
        )}
        
        {showMessageButton && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleMessage}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Message
          </Button>
        )}
        
        {!showConnectButton && !showMessageButton && (
          <Button 
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
