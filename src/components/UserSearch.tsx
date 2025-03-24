
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, UserRound } from 'lucide-react';
import { toast } from 'sonner';

interface UserSearchResult {
  id: string;
  full_name: string;
  user_tag: string;
  image_url?: string;
}

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error("Please enter a username to search");
      return;
    }
    
    setIsSearching(true);
    
    try {
      // First try to search by user_tag (exact match)
      let { data: tagResults, error: tagError } = await supabase
        .from('user_profiles')
        .select('id, full_name, user_tag, image_url')
        .eq('user_tag', searchTerm.trim())
        .limit(10);
        
      if (tagError) throw tagError;
      
      // Then try partial matches on username if needed
      if (!tagResults?.length) {
        const { data: nameResults, error: nameError } = await supabase
          .from('user_profiles')
          .select('id, full_name, user_tag, image_url')
          .ilike('user_tag', `%${searchTerm.trim()}%`)
          .limit(10);
          
        if (nameError) throw nameError;
        tagResults = nameResults;
      }
      
      setResults(tagResults || []);
      
      if (!tagResults?.length) {
        toast.info("No users found with that username");
      }
    } catch (error) {
      console.error("Error searching for users:", error);
      toast.error("Failed to search for users");
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </form>
      
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {user.image_url ? (
                      <img 
                        src={user.image_url} 
                        alt={user.full_name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Replace broken image with icon
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                        }}
                      />
                    ) : (
                      <UserRound className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">@{user.user_tag}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewProfile(user.id)}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
