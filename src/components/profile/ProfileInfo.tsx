
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
  Calendar, 
  AlertTriangle,
  AtSign
} from "lucide-react";

interface ProfileInfoProps {
  profileData: any;
  isPublic: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData, isPublic }) => {
  // Debug profile data
  console.log("Rendering profile data:", profileData);

  if (!profileData) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Profile data not available</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          There was a problem loading this profile information. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Helper function to safely display array data
  const displayArray = (arr: string[] | null | undefined) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return null;
    }
    return arr;
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
            {/* Personal Information */}
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
                {profileData.user_tag && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <AtSign className="h-3 w-3" /> Username
                    </p>
                    <p className="font-medium">@{profileData.user_tag}</p>
                  </div>
                )}
                {!isPublic && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profileData.email || "Not provided"}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p>{profileData.bio || "No bio provided"}</p>
                </div>
              </div>
            </div>

            {/* Professional Details */}
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

            {/* Education */}
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

            {/* Skills & Interests */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Skills & Interests
              </h3>
              
              {/* Skills */}
              <div>
                <p className="text-sm text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {displayArray(profileData.skills) ? (
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
              
              {/* Interests */}
              <div>
                <p className="text-sm text-muted-foreground">Interests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {displayArray(profileData.interests) ? (
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
              
              {/* Project Interests */}
              <div>
                <p className="text-sm text-muted-foreground">Project Interests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {displayArray(profileData.project_interests) ? (
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
            {/* Location */}
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

            {/* Account Details */}
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
