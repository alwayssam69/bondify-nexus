
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Video, Users } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface HeroProps {
  user: User | null;
  onGetStarted: () => void;
  onSignIn: () => void;
  onDashboard: () => void;
}

const Hero = ({ user, onGetStarted, onSignIn, onDashboard }: HeroProps) => {
  const { theme } = useTheme();
  
  return (
    <section className={`relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="absolute inset-0 -z-10">
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-900/20 to-transparent" />
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-800/10 rounded-full filter blur-3xl" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-800/10 rounded-full filter blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white" />
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-blue-200/40 to-transparent" />
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-200/30 rounded-full filter blur-3xl" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl" />
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <div className="inline-block mb-6">
              <div className={`flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700' 
                  : 'bg-white/70 backdrop-blur-sm border border-blue-100'
                } rounded-full py-1 px-4 shadow-sm`}>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
                }`}>Professional Networking Platform</span>
              </div>
            </div>
            <h1 className={`hero-heading mb-6`}>
              Meet the Right People, <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Instantly</span>
            </h1>
            <h2 className="hero-subheading">
              Professional Networking, Reimagined.
            </h2>
            <p className="hero-description max-w-2xl mx-auto lg:mx-0">
              Connect with professionals who share your interests and career goals.
              Our intelligent matching system helps you find the perfect connections.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {user ? (
                <Button 
                  size="lg" 
                  className="rounded-full px-8 shadow-button h-12 transition-all hover:shadow-md group"
                  onClick={onDashboard}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 shadow-button h-12 transition-all hover:shadow-md group bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={onGetStarted}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`rounded-full px-8 h-12 ${
                      theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''
                    }`}
                    onClick={onSignIn}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </motion.div>
          
          {/* Right Column - Image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative aspect-[4/3] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
                      </div>
                      <span className="text-xs font-medium">Professional Match</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          AM
                        </div>
                        <div>
                          <h3 className="font-medium">Arun Mehta</h3>
                          <p className="text-xs text-muted-foreground">Product Manager • Bangalore</p>
                        </div>
                        <div className="ml-auto text-xs font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded-full">
                          94% Match
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full">Product Strategy</span>
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full">UX</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Interests</h4>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-800 rounded-full">AI</span>
                            <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-800 rounded-full">Startups</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="w-1/3 text-xs rounded-md flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm" className="w-1/3 text-xs rounded-md flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Call
                        </Button>
                        <Button size="sm" className="w-1/3 text-xs rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
              description: "Join our growing community of professionals finding meaningful connections every day"
            },
            {
              icon: "❤️",
              title: "92% Match Rate",
              description: "Our intelligent algorithm creates highly compatible professional connections"
            },
            {
              icon: "🔒",
              title: "100% Secure",
              description: "Your data and conversations are always protected with end-to-end encryption"
            }
          ].map((stat, index) => (
            <div key={index} className={`${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
              } border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all`}>
              <div className="text-4xl mb-3">{stat.icon}</div>
              <h3 className="card-heading mb-2">{stat.title}</h3>
              <p className="card-text">{stat.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
