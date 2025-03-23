
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Users, MessageCircle, HelpCircle, Newspaper } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // We'll only show floating navigation on mobile devices now
  if (!isMobile) {
    return null;
  }
  
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

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path, { replace: true });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:hidden"
    >
      <div className="bg-gray-900 rounded-full py-2 px-4 border border-gray-800 shadow-md flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={(e) => handleNavClick(link.path, e)}
            className={cn(
              "relative p-2 transition-colors rounded-full group",
              isActive(link.path)
                ? "text-white bg-blue-600"
                : "text-gray-200 hover:text-white"
            )}
            aria-label={link.name}
          >
            <link.icon className="w-5 h-5" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default FloatingNavigation;
