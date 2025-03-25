
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, User, Settings, Activity, Sparkles } from 'lucide-react';
import MatchCard from '@/components/matchmaking/MatchCard';

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Get top matches
  const { matches, isLoading } = useMatchmaking({
    enabled: true,
    filters: {}
  });
  
  // Get top 3 matches
  const topMatches = matches.slice(0, 3);
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {profile?.full_name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Connect with professionals that match your interests and skills
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Potential Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{matches.length}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" onClick={() => navigate('/matches')}>
                  View all
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-green-500" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {calculateProfileCompleteness(profile)}%
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  Complete profile
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-purple-500" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">@{profile?.username}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  Manage profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Top Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Top Matches</CardTitle>
              <CardDescription>
                People who match your profile and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading your matches...
                </div>
              ) : topMatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {topMatches.map(match => (
                    <MatchCard key={match.id} profile={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No matches found. Try updating your profile to find better matches.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/matches')} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Find More Matches
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Side panel */}
        <div className="space-y-6">
          {/* Profile summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-lg">{profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground mb-2">@{profile?.username}</p>
              
              {profile?.industry && (
                <p className="text-sm">{profile.industry}</p>
              )}
              
              {profile?.bio && (
                <p className="text-sm mt-2 line-clamp-3">{profile.bio}</p>
              )}
              
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/matches')}
              >
                <Users className="mr-2 h-4 w-4" />
                Find New Connections
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/messages')}
              >
                <Activity className="mr-2 h-4 w-4" />
                View Messages
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate profile completeness
const calculateProfileCompleteness = (profile: any): number => {
  if (!profile) return 0;
  
  const fields = [
    { name: 'full_name', weight: 15 },
    { name: 'username', weight: 10 },
    { name: 'bio', weight: 15 },
    { name: 'location', weight: 10 },
    { name: 'industry', weight: 10 },
    { name: 'skills', weight: 15, isArray: true },
    { name: 'interests', weight: 15, isArray: true },
    { name: 'avatar_url', weight: 10 },
  ];
  
  let score = 0;
  
  fields.forEach(field => {
    const value = profile[field.name];
    if (value) {
      if (field.isArray) {
        if (Array.isArray(value) && value.length > 0) {
          score += field.weight;
        }
      } else {
        score += field.weight;
      }
    }
  });
  
  return score;
};

export default Dashboard;
