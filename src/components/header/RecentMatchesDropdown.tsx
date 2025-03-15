
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users } from "lucide-react";
import { RecentMatch } from "@/types/chat";

const RecentMatchesDropdown = () => {
  const navigate = useNavigate();
  
  // Recent matches data
  const recentMatches: RecentMatch[] = [
    { id: "1", name: "Alex J.", matchPercentage: 92, avatar: "", location: "San Francisco", isNew: true },
    { id: "2", name: "Taylor M.", matchPercentage: 87, avatar: "", location: "New York", isNew: false },
    { id: "3", name: "Jamie C.", matchPercentage: 89, avatar: "", location: "Chicago", isNew: true },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Users size={20} />
          {recentMatches.some(match => match.isNew) && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              {recentMatches.filter(match => match.isNew).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Recent Matches</span>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate("/matches")}>
              View All
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentMatches.map((match) => (
          <DropdownMenuItem key={match.id} className="p-3 cursor-pointer" onClick={() => navigate(`/matches/${match.id}`)}>
            <div className="flex gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-base">{match.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{match.name}</p>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{match.matchPercentage}%</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{match.location}</p>
                {match.isNew && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full mt-1">New</span>
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentMatchesDropdown;
