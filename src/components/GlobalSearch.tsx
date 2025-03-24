
import React, { useState, useRef, useEffect } from "react";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { Search, User, BookOpen, Briefcase, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchResult {
  id: string;
  type: "user" | "skill" | "industry";
  name: string;
  subtitle?: string;
  imageUrl?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      performSearch(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // Search for users
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id, full_name, location, industry, user_type, image_url')
        .or(`full_name.ilike.%${query}%, industry.ilike.%${query}%, location.ilike.%${query}%`)
        .limit(5);
        
      if (userError) throw userError;

      // Convert user data to search results
      const userResults: SearchResult[] = userData.map(user => ({
        id: user.id,
        type: "user",
        name: user.full_name || "Anonymous User",
        subtitle: `${user.user_type || "Professional"} in ${user.industry || "Unknown Industry"}`,
        imageUrl: user.image_url
      }));
      
      // Add industry and skill results if query matches
      const industries = ["technology", "finance", "healthcare", "education", "marketing", "design"];
      const skills = ["javascript", "react", "python", "product-management", "marketing", "design"];
      
      const industryResults: SearchResult[] = industries
        .filter(industry => industry.includes(query.toLowerCase()))
        .map(industry => ({
          id: `industry-${industry}`,
          type: "industry",
          name: industry.charAt(0).toUpperCase() + industry.slice(1),
          subtitle: "Industry"
        }));
        
      const skillResults: SearchResult[] = skills
        .filter(skill => skill.includes(query.toLowerCase()))
        .map(skill => ({
          id: `skill-${skill}`,
          type: "skill",
          name: skill.charAt(0).toUpperCase() + skill.slice(1),
          subtitle: "Skill"
        }));

      setResults([...userResults, ...industryResults, ...skillResults]);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setSearchQuery("");
    
    if (result.type === "user") {
      navigate(`/profile/${result.id}`);
    } else if (result.type === "industry") {
      navigate(`/matches?industry=${result.name.toLowerCase()}`);
    } else if (result.type === "skill") {
      navigate(`/matches?skills=${result.name.toLowerCase()}`);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className={`relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 ${
          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
        }`}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">
          <Search className="mr-2 h-4 w-4" />
          Search...
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for people, skills, or industries..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          ref={inputRef}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Searching..." : "No results found."}
          </CommandEmpty>
          
          {results.length > 0 && (
            <>
              {results.some(r => r.type === "user") && (
                <CommandGroup heading="People">
                  {results
                    .filter(r => r.type === "user")
                    .map(result => (
                      <CommandItem 
                        key={result.id} 
                        onSelect={() => handleSelect(result)}
                        className="flex items-center"
                      >
                        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p>{result.name}</p>
                          <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                        </div>
                      </CommandItem>
                    ))
                  }
                </CommandGroup>
              )}
              
              {results.some(r => r.type === "industry") && (
                <CommandGroup heading="Industries">
                  {results
                    .filter(r => r.type === "industry")
                    .map(result => (
                      <CommandItem 
                        key={result.id} 
                        onSelect={() => handleSelect(result)}
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        {result.name}
                      </CommandItem>
                    ))
                  }
                </CommandGroup>
              )}
              
              {results.some(r => r.type === "skill") && (
                <CommandGroup heading="Skills">
                  {results
                    .filter(r => r.type === "skill")
                    .map(result => (
                      <CommandItem 
                        key={result.id} 
                        onSelect={() => handleSelect(result)}
                      >
                        <Hash className="mr-2 h-4 w-4" />
                        {result.name}
                      </CommandItem>
                    ))
                  }
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
