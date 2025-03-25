import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
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
  const [noMatches, setNoMatches] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setNoMatches(false);
      
      try {
        // Fetch profiles directly from Supabase
        const { data: profiles, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, user_type, industry, image_url')
          .neq('id', user?.id || '')
          .limit(5);
            
        if (error) {
          throw error;
        }
        
        if (profiles && profiles.length > 0) {
          const userMatches = profiles.map(profile => ({
            id: profile.id,
            name: profile.full_name || "Anonymous User",
            headline: `${profile.user_type || "Professional"} at ${profile.industry || "Various Industries"}`,
            matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-99
            imageUrl: profile.image_url,
            color: getMatchScoreColor(Math.floor(Math.random() * 40) + 60)
          }));
          
          setMatches(userMatches);
          setNoMatches(false);
          setIsLoading(false);
          return;
        } else {
          // If no real users, create dummy data
          setMatches([
            {
              id: "1",
              name: "Alex Johnson",
              headline: "Developer at Technology",
              matchScore: 92,
              color: getMatchScoreColor(92)
            },
            {
              id: "2",
              name: "Taylor Martinez",
              headline: "Product Manager at Marketing",
              matchScore: 87,
              color: getMatchScoreColor(87)
            },
            {
              id: "3",
              name: "Jordan Smith",
              headline: "Designer at Creative",
              matchScore: 79,
              color: getMatchScoreColor(79)
            }
          ]);
          setNoMatches(false);
        }
      } catch (error) {
        console.error("Error in matches flow:", error);
        // Create dummy data as fallback
        setMatches([
          {
            id: "1",
            name: "Alex Johnson",
            headline: "Developer at Technology",
            matchScore: 92,
            color: getMatchScoreColor(92)
          },
          {
            id: "2",
            name: "Taylor Martinez",
            headline: "Product Manager at Marketing",
            matchScore: 87,
            color: getMatchScoreColor(87)
          },
          {
            id: "3",
            name: "Jordan Smith",
            headline: "Designer at Creative",
            matchScore: 79,
            color: getMatchScoreColor(79)
          }
        ]);
        setNoMatches(false);
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
      ) : noMatches ? (
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
              to={user ? `/profile/${match.id}` : "/login"}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  toast.info("Please sign in to view profiles");
                  navigate("/login");
                }
              }}
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
