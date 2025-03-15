
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-100/40 to-transparent" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-200/20 rounded-full filter blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-200/20 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-on-scroll"
        >
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full py-1 px-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-blue-900">Discover Your Perfect Match</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Find Your Perfect <span className="text-gradient">Connection</span> With Intelligent Matching
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our advanced algorithm connects you with people who truly match your personality, interests, and relationship goals. Join thousands of successful matches today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 shadow-button h-12 transition-all hover:shadow-md group">
                <span>Start Your Journey</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </Link>
            <Link to="/#how-it-works">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12">
                See How It Works
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-5xl mx-auto animate-on-scroll"
        >
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center shadow-soft">
            <div className="w-full h-full bg-white/70 backdrop-blur-sm p-6 flex items-center justify-center">
              <div className="relative w-full max-w-3xl mx-auto glass rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                  </div>
                  <span className="text-sm font-medium">Match App</span>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                  </div>
                </div>
                <div className="bg-white p-6 flex flex-col gap-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-xl font-semibold">Today's Matches</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Filter</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 4.5H21M3 12H21M3 19.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Alex J.", age: 28, match: 92, location: "San Francisco", img: "bg-blue-100" },
                      { name: "Taylor M.", age: 31, match: 87, location: "New York", img: "bg-purple-100" },
                      { name: "Jamie C.", age: 26, match: 89, location: "Chicago", img: "bg-green-100" },
                    ].map((profile, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`${profile.img} h-40 flex items-center justify-center`}>
                          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-2xl font-light">
                            {profile.name[0]}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{profile.name}, {profile.age}</h3>
                              <p className="text-xs text-muted-foreground">{profile.location}</p>
                            </div>
                            <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              {profile.match}% Match
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="w-1/2 text-xs rounded-md">View</Button>
                            <Button size="sm" className="w-1/2 text-xs rounded-md">Connect</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-soft rounded-full py-2 px-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Powered by AI-based personality matching</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-on-scroll"
        >
          {[
            {
              icon: "👥",
              title: "20,000+ Users",
              description: "Join our growing community of singles finding meaningful connections every day"
            },
            {
              icon: "❤️",
              title: "92% Match Rate",
              description: "Our intelligent algorithm creates highly compatible connections"
            },
            {
              icon: "🔒",
              title: "100% Secure",
              description: "Your data and conversations are always protected with end-to-end encryption"
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white border border-border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
