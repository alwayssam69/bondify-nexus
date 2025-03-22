
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchRecentMatches } from "@/services/DataService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

// List of Indian cities with their colors for dummy data
const popularCities = [
  { city: "Delhi", color: "bg-gradient-to-r from-blue-400 to-blue-600" },
  { city: "Mumbai", color: "bg-gradient-to-r from-indigo-400 to-indigo-600" },
  { city: "Bangalore", color: "bg-gradient-to-r from-purple-400 to-purple-600" },
  { city: "Hyderabad", color: "bg-gradient-to-r from-pink-400 to-pink-600" },
  { city: "Chennai", color: "bg-gradient-to-r from-red-400 to-red-600" },
  { city: "Kolkata", color: "bg-gradient-to-r from-orange-400 to-orange-600" },
  { city: "Pune", color: "bg-gradient-to-r from-emerald-400 to-emerald-600" },
  { city: "Ahmedabad", color: "bg-gradient-to-r from-cyan-400 to-cyan-600" },
  { city: "Jaipur", color: "bg-gradient-to-r from-violet-400 to-violet-600" },
  { city: "Lucknow", color: "bg-gradient-to-r from-fuchsia-400 to-fuchsia-600" },
  { city: "Chandigarh", color: "bg-gradient-to-r from-amber-400 to-amber-600" },
  { city: "Kochi", color: "bg-gradient-to-r from-lime-400 to-lime-600" },
];

// Time phrases for dummy data
const timeAgoOptions = [
  "just now", "2m ago", "5m ago", "12m ago", "25m ago", 
  "1h ago", "3h ago", "today", "yesterday"
];

const DynamicMatches = () => {
  const [recentMatches, setRecentMatches] = useState<{
    city: string;
    count: number;
    lastMatched: string;
    color: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPlaceholders, setLoadingPlaceholders] = useState<any[]>([]);
  const { user, profile } = useAuth();

  // Create a function to generate dynamic placeholder data
  const generatePlaceholderData = useCallback(() => {
    return Array(6).fill(null).map((_, index) => {
      const randomCityIndex = Math.floor(Math.random() * popularCities.length);
      const randomTimeIndex = Math.floor(Math.random() * timeAgoOptions.length);
      const randomCount = Math.floor(Math.random() * 120) + 30;
      
      return {
        city: popularCities[randomCityIndex].city,
        color: popularCities[randomCityIndex].color,
        count: randomCount,
        lastMatched: timeAgoOptions[randomTimeIndex],
        key: Date.now() + index // Ensure unique key for animations
      };
    });
  }, []);

  // Initialize placeholder data
  useEffect(() => {
    setLoadingPlaceholders(generatePlaceholderData());
    
    // Update placeholder data every few seconds to create a dynamic loading effect
    const placeholderInterval = setInterval(() => {
      if (isLoading) {
        setLoadingPlaceholders(prev => {
          // Only replace 1-2 items at a time for a subtle effect
          const numToReplace = Math.floor(Math.random() * 2) + 1;
          const newData = [...prev];
          
          for (let i = 0; i < numToReplace; i++) {
            const randomIndex = Math.floor(Math.random() * 6);
            const randomCityIndex = Math.floor(Math.random() * popularCities.length);
            const randomTimeIndex = Math.floor(Math.random() * timeAgoOptions.length);
            const randomCount = Math.floor(Math.random() * 120) + 30;
            
            newData[randomIndex] = {
              city: popularCities[randomCityIndex].city,
              color: popularCities[randomCityIndex].color,
              count: randomCount,
              lastMatched: timeAgoOptions[randomTimeIndex],
              key: Date.now() + randomIndex
            };
          }
          
          return newData;
        });
      }
    }, 2000);
    
    return () => clearInterval(placeholderInterval);
  }, [isLoading, generatePlaceholderData]);

  useEffect(() => {
    const loadRecentMatches = async () => {
      try {
        // If user is logged in, try to get matches related to their location first
        if (profile?.location) {
          const matchesData = await fetchRecentMatches(6);
          
          // Ensure the user's location is included
          const userLocationIncluded = matchesData.some(match => 
            match.city.toLowerCase() === profile.location.toLowerCase()
          );
          
          if (!userLocationIncluded && matchesData.length > 0) {
            // Replace the last item with user's location
            const userCityColor = popularCities.find(c => 
              c.city.toLowerCase() === profile.location.toLowerCase()
            )?.color || "from-green-400 to-green-600";
            
            matchesData[matchesData.length - 1] = {
              city: profile.location,
              count: Math.floor(Math.random() * 50) + 20,
              lastMatched: "just now",
              color: userCityColor
            };
          }
          
          setRecentMatches(matchesData);
        } else {
          // If no user profile or location, just fetch general matches
          const matchesData = await fetchRecentMatches(6);
          setRecentMatches(matchesData);
        }
      } catch (error) {
        console.error("Error loading dynamic matches:", error);
        // In case of error, use the placeholder data as fallback
        const placeholderMatches = generatePlaceholderData().map(item => ({
          city: item.city,
          count: item.count,
          lastMatched: item.lastMatched,
          color: item.color
        }));
        setRecentMatches(placeholderMatches);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a slight delay to simulate loading and show the nice animation
    const timer = setTimeout(() => {
      loadRecentMatches();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [profile, generatePlaceholderData]);

  // Determine what to render based on loading state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loadingPlaceholders.map((city, index) => (
              <motion.div
                key={city.key}
                initial={{ opacity: 0.7, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.7, y: -10 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:shadow-blue-900/20 hover:-translate-y-1 transition-all card-3d"
              >
                <div className={`h-32 bg-${city.color} flex items-center justify-center relative`}>
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold text-white"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {city.city}
                  </motion.h3>
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
                      <motion.span
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {city.count}+ Users
                      </motion.span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-4 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <motion.span
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Last match: {city.lastMatched}
                    </motion.span>
                  </p>
                  <Button 
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                    disabled
                  >
                    <span className="animate-pulse">Loading matches...</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentMatches.map((city, index) => (
          <motion.div
            key={city.city + index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:shadow-blue-900/20 transition-all duration-300 card-3d"
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
              <Link to={user ? "/matches" : "/register"}>
                <Button 
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                >
                  {user 
                    ? `Explore ${city.city} Matches` 
                    : `Connect in ${city.city}`}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

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

        {renderContent()}
      </div>
    </section>
  );
};

export default DynamicMatches;
