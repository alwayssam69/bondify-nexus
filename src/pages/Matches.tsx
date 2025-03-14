
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import MatchCard from "@/components/MatchCard";

const Matches = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const matchProfiles = [
    {
      name: "Alex",
      age: 28,
      location: "San Francisco",
      matchPercentage: 92,
      interests: ["Photography", "Travel", "Hiking"],
      imageBg: "bg-gradient-to-r from-blue-100 to-blue-200",
      delay: 0
    },
    {
      name: "Taylor",
      age: 31,
      location: "New York",
      matchPercentage: 87,
      interests: ["Music", "Art", "Cooking"],
      imageBg: "bg-gradient-to-r from-purple-100 to-purple-200",
      delay: 100
    },
    {
      name: "Jamie",
      age: 26,
      location: "Chicago",
      matchPercentage: 89,
      interests: ["Fitness", "Reading", "Movies"],
      imageBg: "bg-gradient-to-r from-green-100 to-green-200",
      delay: 200
    },
    {
      name: "Jordan",
      age: 29,
      location: "Austin",
      matchPercentage: 85,
      interests: ["Technology", "Gaming", "Coffee"],
      imageBg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
      delay: 300
    },
    {
      name: "Casey",
      age: 27,
      location: "Seattle",
      matchPercentage: 91,
      interests: ["Outdoors", "Dogs", "Cooking"],
      imageBg: "bg-gradient-to-r from-red-100 to-red-200",
      delay: 400
    },
    {
      name: "Morgan",
      age: 32,
      location: "Denver",
      matchPercentage: 86,
      interests: ["Skiing", "Travel", "Wine"],
      imageBg: "bg-gradient-to-r from-indigo-100 to-indigo-200",
      delay: 500
    },
  ];
  
  return (
    <Layout className="pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Matches</h1>
            <p className="text-muted-foreground">Discover people who match with your profile.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M3 6H21M10 12H21M3 12H6M3 18H21M14 6L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filter
            </Button>
            <Button className="rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh Matches
            </Button>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-3 flex overflow-x-auto mb-10 space-x-2">
          {["all", "nearby", "new", "favorites", "recent", "online"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "ghost"}
              className="rounded-full whitespace-nowrap"
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "all" && "All Matches"}
              {filter === "nearby" && "Nearby"}
              {filter === "new" && "New Matches"}
              {filter === "favorites" && "Favorites"}
              {filter === "recent" && "Recently Active"}
              {filter === "online" && "Online Now"}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matchProfiles.map((profile, index) => (
            <MatchCard key={index} {...profile} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-full px-8">
            Load More
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Matches;
