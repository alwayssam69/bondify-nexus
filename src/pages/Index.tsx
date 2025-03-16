
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CallToAction from "@/components/CallToAction";
import MatchCard from "@/components/MatchCard";
import { UserProfile, getRandomChatMatches, loadSampleUsers } from "@/lib/matchmaking";

const Index = () => {
  const [userLocation, setUserLocation] = useState("New York");
  const [featuredMatches, setFeaturedMatches] = useState<UserProfile[]>([]);
  
  // Initialize sample users on component mount
  useEffect(() => {
    const sampleUsers = loadSampleUsers();
    updateFeaturedMatches(sampleUsers);
    
    // Set an interval to change location every 10 seconds for demonstration
    const locationInterval = setInterval(() => {
      const locations = ["New York", "San Francisco", "Chicago", "Los Angeles", "Miami", "Seattle", "Portland", "Austin"];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      setUserLocation(randomLocation);
    }, 10000);
    
    return () => clearInterval(locationInterval);
  }, []);
  
  // Update featured matches whenever location changes
  useEffect(() => {
    updateFeaturedMatches();
  }, [userLocation]);
  
  const updateFeaturedMatches = (allUsers?: UserProfile[]) => {
    // Create a mock current user with the dynamic location
    const currentUser: UserProfile = {
      id: "current",
      name: "Current User",
      age: 25,
      gender: "non-binary",
      interests: ["music", "technology", "travel"],
      location: userLocation,
      relationshipGoal: "dating",
      language: "English",
      activityScore: 85,
      profileCompleteness: 90
    };
    
    // Get random matches based on the current user
    const matches = getRandomChatMatches(currentUser, 3);
    
    // Transform the UserProfile objects to include the needed properties for MatchCard
    const cardMatches = matches.map((match, index) => ({
      name: match.name,
      age: match.age,
      location: match.location,
      matchPercentage: match.matchScore !== undefined ? match.matchScore : 80 + Math.floor(Math.random() * 15),
      interests: match.interests.slice(0, 3),
      imageBg: match.imageUrl || `bg-gradient-to-r from-${getColorFromIndex(index)}-100 to-${getColorFromIndex(index)}-200`,
      delay: index * 100
    }));
    
    setFeaturedMatches(cardMatches);
  };
  
  const getColorFromIndex = (index: number): string => {
    const colors = ["blue", "purple", "green", "pink", "yellow", "red"];
    return colors[index % colors.length];
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <Hero />
      
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 bg-blue-50 rounded-full py-1 px-4">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm font-medium text-blue-900">How It Works</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Matchmaking Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced algorithm finds your most compatible matches based on personality, interests, and relationship goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Add your details, interests, and preferences to help us understand what makes you unique.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M17 11H23M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                step: "02",
                title: "Discover Matches",
                description: "Browse through carefully selected profiles that match your preferences and compatibility score.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              {
                step: "03",
                title: "Connect & Chat",
                description: "Start conversations with your matches and build meaningful connections through our messaging platform.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center bg-white border border-border rounded-xl p-6 transition-all hover:shadow-card">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  {step.icon}
                </div>
                <div className="bg-secondary text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Features />
      
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 bg-blue-50 rounded-full py-1 px-4">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm font-medium text-blue-900">Featured Matches</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Compatible People in {userLocation}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here are some of our most popular profiles with high match potential in {userLocation}. 
              Create an account to see your personalized matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMatches.map((match, index) => (
              <MatchCard key={index} {...match} />
            ))}
          </div>
        </div>
      </section>
      
      <CallToAction />
    </Layout>
  );
};

export default Index;
