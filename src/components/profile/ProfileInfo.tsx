
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Hash, 
  MapPin, 
  Mail, 
  Calendar 
} from "lucide-react";

interface ProfileInfoProps {
  profileData: any;
  isPublic: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData, isPublic }) => {
  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Profile data not available.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Profile Overview</h2>
        <p className="text-muted-foreground">
          {isPublic 
            ? `Viewing ${profileData.full_name || "User"}'s public profile.` 
            : "View and manage your personal information."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{profileData.full_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profileData.email || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p>{profileData.bio || "No bio provided"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{profileData.industry || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Type</p>
                  <p className="font-medium">{profileData.user_type || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience Level</p>
                  <p className="font-medium">{profileData.experience_level || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">University/Institution</p>
                  <p className="font-medium">{profileData.university || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course/Year</p>
                  <p className="font-medium">{profileData.course_year || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Skills & Interests
              </h3>
              <div>
                <p className="text-sm text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.interests && profileData.interests.length > 0 ? (
                    profileData.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No interests listed</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Interests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.project_interests && profileData.project_interests.length > 0 ? (
                    profileData.project_interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No project interests listed</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </h3>
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p className="font-medium">{profileData.state || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{profileData.city || "Not provided"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Account Details
              </h3>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(profileData.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Completion</p>
                <p className="font-medium">{profileData.profile_completeness || 0}%</p>
              </div>
            </div>

            {!isPublic && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Note: Only you can see your account details. Your public profile doesn't show your email or account information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;
