
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationProps {
  isLoggedIn: boolean;
}

const Navigation = ({ isLoggedIn }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path.includes('#')) return; // Let hash links work normally
    
    e.preventDefault();
    navigate(path, { replace: true });
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full flex justify-center mt-2"
    >
      <motion.div 
        className={cn(
          "bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 rounded-full py-2 px-4 shadow-md",
          "transition-all duration-300",
          "flex items-center justify-center"
        )}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto max-w-[calc(100vw-40px)] md:max-w-none">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => handleNavClick(link.path, e)}
              className={cn(
                "relative whitespace-nowrap px-4 md:px-5 py-2 text-sm font-medium rounded-full transition-colors",
                isActive(link.path)
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              )}
            >
              {isActive(link.path) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
