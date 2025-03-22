
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
        "md:hidden fixed inset-0 bg-gray-900 z-40 transition-transform duration-300 ease-in-out pt-20 px-6",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <nav className="flex flex-col gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "text-base font-medium transition-colors hover:text-blue-400 py-2",
              isActive(link.path)
                ? "text-blue-400"
                : "text-gray-300"
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
              className="text-base font-medium transition-colors hover:text-blue-400 py-2 text-gray-300"
              onClick={onClose}
            >
              Profile
            </Link>
            
            <button
              className="text-base font-medium transition-colors hover:text-blue-400 py-2 text-gray-300 text-left"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
        
        {!isLoggedIn && (
          <div className="flex flex-col gap-4 mt-4">
            <Link to="/login" onClick={onClose}>
              <Button variant="outline" className="w-full bg-transparent border-gray-700 text-gray-200 hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={onClose}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
