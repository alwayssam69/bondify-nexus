
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Users, MessageCircle, HelpCircle, Newspaper } from "lucide-react";

const FloatingNavigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Matches", path: "/matches", icon: Users },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Q&A", path: "/qa-forum", icon: HelpCircle },
    { name: "News", path: "/news-insights", icon: Newspaper },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden md:block"
    >
      <div className="bg-gray-900/70 backdrop-blur-xl rounded-full py-6 px-3 border border-gray-800/50 shadow-lg flex flex-col items-center gap-5">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "relative p-2 transition-colors rounded-full group",
              isActive(link.path)
                ? "text-white bg-blue-600/60"
                : "text-gray-400 hover:text-white"
            )}
            title={link.name}
          >
            <link.icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {link.name}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default FloatingNavigation;
