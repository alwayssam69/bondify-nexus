
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/hooks/useMatchmaking';
import { MapPin, Briefcase, Award, Heart } from 'lucide-react';

interface MatchCardProps {
  profile: UserProfile;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ profile, className }) => {
  // Calculate background gradient based on match score
  const getScoreGradient = (score?: number) => {
    if (!score) return 'from-slate-500 to-slate-700';
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-indigo-600';
    return 'from-purple-500 to-violet-600';
  };

  return (
    <Link to={`/profile/${profile.username}`}>
      <Card className={`overflow-hidden transition-all hover:shadow-md ${className}`}>
        <div className={`bg-gradient-to-br ${getScoreGradient(profile.match_score)} h-24 relative`}>
          {profile.match_score && (
            <div className="absolute top-2 right-2 bg-white/90 text-sm font-semibold px-2 py-1 rounded-full">
              {profile.match_score}% Match
            </div>
          )}
        </div>
        
        <div className="relative -mt-12 px-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-md">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
            <AvatarFallback className="text-lg">
              {profile.full_name?.charAt(0) || profile.username?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-lg">{profile.full_name}</h3>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            </div>
            
            {profile.industry && (
              <div className="flex items-center text-sm">
                <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{profile.industry}</span>
              </div>
            )}
            
            {profile.location && (
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{profile.location}</span>
                {profile.distance && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {profile.distance}km away
                  </Badge>
                )}
              </div>
            )}
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {profile.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {profile.interests.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.interests.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MatchCard;
