
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getConfirmedMatches } from "@/services/MatchmakingService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MatchOverview {
  id: string;
  name: string;
  headline: string;
  matchScore: number;
  imageUrl?: string;
  color: string;
}

// Generate a background color based on matchScore
const getMatchScoreColor = (score: number): string => {
  if (score >= 80) return "bg-gradient-to-br from-green-500 to-emerald-700";
  if (score >= 60) return "bg-gradient-to-br from-blue-500 to-indigo-700";
  if (score >= 40) return "bg-gradient-to-br from-purple-500 to-violet-700";
  return "bg-gradient-to-br from-slate-500 to-gray-700";
};

const DynamicMatches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchOverview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Set a timeout to ensure we don't load for more than 5 seconds
        const timeoutPromise = new Promise<any[]>((resolve) => {
          setTimeout(() => resolve([]), 5000);
        });
        
        try {
          const matchesPromise = getConfirmedMatches(user.id);
          const matchesData = await Promise.race([matchesPromise, timeoutPromise]);
          
          // Transform the data for display
          const processedMatches = matchesData.slice(0, 5).map(match => ({
            id: match.id,
            name: match.name,
            headline: `${match.userType || "Professional"} at ${match.industry || "Unknown"}`,
            matchScore: match.matchScore || 0,
            imageUrl: match.imageUrl,
            color: getMatchScoreColor(match.matchScore || 0)
          }));
          
          setMatches(processedMatches);
        } catch (error) {
          console.error("Error loading matches:", error);
          setMatches([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Best Matches</h2>
        <div className="text-muted-foreground text-sm">
          Based on your profile and preferences
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">Loading matches...</h3>
          <p className="text-muted-foreground">
            Finding your best connections
          </p>
        </div>
      ) : matches.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Matches Yet</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any suitable matches yet. Try updating your profile or search preferences.
          </p>
          <Button 
            onClick={() => navigate("/matches")} 
            variant="outline"
          >
            Find New Connections
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <Link 
              key={match.id} 
              to={`/chat?contact=${match.id}`}
              className={`block p-4 rounded-lg relative overflow-hidden h-32 ${match.color}`}
            >
              <div className="relative z-10">
                <h3 className="text-white text-xl font-semibold">{match.name}</h3>
                <div className="flex items-center text-white/90 text-sm mt-1">
                  <span>{match.headline}</span>
                </div>
                <div className="mt-4 bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full inline-block">
                  {match.matchScore}% Match
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicMatches;
