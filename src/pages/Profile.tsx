
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string(),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 18, {
    message: "You must be at least 18 years old",
  }),
  gender: z.string(),
  location: z.string(),
  relationshipGoal: z.string(),
  interests: z.string(),
  dailyRoutine: z.string(),
  communicationStyle: z.string(),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock profile data
  const profileData = {
    name: "Jamie Taylor",
    bio: "Photography enthusiast and outdoor lover. I enjoy hiking, capturing landscapes, and discovering new coffee shops.",
    age: "28",
    gender: "non-binary",
    location: "San Francisco",
    relationshipGoal: "serious",
    interests: "Photography, Hiking, Coffee, Travel",
    dailyRoutine: "morning",
    communicationStyle: "mixed",
    profileCompletion: 85,
    memberSince: "Jan 2023",
    matches: 24,
    messages: 47,
    profileViews: 128,
    interestsList: ["Photography", "Hiking", "Coffee", "Travel", "Reading", "Movies", "Music"],
    preferenceSettings: {
      ageRange: [23, 35],
      distance: 25,
      relationshipGoals: ["serious", "casual"],
      notification: true,
      profileVisibility: "all",
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profileData.name,
      bio: profileData.bio,
      age: profileData.age,
      gender: profileData.gender,
      location: profileData.location,
      relationshipGoal: profileData.relationshipGoal,
      interests: profileData.interests,
      dailyRoutine: profileData.dailyRoutine,
      communicationStyle: profileData.communicationStyle,
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you'd send these updates to your backend
    console.log(values);
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };
  
  return (
    <Layout className="pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Manage your information and privacy settings</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-8">
            <div className="card-glass rounded-xl p-6 text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white text-3xl font-light mx-auto mb-4">
                {profileData.name[0]}
              </div>
              
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{profileData.location}</p>
              
              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="outline" className="bg-blue-50">
                  {profileData.age}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 capitalize">
                  {profileData.gender}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 capitalize">
                  {profileData.relationshipGoal}
                </Badge>
              </div>
              
              <div className="bg-secondary rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${profileData.profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Profile {profileData.profileCompletion}% complete
              </p>
              
              <Separator className="my-4" />
              
              <div className="text-sm text-left">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{profileData.memberSince}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Total matches</span>
                  <span>{profileData.matches}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Messages</span>
                  <span>{profileData.messages}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Profile views</span>
                  <span>{profileData.profileViews}</span>
                </div>
              </div>
            </div>
            
            <div className="card-glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.interestsList.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile Info</TabsTrigger>
                <TabsTrigger value="preferences">Match Preferences</TabsTrigger>
                <TabsTrigger value="privacy">Privacy & Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <div className="card-glass rounded-xl p-6">
                  {isEditing ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell others about yourself..." 
                                  className="resize-none h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input type="number" min="18" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="non-binary">Non-binary</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="relationshipGoal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship Goal</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="What are you looking for?" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="casual">Casual Dating</SelectItem>
                                  <SelectItem value="serious">Serious Relationship</SelectItem>
                                  <SelectItem value="networking">Networking</SelectItem>
                                  <SelectItem value="friendship">Friendship</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interests & Hobbies</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Photography, Travel, Hiking" {...field} />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground">Separate with commas</p>
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="dailyRoutine"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Daily Routine</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select routine" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="morning">Morning Person</SelectItem>
                                    <SelectItem value="night">Night Person</SelectItem>
                                    <SelectItem value="balanced">Balanced</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="communicationStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Communication Style</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="call">Call</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-4 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">About Me</h3>
                        <p className="text-muted-foreground">{profileData.bio}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Location</h4>
                          <p className="text-muted-foreground">{profileData.location}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Looking For</h4>
                          <p className="text-muted-foreground capitalize">{profileData.relationshipGoal}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Daily Routine</h4>
                          <p className="text-muted-foreground capitalize">
                            {profileData.dailyRoutine === "morning" ? "Morning Person" : 
                             profileData.dailyRoutine === "night" ? "Night Person" : "Balanced"}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Communication Style</h4>
                          <p className="text-muted-foreground capitalize">{profileData.communicationStyle}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <div className="card-glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Match Preferences</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Age Range</h4>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="number" 
                          className="w-20" 
                          defaultValue={profileData.preferenceSettings.ageRange[0]} 
                        />
                        <span>to</span>
                        <Input 
                          type="number" 
                          className="w-20" 
                          defaultValue={profileData.preferenceSettings.ageRange[1]} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Distance (miles)</h4>
                      <Input 
                        type="number" 
                        className="w-20" 
                        defaultValue={profileData.preferenceSettings.distance} 
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Relationship Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {["serious", "casual", "networking", "friendship"].map((goal) => (
                          <Badge 
                            key={goal}
                            variant={profileData.preferenceSettings.relationshipGoals.includes(goal) ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                          >
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Matching Factors</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Interests & Hobbies</span>
                          <span className="font-medium">40%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location Proximity</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mutual Connections</span>
                          <span className="font-medium">15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activity Level</span>
                          <span className="font-medium">15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profile Completeness</span>
                          <span className="font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button>Save Preferences</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-6">
                <div className="card-glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Privacy Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Profile Visibility</h4>
                      <Select defaultValue={profileData.preferenceSettings.profileVisibility}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Who can see your profile" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Everyone</SelectItem>
                          <SelectItem value="matches">Only My Matches</SelectItem>
                          <SelectItem value="none">Nobody (Hidden)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Notification Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>New match notifications</span>
                          <Button variant="outline" size="sm">
                            {profileData.preferenceSettings.notification ? "On" : "Off"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Message notifications</span>
                          <Button variant="outline" size="sm">
                            {profileData.preferenceSettings.notification ? "On" : "Off"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Profile view notifications</span>
                          <Button variant="outline" size="sm">
                            {profileData.preferenceSettings.notification ? "On" : "Off"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Account Management</h4>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full">
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full text-red-500">
                          Deactivate Account
                        </Button>
                      </div>
                    </div>
                    
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
