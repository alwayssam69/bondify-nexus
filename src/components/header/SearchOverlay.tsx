
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SearchOverlayProps {
  isOpen: boolean;
}

const SearchOverlay = ({ isOpen }: SearchOverlayProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("searchQuery") as string;
    
    if (query.trim()) {
      toast.info(`Searching for "${query}"`);
      // In a real app, you'd implement search functionality
    }
  };

  return (
    <div className={cn(
      "absolute left-0 right-0 px-6 md:px-10 pb-4 pt-2 bg-white/95 backdrop-blur-lg transition-all duration-300",
      isOpen ? "top-full opacity-100" : "-top-20 opacity-0 pointer-events-none"
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
  );
};

export default SearchOverlay;
