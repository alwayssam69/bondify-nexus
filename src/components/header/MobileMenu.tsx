
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
          className="md:hidden fixed inset-0 bg-black/90 z-40 pt-24 px-6"
        >
          <div className="h-full overflow-y-auto pb-20">
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto"
              variants={itemVariants}
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center text-base font-medium transition-all py-3 px-5 rounded-xl relative",
                        isActive(link.path)
                          ? "bg-blue-600 text-white"
                          : "text-gray-800 hover:bg-gray-100"
                      )}
                      onClick={onClose}
                    >
                      <span className="z-10 relative">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {isLoggedIn && (
                  <>
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/profile"
                        className={cn(
                          "flex items-center text-base font-medium transition-all py-3 px-5 rounded-xl relative",
                          isActive("/profile") 
                            ? "bg-blue-600 text-white"
                            : "text-gray-800 hover:bg-gray-100"
                        )}
                        onClick={onClose}
                      >
                        <span className="z-10 relative">Profile</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <button
                        className="flex items-center w-full text-left text-base font-medium transition-all py-3 px-5 rounded-xl relative text-gray-800 hover:bg-red-100 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <span className="z-10 relative">Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
                
                {!isLoggedIn && (
                  <motion.div variants={itemVariants} className="mt-4 space-y-4">
                    <Link to="/login" onClick={onClose} className="block">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100 text-gray-800 rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={onClose} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        Get Started
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
