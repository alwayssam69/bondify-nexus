
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, User, LogOut, Home, Users, Bell, Video } from 'lucide-react';
import UserSearchInput from '@/components/UserSearchInput';
import VideoCallModal from '@/components/VideoCallModal';

const HeaderBar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              ConnectMe
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link to="/matches" className="text-sm font-medium hover:text-primary">
              Matches
            </Link>
            <Link to="/messages" className="text-sm font-medium hover:text-primary">
              Messages
            </Link>
          </nav>
          
          {/* Search, Notifications, and User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <UserSearchInput />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVideoCallOpen(true)}
              className="text-muted-foreground"
            >
              <Video className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                    <AvatarFallback>
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">@{profile?.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/matches')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Matches</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 inset-x-0 bg-white border-b border-gray-200 shadow-lg z-30 md:hidden">
          <div className="container mx-auto p-4 space-y-4">
            <div className="mb-4">
              <UserSearchInput />
            </div>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-slate-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 inline-block mr-2" />
                Dashboard
              </Link>
              <Link 
                to="/matches" 
                className="p-2 hover:bg-slate-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4 inline-block mr-2" />
                Matches
              </Link>
              <Link 
                to="/messages" 
                className="p-2 hover:bg-slate-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="h-4 w-4 inline-block mr-2" />
                Messages
              </Link>
              <Link 
                to="/profile" 
                className="p-2 hover:bg-slate-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 inline-block mr-2" />
                My Profile
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      {/* Video Call Modal */}
      {videoCallOpen && (
        <VideoCallModal isOpen={videoCallOpen} onClose={() => setVideoCallOpen(false)} />
      )}
    </>
  );
};

export default HeaderBar;
