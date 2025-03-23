
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { fetchRecentMatchesForUser } from "@/services/DataService";
import { RecentMatch } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

const RecentMatchesDropdown = () => {
  const { user } = useAuth();
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadRecentMatches = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const matchesData = await fetchRecentMatchesForUser(user.id);
        setRecentMatches(matchesData);
      } catch (error) {
        console.error("Error loading recent matches:", error);
        setRecentMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadRecentMatches();
      
      // Set up real-time listener for new matches with error handling
      try {
        const channel = supabase
          .channel('public:user_matches')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'user_matches',
              filter: `user_id=eq.${user.id}`
            }, 
            () => {
              // Reload matches when a new one is created
              loadRecentMatches();
            }
          )
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up real-time listener:", error);
      }
    }
  }, [user]);

  const newMatchesCount = recentMatches.filter(match => match.isNew).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Users size={20} />
          {newMatchesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
              {newMatchesCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Recent Matches</span>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
              <Link to="/matches">View All</Link>
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : recentMatches.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No matches yet
          </div>
        ) : (
          recentMatches.map((match) => (
            <DropdownMenuItem key={match.id} className="p-3 cursor-pointer" asChild>
              <Link to={`/matches/${match.id}`} className="w-full">
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
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentMatchesDropdown;
