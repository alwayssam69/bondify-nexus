
import React from "react";
import ProfileInfo from "@/components/profile/ProfileInfo";

interface PublicProfileProps {
  userProfile: any;
}

const PublicProfile = ({ userProfile }: PublicProfileProps) => {
  return (
    <div className="container py-6">
      <ProfileInfo
        profileData={userProfile}
        isPublic={true}
      />
    </div>
  );
};

export default PublicProfile;
