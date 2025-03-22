
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Building,
  Users,
  Briefcase,
  MapPin,
  Radio,
  GraduationCap,
  CheckCircle,
  Clock,
  Trophy,
  LineChart,
  PieChart,
  BarChart4
} from "lucide-react";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [matchesCount, setMatchesCount] = useState(0);
  const [savedProfilesCount, setSavedProfilesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);
  
  const fetchUserStats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get matches count
      const { count: matchesCount, error: matchesError } = await supabase
        .from('user_matches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'matched');
      
      if (matchesError) {
        console.error("Error fetching matches count:", matchesError);
      } else {
        setMatchesCount(matchesCount || 0);
      }
      
      // Get saved profiles count
      const { count: savedCount, error: savedError } = await supabase
        .from('user_swipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action', 'save');
      
      if (savedError) {
        console.error("Error fetching saved profiles count:", savedError);
      } else {
        setSavedProfilesCount(savedCount || 0);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Placeholder data for statistics
  const weeklyStats = {
    views: 42,
    connections: 8,
    messages: 15,
    matches: 5
  };
  
  const profileCompleteness = profile?.profile_completeness || 0;
  
  if (isLoading) {
    return (
      <Layout className="py-24 px-6">
        <div className="max-w-6xl mx-auto flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user.email?.split('@')[0] || 'User'}</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2"
            >
              <Users size={16} />
              Edit Profile
            </Button>
            <Button 
              onClick={() => navigate("/matches")}
              className="flex items-center gap-2"
            >
              <Radio size={16} />
              Find Matches
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Profile Completeness</p>
                  <div className="flex items-center gap-2">
                    <Progress value={profileCompleteness} className="h-2" />
                    <span className="text-sm font-medium">{profileCompleteness}%</span>
                  </div>
                  {profileCompleteness < 70 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Complete your profile to get better matches
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.location || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.industry || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">University</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.university || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/profile")}
                >
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Connections
              </CardTitle>
              <CardDescription>Your network statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{matchesCount}</p>
                    <p className="text-xs text-muted-foreground">Matches</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{savedProfilesCount}</p>
                    <p className="text-xs text-muted-foreground">Saved</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Weekly Activity</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Profile Views</span>
                    <span>{weeklyStats.views}</span>
                  </div>
                  <Progress value={(weeklyStats.views / 100) * 100} className="h-1" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>New Connections</span>
                    <span>{weeklyStats.connections}</span>
                  </div>
                  <Progress value={(weeklyStats.connections / 20) * 100} className="h-1" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Messages</span>
                    <span>{weeklyStats.messages}</span>
                  </div>
                  <Progress value={(weeklyStats.messages / 50) * 100} className="h-1" />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/matches")}
                >
                  View All Connections
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Achievement Goals
              </CardTitle>
              <CardDescription>Your networking milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">2/5</p>
                    <p className="text-xs text-muted-foreground">Weekly Goal</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium">Achievements</p>
                  
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Profile Complete</p>
                      <p className="text-xs text-muted-foreground">
                        Fill out all profile fields
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Networking Pro</p>
                      <p className="text-xs text-muted-foreground">
                        Connect with 10 professionals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Conversation Starter</p>
                      <p className="text-xs text-muted-foreground">
                        Send 20 messages to connections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <BarChart4 className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Network Growth</CardTitle>
                  <CardDescription>Connections over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Network growth visualization</p>
                    <p className="text-sm">Connect with more people to see your network grow!</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Connection Quality</CardTitle>
                  <CardDescription>Match scores and engagement</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Connection quality visualization</p>
                    <p className="text-sm">Improve your profile to get higher-quality matches!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Distribution</CardTitle>
                  <CardDescription>By industry and type</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Connection distribution visualization</p>
                    <p className="text-sm">Expand your network across different industries!</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Connections</CardTitle>
                  <CardDescription>Your latest matches</CardDescription>
                </CardHeader>
                <CardContent>
                  {matchesCount > 0 ? (
                    <div className="space-y-4">
                      {/* Placeholder for real connections */}
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          A
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">Alex Johnson</p>
                          <p className="text-xs text-muted-foreground">Technology • San Francisco</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/chat")}>
                          Message
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          T
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">Taylor Martinez</p>
                          <p className="text-xs text-muted-foreground">Finance • New York</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/chat")}>
                          Message
                        </Button>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/matches")}
                      >
                        View All Matches
                      </Button>
                    </div>
                  ) : (
                    <div className="h-60 flex items-center justify-center text-center">
                      <div>
                        <p className="text-muted-foreground mb-4">No connections yet</p>
                        <Button onClick={() => navigate("/matches")}>
                          Find Matches
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Your recent networking activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative pl-6 pb-4 border-l border-border">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <p className="text-sm font-medium">Profile Updated</p>
                      <p className="text-xs text-muted-foreground">
                        You updated your profile information
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        2 days ago
                      </p>
                    </div>
                    
                    <div className="relative pl-6 pb-4 border-l border-border">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <p className="text-sm font-medium">New Connection</p>
                      <p className="text-xs text-muted-foreground">
                        You connected with Alex Johnson
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        3 days ago
                      </p>
                    </div>
                    
                    <div className="relative pl-6 pb-4 border-l border-border">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <p className="text-sm font-medium">Message Sent</p>
                      <p className="text-xs text-muted-foreground">
                        You messaged Taylor Martinez
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        1 week ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Your networking goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Connect with new people</p>
                        <p className="text-sm font-medium">2/5</p>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Send messages</p>
                        <p className="text-sm font-medium">8/10</p>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Profile views</p>
                        <p className="text-sm font-medium">15/20</p>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Upcoming Achievement
                      </h4>
                      <p className="text-sm">Networking Pro: Connect with 10 professionals</p>
                      <p className="text-xs text-muted-foreground mt-1">8 connections remaining</p>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => navigate("/matches")}
                      >
                        Find Connections
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
