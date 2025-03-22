
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 bg-black/60 backdrop-blur-lg z-40 transition-transform duration-300 ease-in-out pt-20 px-6",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl p-6 animate-fade-in max-w-md mx-auto">
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-base font-medium transition-colors hover:text-blue-400 py-2 px-4 rounded-full",
                isActive(link.path)
                  ? "bg-blue-500/20 text-blue-400 shadow-inner"
                  : "text-gray-200"
              )}
              onClick={onClose}
            >
              {link.name}
            </Link>
          ))}
          
          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                className={cn(
                  "text-base font-medium transition-colors hover:text-blue-400 py-2 px-4 rounded-full",
                  isActive("/profile") 
                    ? "bg-blue-500/20 text-blue-400 shadow-inner"
                    : "text-gray-200"
                )}
                onClick={onClose}
              >
                Profile
              </Link>
              
              <button
                className="text-base font-medium transition-colors hover:text-red-400 py-2 px-4 rounded-full text-left text-gray-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
          
          {!isLoggedIn && (
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/login" onClick={onClose}>
                <Button variant="outline" className="w-full bg-white/5 border-gray-700 text-gray-200 hover:bg-gray-800 rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={onClose}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
