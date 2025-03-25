
import React, { useState } from 'react';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, MapPin, RefreshCw, Search } from 'lucide-react';
import MatchCard from '@/components/matchmaking/MatchCard';

const MatchesPage = () => {
  // State for filters
  const [industry, setIndustry] = useState<string>('');
  const [distance, setDistance] = useState<number>(25);
  const [searchInput, setSearchInput] = useState<string>('');
  
  const geolocation = useGeolocation();
  
  // Use the matchmaking hook
  const { 
    matches, 
    isLoading, 
    error, 
    refreshMatches, 
    expandSearchRadius 
  } = useMatchmaking({
    filters: {
      industry: industry || undefined,
      distance,
    },
    enabled: true,
  });
  
  // Handle location request
  const handleRequestLocation = async () => {
    await geolocation.requestLocation();
    refreshMatches(); // Refresh matches after getting location
  };
  
  // Handle search filter
  const filteredMatches = searchInput.trim() 
    ? matches.filter(match => 
        match.full_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        match.username.toLowerCase().includes(searchInput.toLowerCase()) ||
        match.industry?.toLowerCase().includes(searchInput.toLowerCase()) ||
        match.bio?.toLowerCase().includes(searchInput.toLowerCase())
      )
    : matches;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Filters Section */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Any industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any industry</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <span className="text-sm text-muted-foreground">{distance} km</span>
                </div>
                <Input
                  id="distance"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={handleRequestLocation}
                  disabled={geolocation.loading}
                >
                  {geolocation.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {geolocation.latitude && geolocation.longitude 
                    ? 'Update Location' 
                    : 'Share Location'}
                </Button>
                {!geolocation.latitude && !geolocation.longitude && !geolocation.loading && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Share your location to find nearby matches
                  </p>
                )}
              </div>
              
              <Button 
                onClick={refreshMatches}
                variant="default" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Find Matches
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search matches by name, username, or industry"
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="text-center p-6">
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={expandSearchRadius}>
                  Expand Search Radius
                </Button>
                <Button onClick={refreshMatches}>
                  Try Again
                </Button>
              </div>
            </Card>
          ) : filteredMatches.length === 0 ? (
            <Card className="text-center p-6">
              <p className="text-muted-foreground mb-4">No matches found with your current filters.</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => {
                  setIndustry('');
                  setSearchInput('');
                  refreshMatches();
                }}>
                  Clear Filters
                </Button>
                <Button onClick={expandSearchRadius}>
                  Expand Search Radius
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} profile={match} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
