
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera, Edit, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  location?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  avatar_url?: string;
}

const ProfilePage = () => {
  const { user, profile: authProfile, updateProfile, updateUsername, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    industry: '',
    skills: '',
    interests: '',
    username: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        if (!username && !user) {
          // No username in URL and no logged-in user
          navigate('/login');
          return;
        }

        // If no username is provided, use the current user's profile
        if (!username && authProfile) {
          setProfile(authProfile);
          setIsCurrentUser(true);
          initializeForm(authProfile);
          setIsLoading(false);
          return;
        }

        // If username is provided, fetch that user's profile
        if (username) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('username', username)
            .single();

          if (error || !data) {
            toast.error('Profile not found');
            navigate('/dashboard');
            return;
          }

          setProfile(data);
          setIsCurrentUser(user?.id === data.id);
          
          if (user?.id === data.id) {
            initializeForm(data);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, user, authProfile, navigate]);

  // Initialize edit form with profile data
  const initializeForm = (profileData: UserProfile) => {
    setEditForm({
      full_name: profileData.full_name || '',
      bio: profileData.bio || '',
      location: profileData.location || '',
      industry: profileData.industry || '',
      skills: profileData.skills?.join(', ') || '',
      interests: profileData.interests?.join(', ') || '',
      username: profileData.username || ''
    });
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Upload avatar to Supabase storage
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editForm.full_name.trim()) {
      errors.full_name = 'Name is required';
    }
    
    if (editForm.username !== profile?.username) {
      if (!editForm.username.trim()) {
        errors.username = 'Username is required';
      } else if (!/^[a-zA-Z0-9_]+$/.test(editForm.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsUpdating(true);
      
      // Process skills and interests
      const skills = editForm.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      const interests = editForm.interests.split(',').map(interest => interest.trim()).filter(Boolean);
      
      // Upload avatar if selected
      let avatar_url = profile?.avatar_url;
      if (avatarFile) {
        const url = await uploadAvatar();
        if (url) avatar_url = url;
      }
      
      // Prepare updates
      const updates = {
        full_name: editForm.full_name,
        bio: editForm.bio,
        location: editForm.location,
        industry: editForm.industry,
        skills,
        interests,
        avatar_url
      };
      
      // Update profile
      await updateProfile(updates);
      
      // Update username if changed
      if (editForm.username !== profile?.username) {
        await updateUsername(editForm.username);
      }
      
      // Refresh profile data
      await refreshProfile();
      
      // Switch back to profile view
      setActiveTab('profile');
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isCurrentUser && <TabsTrigger value="edit">Edit Profile</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row gap-4 items-center">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0) || profile.username?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                <CardDescription className="flex items-center justify-center sm:justify-start gap-1">
                  @{profile.username}
                  {profile.industry && <span className="text-sm opacity-70">• {profile.industry}</span>}
                </CardDescription>
                {profile.location && (
                  <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.bio && (
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              )}
              
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {isCurrentUser && (
                <div className="pt-4">
                  <Button onClick={() => setActiveTab('edit')} variant="outline" className="w-full sm:w-auto">
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {isCurrentUser && (
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-2 border-primary">
                        <AvatarImage 
                          src={avatarPreview || profile.avatar_url || ''} 
                          alt={profile.full_name} 
                        />
                        <AvatarFallback className="text-2xl">
                          {profile.full_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <Label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                      </Label>
                      <Input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Click the camera icon to change your avatar</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                        <Input
                          id="username"
                          name="username"
                          value={editForm.username}
                          onChange={handleChange}
                          className="pl-7"
                          placeholder="username"
                        />
                      </div>
                      {formErrors.username && <p className="text-sm text-red-500 mt-1">{formErrors.username}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: Username can only be changed once.
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                      {formErrors.full_name && <p className="text-sm text-red-500 mt-1">{formErrors.full_name}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editForm.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={editForm.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          name="industry"
                          value={editForm.industry}
                          onChange={handleChange}
                          placeholder="e.g. Technology, Finance"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={editForm.skills}
                        onChange={handleChange}
                        placeholder="JavaScript, React, Node.js"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate each skill with a comma
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="interests">Interests</Label>
                      <Input
                        id="interests"
                        name="interests"
                        value={editForm.interests}
                        onChange={handleChange}
                        placeholder="Coding, Design, Startups"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate each interest with a comma
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('profile')}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProfilePage;
