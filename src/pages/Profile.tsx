import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  userType: z.string().min(1, "User type is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  university: z.string().optional(),
  courseYear: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  projectInterests: z.string().optional(),
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      location: "",
      bio: "",
      industry: "",
      userType: "",
      experienceLevel: "",
      university: "",
      courseYear: "",
      skills: "",
      interests: "",
      projectInterests: "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.full_name || "",
        location: profile.location || "",
        bio: profile.bio || "",
        industry: profile.industry || "",
        userType: profile.user_type || "",
        experienceLevel: profile.experience_level || "",
        university: profile.university || "",
        courseYear: profile.course_year || "",
        skills: profile.skills ? profile.skills.join(", ") : "",
        interests: profile.interests ? profile.interests.join(", ") : "",
        projectInterests: profile.project_interests ? profile.project_interests.join(", ") : "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const skillsArray = values.skills ? values.skills.split(',').map(s => s.trim()) : [];
      const interestsArray = values.interests ? values.interests.split(',').map(s => s.trim()) : [];
      const projectInterestsArray = values.projectInterests ? values.projectInterests.split(',').map(s => s.trim()) : [];
      
      let completenessScore = 0;
      if (values.fullName) completenessScore += 10;
      if (values.location) completenessScore += 10;
      if (values.bio) completenessScore += 10;
      if (values.industry) completenessScore += 10;
      if (values.userType) completenessScore += 10;
      if (values.experienceLevel) completenessScore += 10;
      if (skillsArray.length > 0) completenessScore += 10;
      if (interestsArray.length > 0) completenessScore += 10;
      if (values.university) completenessScore += 10;
      if (values.courseYear) completenessScore += 10;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: values.fullName,
          location: values.location,
          bio: values.bio,
          industry: values.industry,
          user_type: values.userType,
          experience_level: values.experienceLevel,
          university: values.university,
          course_year: values.courseYear,
          skills: skillsArray,
          interests: interestsArray,
          project_interests: projectInterestsArray,
          updated_at: new Date().toISOString(),
          profile_completeness: completenessScore,
          activity_score: 75,
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      await refreshProfile();
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Update your information to get better matches
          </p>
        </div>
        
        <div className="card-glass rounded-xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself, your professional background, and what you're looking for" 
                        className="h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="arts">Arts</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="mentor">Mentor</SelectItem>
                          <SelectItem value="founder">Founder</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="collaborator">Collaborator</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University / College</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select university" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None/Not Applicable</SelectItem>
                          <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
                          <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
                          <SelectItem value="IIT Madras">IIT Madras</SelectItem>
                          <SelectItem value="IIT Kanpur">IIT Kanpur</SelectItem>
                          <SelectItem value="IIT Kharagpur">IIT Kharagpur</SelectItem>
                          <SelectItem value="BITS Pilani">BITS Pilani</SelectItem>
                          <SelectItem value="Delhi University">Delhi University</SelectItem>
                          <SelectItem value="NIT Trichy">NIT Trichy</SelectItem>
                          <SelectItem value="NIT Warangal">NIT Warangal</SelectItem>
                          <SelectItem value="VIT Vellore">VIT Vellore</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None/Not Applicable</SelectItem>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="5th Year">5th Year</SelectItem>
                          <SelectItem value="Masters">Masters</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Alumni">Alumni</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. javascript, design, leadership, marketing (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. technology, art, travel, sports (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectInterests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. web-development, machine-learning, data-science (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
