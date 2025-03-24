
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon, Menu, X, Search, Bell, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchOverlay from '@/components/header/SearchOverlay';
import { toast } from 'sonner';

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Paths that should show the auth header (when logged in)
  const authPaths = ['/dashboard', '/profile', '/matches', '/chat', '/notifications'];
  const isAuthPath = user && authPaths.some(path => location.pathname.startsWith(path));

  // Paths that should hide the header entirely
  const hiddenHeaderPaths = ['/login', '/register', '/onboarding'];
  const shouldHideHeader = hiddenHeaderPaths.includes(location.pathname);

  if (shouldHideHeader) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text">
                ProfMatch
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthPath ? (
              // Authenticated navigation
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/matches" 
                  className={`text-sm font-medium ${location.pathname === '/matches' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  Connections
                </Link>
                <Link 
                  to="/chat" 
                  className={`text-sm font-medium ${location.pathname === '/chat' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  Messages
                </Link>
              </>
            ) : (
              // Unauthenticated navigation
              <>
                <Link 
                  to="/" 
                  className={`text-sm font-medium ${location.pathname === '/' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`text-sm font-medium ${location.pathname === '/about' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  About
                </Link>
                <Link 
                  to="/pricing" 
                  className={`text-sm font-medium ${location.pathname === '/pricing' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  Pricing
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-sm font-medium ${location.pathname === '/contact' ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Toggle theme" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              // Authenticated actions
              <>
                {/* Search button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Search"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Message button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Messages"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>

                {/* Notifications button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Notifications"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-5 w-5" />
                </Button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2"
                  >
                    <Avatar>
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </div>
              </>
            ) : (
              // Unauthenticated actions
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Menu" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="px-4 py-4 border-t divide-y divide-border/10">
          {isAuthPath ? (
            // Authenticated navigation
            <div className="space-y-3 py-3">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/matches" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connections
              </Link>
              <Link 
                to="/chat" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                className="flex items-center gap-2 text-base font-medium py-2 text-red-500"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Unauthenticated navigation
            <div className="space-y-3 py-3">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center gap-2 text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col pt-3 gap-2">
                <Button variant="outline" onClick={() => navigate('/login')}>Sign In</Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} />
    </header>
  );
};

export default AppHeader;
