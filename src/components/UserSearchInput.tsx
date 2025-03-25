
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { useClickAway } from '@/hooks/useClickAway';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

const UserSearchInput = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close search results when clicking outside
  useClickAway(searchRef, () => setIsOpen(false));
  
  const searchUsers = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(5);
      
      if (error) throw error;
      
      setResults(data as User[]);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchUsers(query);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const handleSelectUser = (username: string) => {
    navigate(`/profile/${username}`);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full max-w-xs" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
        )}
      </div>
      
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md border shadow-lg z-50 max-h-60 overflow-auto">
          {results.length === 0 ? (
            <div className="py-2 px-3 text-sm text-muted-foreground">
              {isLoading ? 'Searching...' : 'No users found'}
            </div>
          ) : (
            <ul>
              {results.map((user) => (
                <li 
                  key={user.id} 
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelectUser(user.username)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ''} alt={user.full_name} />
                    <AvatarFallback>
                      {user.full_name.charAt(0) || user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  </div>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;
