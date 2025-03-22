
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
    <section className="py-20 px-6 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 bg-blue-900/40 rounded-full py-1 px-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-sm font-medium text-blue-200">Live Network</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Growing Every Minute</h2>
          <p className="text-blue-200/80 max-w-2xl mx-auto">
            Join thousands of professionals connecting across India. See where connections are happening right now.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-gray-800/40 rounded-xl overflow-hidden h-[180px] animate-pulse"
              >
                <div className="h-24 bg-gray-700/50"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
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
                className="rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:shadow-blue-900/20 hover:-translate-y-1 transition-all"
              >
                <div className={`h-32 ${city.color} flex items-center justify-center relative`}>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{city.city}</h3>
                  <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-xs flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                    Live
                  </div>
                </div>
                <div className="p-4 bg-gray-900">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {city.city} Network
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-300">
                      <Users className="h-4 w-4 mr-1" />
                      {city.count}+ Users
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Last match: {city.lastMatched}</p>
                  <Link to="/register">
                    <Button 
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                    >
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
