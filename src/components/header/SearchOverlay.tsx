
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, User, Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  name: string;
  type: 'user' | 'skill' | 'industry';
  subtitle?: string;
  imageUrl?: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus input when overlay opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Clear search when overlay closes
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
    }
    
    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Search for users by name
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('id, full_name, user_type, industry, image_url')
          .ilike('full_name', `%${searchTerm}%`)
          .limit(5);
          
        if (userError) {
          console.error("Error searching users:", userError);
          return;
        }
        
        // Search for skills
        const { data: skillData, error: skillError } = await supabase
          .from('user_profiles')
          .select('id, full_name, skills')
          .filter('skills', 'cs', `{${searchTerm}}`)
          .limit(3);
          
        if (skillError) {
          console.error("Error searching skills:", skillError);
        }
        
        // Format user results
        const userResults: SearchResult[] = (userData || []).map(user => ({
          id: user.id,
          name: user.full_name || 'Anonymous User',
          type: 'user',
          subtitle: `${user.user_type || 'Professional'} in ${user.industry || 'Various Industries'}`,
          imageUrl: user.image_url
        }));
        
        // Format skill results - each skill becomes a result
        const skillResults: SearchResult[] = [];
        if (skillData) {
          skillData.forEach(profile => {
            const matchingSkills = profile.skills?.filter(skill => 
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            matchingSkills?.forEach(skill => {
              skillResults.push({
                id: `skill-${skill}-${profile.id}`,
                name: skill,
                type: 'skill',
                subtitle: `Skill found in ${profile.full_name || 'user'}'s profile`
              });
            });
          });
        }
        
        // Get unique industry results
        const { data: industryData, error: industryError } = await supabase
          .from('user_profiles')
          .select('industry')
          .ilike('industry', `%${searchTerm}%`)
          .not('industry', 'is', null)
          .limit(3);
          
        if (industryError) {
          console.error("Error searching industries:", industryError);
        }
        
        // Format industry results
        const industries = new Set<string>();
        industryData?.forEach(item => {
          if (item.industry) industries.add(item.industry);
        });
        
        const industryResults: SearchResult[] = Array.from(industries).map(industry => ({
          id: `industry-${industry}`,
          name: industry,
          type: 'industry',
          subtitle: 'Industry'
        }));
        
        // Combine all results
        setResults([...userResults, ...skillResults, ...industryResults]);
      } catch (error) {
        console.error("Error performing search:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  
  const handleResultClick = (result: SearchResult) => {
    onClose();
    
    if (result.type === 'user') {
      navigate(`/profile/${result.id}`);
    } else if (result.type === 'skill') {
      navigate(`/matches?skills=${encodeURIComponent(result.name)}`);
    } else if (result.type === 'industry') {
      navigate(`/matches?industry=${encodeURIComponent(result.name)}`);
    }
  };
  
  const getIconForResultType = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'skill':
      case 'industry':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 overflow-y-auto">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for users, skills, or industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="ml-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-secondary rounded-md cursor-pointer transition-colors flex items-center"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {result.imageUrl ? (
                      <div 
                        className="h-10 w-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${result.imageUrl})` }}
                      />
                    ) : (
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white",
                        result.type === 'user' ? "bg-blue-500" : 
                        result.type === 'skill' ? "bg-purple-500" : "bg-green-500"
                      )}>
                        {getIconForResultType(result.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {result.name}
                      {result.type !== 'user' && (
                        <span className={cn(
                          "ml-2 text-xs px-2 py-0.5 rounded-full",
                          result.type === 'skill' ? "bg-purple-100 text-purple-800" : 
                          "bg-green-100 text-green-800"
                        )}>
                          {result.type === 'skill' ? 'Skill' : 'Industry'}
                        </span>
                      )}
                    </p>
                    {result.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.length > 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <p>No results found for "{searchTerm}"</p>
              <p className="text-sm mt-1">Try searching for different terms</p>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <p>Start typing to search</p>
              <p className="text-sm mt-1">Search for users, skills, or industries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
