
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, isLoggedIn, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
    onClose();
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-xl z-40 pt-24 px-6"
        >
          <div className="h-full overflow-y-auto pb-20">
            <motion.div 
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl p-6 max-w-md mx-auto"
              variants={itemVariants}
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center text-base font-medium transition-all hover:text-blue-400 py-3 px-5 rounded-xl relative overflow-hidden group",
                        isActive(link.path)
                          ? "bg-blue-500/10 text-blue-400 shadow-inner"
                          : "text-gray-200"
                      )}
                      onClick={onClose}
                    >
                      <span className="z-10 relative">{link.name}</span>
                      
                      {/* Background glow effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                      
                      {/* Hover indicator */}
                      <span className="absolute bottom-2 left-5 w-0 h-0.5 bg-blue-400 group-hover:w-10 transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                ))}
                
                {isLoggedIn && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/profile"
                        className={cn(
                          "flex items-center text-base font-medium transition-all hover:text-blue-400 py-3 px-5 rounded-xl relative overflow-hidden group",
                          isActive("/profile") 
                            ? "bg-blue-500/10 text-blue-400 shadow-inner"
                            : "text-gray-200"
                        )}
                        onClick={onClose}
                      >
                        <span className="z-10 relative">Profile</span>
                        
                        {/* Background glow effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                        
                        {/* Hover indicator */}
                        <span className="absolute bottom-2 left-5 w-0 h-0.5 bg-blue-400 group-hover:w-10 transition-all duration-300"></span>
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <button
                        className="flex items-center w-full text-left text-base font-medium transition-all hover:text-red-400 py-3 px-5 rounded-xl relative overflow-hidden group text-gray-200"
                        onClick={handleLogout}
                      >
                        <span className="z-10 relative">Logout</span>
                        
                        {/* Background glow effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                        
                        {/* Hover indicator */}
                        <span className="absolute bottom-2 left-5 w-0 h-0.5 bg-red-400 group-hover:w-10 transition-all duration-300"></span>
                      </button>
                    </motion.div>
                  </>
                )}
                
                {!isLoggedIn && (
                  <motion.div variants={itemVariants} className="mt-4 space-y-4">
                    <Link to="/login" onClick={onClose} className="block">
                      <Button variant="outline" className="w-full bg-white/5 border-gray-700 text-gray-200 hover:bg-gray-800 rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={onClose} className="block">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl">
                        Get Started
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </nav>
              
              {/* Decorative elements */}
              <div className="absolute top-5 right-5 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-5 left-5 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
