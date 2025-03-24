import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Activity, 
  Clock, 
  LogOut,
  Info,
  MailCheck,
  Mail,
  AlertTriangle,
  Building
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut, profile: authProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  
  const isPublicProfile = !!id && id !== user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        // Determine whose profile to fetch
        const profileId = id || user?.id;
        
        if (!profileId) {
          setIsLoading(false);
          return;
        }
        
        // Check if this is the current user's profile
        setIsCurrentUser(profileId === user?.id);
        
        // First try to use the profile from auth context if it's the current user
        if (profileId === user?.id && authProfile) {
          setUserProfile(authProfile);
          setIsProfileIncomplete(isProfileMissingData(authProfile));
          setIsLoading(false);
          return;
        }
        
        // Otherwise, fetch from Supabase
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', profileId)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }
        
        if (data) {
          setUserProfile(data);
          // Check if profile is incomplete
          setIsProfileIncomplete(isProfileMissingData(data));
        } else {
          // If no profile found but we have a user, create a minimal profile object
          if (profileId === user?.id) {
            const minimalProfile = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              created_at: new Date().toISOString()
            };
            setUserProfile(minimalProfile);
            setIsProfileIncomplete(true);
          } else {
            // If it's not the current user and no profile found, show error
            toast.error("Profile not found");
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, user, authProfile, navigate]);
  
  // Helper to check if important profile fields are missing
  const isProfileMissingData = (profile: any) => {
    const requiredFields = ['full_name', 'bio', 'industry', 'user_type'];
    return !profile || requiredFields.some(field => !profile[field]);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // For public profiles, show a simplified view
  if (isPublicProfile) {
    return (
      <Layout>
        <div className="container py-6">
          <ProfileInfo
            profileData={userProfile}
            isPublic={true}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  {userProfile?.image_url ? (
                    <img 
                      src={userProfile.image_url} 
                      alt={userProfile?.full_name || "User"}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{userProfile?.full_name || "Anonymous User"}</h3>
                  <p className="text-muted-foreground text-sm">
                    {userProfile?.user_type || "Professional"} {userProfile?.industry ? `· ${userProfile.industry}` : ""}
                  </p>
                </div>
                <Badge variant="outline" className="bg-primary/5">
                  {userProfile?.profile_completeness || 0}% Profile Completion
                </Badge>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
              <div className="py-2">
                <button
                  className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
                    activeTab === "profile" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTabChange("profile")}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                
                <button
                  className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
                    activeTab === "settings" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTabChange("settings")}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
                    activeTab === "security" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTabChange("security")}
                >
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </button>
                
                <button
                  className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
                    activeTab === "notifications" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTabChange("notifications")}
                >
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </button>
                
                <button
                  className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 transition-colors ${
                    activeTab === "activity" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTabChange("activity")}
                >
                  <Activity className="h-4 w-4" />
                  <span>Activity</span>
                </button>
                
                <button
                  className={`w-full py-2.5 px-4 text-left flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20`}
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            {isProfileIncomplete && (
              <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle>Your profile is incomplete</AlertTitle>
                <AlertDescription>
                  Please update your details to improve your matching quality and help others find you.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-card border rounded-lg shadow-sm">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="profile"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Profile
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="edit"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Edit Profile
                  </TabsTrigger>
                  
                  <TabsTrigger
                    value="settings"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-6">
                  <ProfileInfo profileData={userProfile} isPublic={false} />
                </TabsContent>
                
                <TabsContent value="edit" className="p-6">
                  <ProfileForm 
                    initialData={userProfile} 
                    onSuccess={() => {
                      refreshProfile();
                      setActiveTab("profile");
                    }} 
                  />
                </TabsContent>
                
                <TabsContent value="settings" className="p-6">
                  <ProfileSettings />
                </TabsContent>
                
                <TabsContent value="security" className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertTitle>Account secured</AlertTitle>
                      <AlertDescription>
                        Your account is protected with email and password authentication.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Change your password to keep your account secure.
                        </p>
                        <Button variant="outline">Change Password</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Devices</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage devices that are currently signed in to your account.
                        </p>
                        <Button variant="outline">Manage Devices</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                      <MailCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle>Email Notifications Active</AlertTitle>
                      <AlertDescription>
                        You're receiving email notifications for important updates and messages.
                      </AlertDescription>
                    </Alert>
                    
                    {/* Notification preferences content would go here */}
                    <p className="text-muted-foreground">Configure how and when you receive notifications.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertTitle>Activity Log</AlertTitle>
                      <AlertDescription>
                        Track your recent connections, profile views, and messages.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="border rounded-md divide-y">
                      <div className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Profile update</p>
                          <p className="text-sm text-muted-foreground">You updated your profile</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Message received</p>
                          <p className="text-sm text-muted-foreground">You received a new message</p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Account created</p>
                          <p className="text-sm text-muted-foreground">You created your account</p>
                          <p className="text-xs text-muted-foreground">1 month ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
