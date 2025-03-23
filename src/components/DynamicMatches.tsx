import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchRecentMatches } from "@/services/DataService";

const DynamicMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const matchesData = await fetchRecentMatches(6);
        setMatches(matchesData);
      } catch (error) {
        console.error("Error loading city matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recent Matches</h2>
        <div className="text-muted-foreground text-sm">
          Real-time data from active connections
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Recent Matches</h3>
          <p className="text-muted-foreground mb-6">
            When new connections are made, they'll appear here in real-time.
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
          {matches.map((match, index) => (
            <Link 
              key={index} 
              to="/matches" 
              className={`block p-4 rounded-lg relative overflow-hidden h-32 ${match.color}`}
            >
              <div className="relative z-10">
                <h3 className="text-white text-xl font-semibold">{match.city}</h3>
                <div className="flex items-center text-white/90 text-sm mt-1">
                  <span>{match.count} connections</span>
                  <span className="mx-2">•</span>
                  <span>Last match {match.lastMatched}</span>
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
