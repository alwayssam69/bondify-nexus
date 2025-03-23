
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationProps {
  isLoggedIn: boolean;
}

const Navigation = ({ isLoggedIn }: NavigationProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
    { name: "Q&A", path: "/qa-forum" },
    { name: "News", path: "/news-insights" },
  ];
  
  const navLinks = isLoggedIn ? loggedInNavLinks : loggedOutNavLinks;
  
  const isActive = (path: string) => {
    // For hash links on home page
    if (path.includes('#') && location.pathname === '/') {
      return location.hash === path.substring(path.indexOf('#'));
    }
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        "fixed z-50 left-1/2 transform -translate-x-1/2",
        isMobile ? "bottom-6" : "top-6"
      )}
    >
      <motion.div 
        className={cn(
          "bg-gray-900/70 backdrop-blur-xl rounded-full py-2.5 px-3 md:px-5 border border-gray-800/50 shadow-lg",
          "hover:shadow-blue-500/20 transition-all duration-300",
          "flex items-center justify-center"
        )}
        whileHover={{ scale: 1.03, y: -3, boxShadow: "0 15px 25px rgba(59, 130, 246, 0.15)" }}
        animate={{ 
          boxShadow: ["0 5px 15px rgba(0, 0, 0, 0.2)", "0 8px 25px rgba(59, 130, 246, 0.15)", "0 5px 15px rgba(0, 0, 0, 0.2)"],
        }}
        transition={{
          boxShadow: {
            repeat: Infinity,
            duration: 3,
          }
        }}
      >
        <div className="flex items-center gap-1 md:gap-2 relative overflow-hidden">
          {/* Glow effect behind the active pill */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 blur-xl opacity-70 rounded-full"></div>
          
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              prefetch="intent"
              className={cn(
                "relative px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors rounded-full hover:text-white group",
                isActive(link.path)
                  ? "text-white"
                  : "text-gray-400"
              )}
            >
              {isActive(link.path) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/60 to-indigo-600/60 rounded-full -z-10"
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
