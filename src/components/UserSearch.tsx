
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
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error("Please enter a username or name to search");
      return;
    }
    
    setIsSearching(true);
    setNoResults(false);
    
    try {
      let searchQuery = searchTerm.trim();
      // Remove @ symbol if present at the beginning
      if (searchQuery.startsWith('@')) {
        searchQuery = searchQuery.substring(1);
      }
      
      // First try to search by user_tag (exact match)
      let { data: tagResults, error: tagError } = await supabase
        .from('user_profiles')
        .select('id, full_name, user_tag, image_url')
        .eq('user_tag', searchQuery)
        .limit(10);
        
      if (tagError) throw tagError;
      
      // Then try partial matches on username
      if (!tagResults?.length) {
        const { data: nameResults, error: nameError } = await supabase
          .from('user_profiles')
          .select('id, full_name, user_tag, image_url')
          .ilike('user_tag', `%${searchQuery}%`)
          .limit(10);
          
        if (nameError) throw nameError;
        tagResults = nameResults;
      }
      
      // If still no results, try searching by full name
      if (!tagResults?.length) {
        const { data: fullNameResults, error: fullNameError } = await supabase
          .from('user_profiles')
          .select('id, full_name, user_tag, image_url')
          .ilike('full_name', `%${searchQuery}%`)
          .limit(10);
          
        if (fullNameError) throw fullNameError;
        tagResults = fullNameResults;
      }
      
      setResults(tagResults || []);
      setNoResults(!(tagResults && tagResults.length > 0));
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Something went wrong with the search");
      setResults([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          placeholder="Search by username or name (@username)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? (
            <>Searching...</>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {isSearching ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Searching for users...</p>
        </div>
      ) : noResults ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <UserRound className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-medium mb-1">No Users Found</h3>
          <p className="text-muted-foreground text-sm">
            Try a different search term or check the username spelling
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {user.image_url ? (
                        <img 
                          src={user.image_url} 
                          alt={user.full_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserRound className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        @{user.user_tag || 'anonymous'}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(user.id)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default UserSearch;
