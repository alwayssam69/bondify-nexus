
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavigationProps {
  isLoggedIn: boolean;
}

const Navigation = ({ isLoggedIn }: NavigationProps) => {
  const location = useLocation();
  
  const loggedOutNavLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Features", path: "/#features" },
    { name: "Testimonials", path: "/#testimonials" },
  ];
  
  const loggedInNavLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Matches", path: "/matches" },
    { name: "Chat", path: "/chat" },
  ];
  
  const navLinks = isLoggedIn ? loggedInNavLinks : loggedOutNavLinks;
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-4 z-50"
    >
      <motion.div 
        className="bg-gray-900/60 backdrop-blur-lg rounded-full py-2 px-4 border border-gray-800/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="flex items-center gap-1 relative overflow-hidden">
          {/* Glow effect behind the active pill */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl opacity-70 rounded-full"></div>
          
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-white group",
                isActive(link.path)
                  ? "text-white"
                  : "text-gray-400"
              )}
            >
              {isActive(link.path) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full -z-10"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
              
              {/* Hover indicator */}
              <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-1/2 transition-all duration-300 transform -translate-x-1/2"></span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
