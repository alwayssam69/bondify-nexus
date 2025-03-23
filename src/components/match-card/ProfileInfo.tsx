
import React from "react";
import { MapPin, Briefcase } from "lucide-react";
import { UserProfile } from "@/lib/matchmaking";

interface ProfileInfoProps {
  profile: UserProfile;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  return (
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-white">{profile.name}{profile.age ? `, ${profile.age}` : ''}</h3>
          <div className="flex items-center text-sm text-blue-300 mt-1">
            <Briefcase className="h-3.5 w-3.5 mr-1" />
            <span>{profile.industry || profile.userType || "Professional"}</span>
            {profile.location && (
              <span className="mx-1">•</span>
            )}
            <span>{profile.location}</span>
          </div>
          {profile.distance !== undefined && (
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{Math.round(profile.distance)} km away</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {profile.skills?.slice(0, 2).map((skill, index) => (
          <span 
            key={`skill-${index}`} 
            className="text-xs px-2 py-1 bg-blue-900/40 text-blue-300 rounded-full border border-blue-800/50"
          >
            {skill}
          </span>
        ))}
        {profile.interests?.slice(0, profile.skills?.length ? 1 : 3).map((interest, index) => (
          <span 
            key={`interest-${index}`} 
            className="text-xs px-2 py-1 bg-purple-900/40 text-purple-300 rounded-full border border-purple-800/50"
          >
            {interest}
          </span>
        ))}
        {(profile.skills?.length || 0) + (profile.interests?.length || 0) > 3 && (
          <span className="text-xs px-2 py-1 rounded-full text-gray-400">
            +{(profile.skills?.length || 0) + (profile.interests?.length || 0) - 3} more
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
