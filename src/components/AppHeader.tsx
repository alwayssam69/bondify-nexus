
import React from "react";
import { Link } from "react-router-dom";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 font-bold">
            <span>Professional Network</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80">
              Dashboard
            </Link>
            <Link to="/matches" className="transition-colors hover:text-foreground/80">
              Matches
            </Link>
            <Link to="/chat" className="transition-colors hover:text-foreground/80">
              Messages
            </Link>
            <Link to="/profile" className="transition-colors hover:text-foreground/80">
              Profile
            </Link>
          </nav>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <GlobalSearch />
          </div>
          
          <ThemeToggle />
          
          {user && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          )}
          
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
