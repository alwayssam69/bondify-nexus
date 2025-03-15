
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Bell, MessageSquare, Video, Users } from "lucide-react";
import VideoCall from "./chat/VideoCall";
import IncomingCall from "./chat/IncomingCall";
import { RecentMatch } from "@/types/chat";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<{id: string, name: string} | null>(null);
  const [incomingCall, setIncomingCall] = useState<{contactId: string, contactName: string} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if user is logged in based on route
  // In a real app, you'd use an auth context/state
  const isLoggedIn = ["/dashboard", "/matches", "/chat", "/profile"].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

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
  
  // Notification data
  const notifications = [
    { id: 1, type: "match", message: "You have a new match with Alex", time: "10m ago" },
    { id: 2, type: "message", message: "Taylor sent you a message", time: "1h ago" },
    { id: 3, type: "view", message: "Jamie viewed your profile", time: "3h ago" },
    { id: 4, type: "match", message: "You matched with Jordan", time: "5h ago" },
  ];

  // Recent matches data
  const recentMatches: RecentMatch[] = [
    { id: "1", name: "Alex J.", matchPercentage: 92, avatar: "", location: "San Francisco", isNew: true },
    { id: "2", name: "Taylor M.", matchPercentage: 87, avatar: "", location: "New York", isNew: false },
    { id: "3", name: "Jamie C.", matchPercentage: 89, avatar: "", location: "Chicago", isNew: true },
  ];
  
  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("searchQuery") as string;
    
    if (query.trim()) {
      toast.info(`Searching for "${query}"`);
      // In a real app, you'd implement search functionality
      setSearchOpen(false);
    }
  };
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  const initiateVideoCall = (contact: {id: string, name: string}) => {
    toast.info(`Initiating video call with ${contact.name}`);
    setActiveVideoCall(contact);
  };

  const simulateIncomingCall = () => {
    // Simulate an incoming call after a short delay
    if (isLoggedIn) {
      setTimeout(() => {
        setIncomingCall({
          contactId: "2",
          contactName: "Taylor M."
        });
      }, 3000);
      toast.info("Incoming call in 3 seconds...");
    } else {
      toast.error("You need to be logged in to receive calls");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-foreground">Match</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Search Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </Button>
                
                {/* Recent Matches Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Users size={20} />
                      {recentMatches.some(match => match.isNew) && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          {recentMatches.filter(match => match.isNew).length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Recent Matches</span>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate("/matches")}>
                          View All
                        </Button>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {recentMatches.map((match) => (
                      <DropdownMenuItem key={match.id} className="p-3 cursor-pointer" onClick={() => navigate(`/matches/${match.id}`)}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-base">{match.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-medium text-sm">{match.name}</p>
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{match.matchPercentage}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{match.location}</p>
                            {match.isNew && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full mt-1">New</span>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Video Call Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Video size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>Video Call</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => initiateVideoCall({id: "1", name: "Alex J."})}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span>A</span>
                        </div>
                        <span>Call Alex J.</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => initiateVideoCall({id: "2", name: "Taylor M."})}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span>T</span>
                        </div>
                        <span>Call Taylor M.</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={simulateIncomingCall}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span>S</span>
                        </div>
                        <span>Simulate Incoming Call</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Messages Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <MessageSquare size={20} />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Messages</span>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => navigate("/chat")}>
                          View All
                        </Button>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      { id: 1, name: "Alex Johnson", message: "Hey, how are you doing?", time: "10m" },
                      { id: 2, name: "Taylor Moore", message: "I saw you like hiking too!", time: "25m" },
                      { id: 3, name: "Jamie Chen", message: "Thanks for accepting my connection!", time: "1h" },
                    ].map((message) => (
                      <DropdownMenuItem key={message.id} className="p-3 cursor-pointer" onClick={() => navigate("/chat")}>
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-base">{message.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-medium text-sm">{message.name}</p>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Notifications Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        4
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Notifications</span>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          Mark All Read
                        </Button>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                        <div className="flex gap-3 w-full">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'match' ? 'bg-red-100 text-red-600' : 
                            notification.type === 'message' ? 'bg-blue-100 text-blue-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            {notification.type === 'match' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            )}
                            {notification.type === 'message' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            )}
                            {notification.type === 'view' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-blue-100">
                      <span className="text-blue-600">J</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/matches")}>
                      Matches
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/chat")}>
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

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

        {/* Search Overlay */}
        <div className={cn(
          "absolute left-0 right-0 px-6 md:px-10 pb-4 pt-2 bg-white/95 backdrop-blur-lg transition-all duration-300",
          searchOpen ? "top-full opacity-100" : "-top-20 opacity-0 pointer-events-none"
        )}>
          <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  name="searchQuery"
                  placeholder="Search for users, interests, or locations..."
                  className="pr-10"
                  autoComplete="off"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out pt-20 px-6",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary py-2",
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                <Link
                  to="/profile"
                  className="text-base font-medium transition-colors hover:text-primary py-2 text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <button
                  className="text-base font-medium transition-colors hover:text-primary py-2 text-muted-foreground text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
            
            {!isLoggedIn && (
              <div className="flex flex-col gap-4 mt-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
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
