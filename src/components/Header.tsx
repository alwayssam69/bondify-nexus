
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import VideoCall from "./chat/VideoCall";
import IncomingCall from "./chat/IncomingCall";
import { useAuth } from "@/contexts/AuthContext";

// Import extracted components
import HeaderLogo from "./header/HeaderLogo";
import Navigation from "./header/Navigation";
import SearchOverlay from "./header/SearchOverlay";
import MobileMenu from "./header/MobileMenu";
import AuthButtons from "./header/AuthButtons";
import NotificationsDropdown from "./header/NotificationsDropdown";
import MessagesDropdown from "./header/MessagesDropdown";
import VideoCallDropdown from "./header/VideoCallDropdown";
import RecentMatchesDropdown from "./header/RecentMatchesDropdown";
import ProfileDropdown from "./header/ProfileDropdown";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<{id: string, name: string} | null>(null);
  const [incomingCall, setIncomingCall] = useState<{contactId: string, contactName: string} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if user is logged in based on auth state
  let isLoggedIn = false;
  try {
    const { user } = useAuth();
    isLoggedIn = !!user;
  } catch (error) {
    console.log("Auth context not available yet in Header:", error);
    isLoggedIn = false;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initiateVideoCall = (contact: {id: string, name: string}) => {
    toast.info(`Initiating video call with ${contact.name}`);
    setActiveVideoCall(contact);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 px-3 md:px-5",
          scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between h-10 mb-1">
            <div className="flex items-center gap-3">
              <HeaderLogo />
              
              {isLoggedIn && (
                <div className="hidden md:flex items-center gap-4">
                  {/* Search Button */}
                  <button 
                    className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                  
                  {/* Recent Matches Dropdown */}
                  <RecentMatchesDropdown />
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle - Moved to first position for better spacing */}
              <ThemeToggle className="mr-2" />
              
              {isLoggedIn && (
                <>
                  {/* Messages Dropdown */}
                  <MessagesDropdown />
                  
                  {/* Notifications Dropdown */}
                  <NotificationsDropdown />
                  
                  {/* Profile Dropdown - Last position */}
                  <ProfileDropdown />
                </>
              )}
              
              {!isLoggedIn && <AuthButtons />}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "transition-all duration-300",
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                )}
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "absolute top-4 right-6 transition-all duration-300",
                  mobileMenuOpen ? "opacity-100" : "opacity-0"
                )}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          
          {/* Integrated Navigation */}
          <Navigation isLoggedIn={isLoggedIn} />
        </div>

        {/* Search Overlay */}
        <SearchOverlay isOpen={searchOpen} />

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          isLoggedIn={isLoggedIn} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      </header>

      {/* Video Call Component */}
      {activeVideoCall && (
        <VideoCall 
          contactId={activeVideoCall.id} 
          contactName={activeVideoCall.name} 
          onEndCall={() => setActiveVideoCall(null)} 
        />
      )}

      {/* Incoming Call Component */}
      {incomingCall && (
        <IncomingCall
          contact={incomingCall}
          onAccept={() => {
            setActiveVideoCall({
              id: incomingCall.contactId,
              name: incomingCall.contactName
            });
            setIncomingCall(null);
          }}
          onDecline={() => {
            toast.info(`Call from ${incomingCall.contactName} declined`);
            setIncomingCall(null);
          }}
        />
      )}
    </>
  );
};

export default Header;
