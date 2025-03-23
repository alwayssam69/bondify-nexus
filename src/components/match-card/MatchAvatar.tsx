
import React from "react";

interface MatchAvatarProps {
  initial: string;
  imageUrl?: string;
  matchPercentage: number;
}

const MatchAvatar = ({ initial, imageUrl, matchPercentage }: MatchAvatarProps) => {
  // Function to get the right color based on match percentage
  const getMatchScoreColor = () => {
    if (matchPercentage >= 90) return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (matchPercentage >= 75) return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
    if (matchPercentage >= 60) return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
    return "bg-gradient-to-r from-gray-600 to-gray-700 text-white";
  };

  return (
    <div className={`${imageUrl || 'bg-gradient-to-br from-blue-600 to-indigo-800'} h-32 flex items-center justify-center relative overflow-hidden`}>
      {/* 3D floating avatar effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-3xl font-medium text-white shadow-lg animate-float transform-gpu">
        {initial}
      </div>
      <div className={`absolute top-3 right-3 ${getMatchScoreColor()} rounded-full px-3 py-1 text-xs font-bold flex items-center shadow-lg`}>
        {matchPercentage}% Match
      </div>
    </div>
  );
};

export default MatchAvatar;
