
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchRecentMatches } from "@/services/DataService";

const DynamicMatches = () => {
  const [recentMatches, setRecentMatches] = useState<{
    city: string;
    count: number;
    lastMatched: string;
    color: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentMatches = async () => {
      setIsLoading(true);
      try {
        const matchesData = await fetchRecentMatches(6);
        setRecentMatches(matchesData);
      } catch (error) {
        console.error("Error loading dynamic matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentMatches();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadRecentMatches, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-blue-50 rounded-full py-1 px-4">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-blue-900">Live Network</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Growing Every Minute</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals connecting across India. See where connections are happening right now.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-[160px] animate-pulse"
              >
                <div className="h-24 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentMatches.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className={`h-24 bg-gradient-to-r ${city.color} flex items-center justify-center relative`}>
                  <h3 className="text-2xl font-bold text-white">{city.city}</h3>
                  <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-xs flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                    Live
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {city.city} Network
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      <Users className="h-4 w-4 mr-1" />
                      {city.count}+ Users
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Last match: {city.lastMatched}</p>
                  <Link to="/register">
                    <Button variant="outline" size="sm" className="w-full">
                      Connect in {city.city}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicMatches;
