
import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/matchmaking';
import { getProximityMatches } from '@/services/MatchmakingService';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { toast } from 'sonner';

interface UseGeoMatchmakingProps {
  radiusKm?: number;
  enabled?: boolean;
  limit?: number;
}

export const useGeoMatchmaking = ({
  radiusKm = 50,
  enabled = true,
  limit = 20
}: UseGeoMatchmakingProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const { user } = useAuth();
  const { latitude, longitude, error: locationError, requestLocation } = useLocation(false);

  const fetchNearbyMatches = async () => {
    if (!user?.id) {
      setMatches([]);
      setError("Please log in to find matches");
      return;
    }

    if (!latitude || !longitude) {
      const locationSuccess = await requestLocation();
      if (!locationSuccess) {
        setError("Location is required for finding nearby matches");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const nearbyMatches = await getProximityMatches(user.id, radiusKm, limit);
      
      if (nearbyMatches.length > 0) {
        setMatches(nearbyMatches);
      } else {
        setError("No matches found within " + radiusKm + "km. Try expanding your search radius.");
      }
    } catch (error) {
      console.error("Error finding nearby matches:", error);
      setError("Failed to find nearby matches. Please try again later.");
      toast.error("Error finding nearby matches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && user?.id) {
      fetchNearbyMatches();
    }
  }, [enabled, user?.id, radiusKm]);

  const expandSearchRadius = () => {
    const newRadius = Math.min(radiusKm + 25, 100);
    toast.info(`Expanded search radius to ${newRadius}km`);
    return newRadius;
  };

  return {
    isLoading,
    error,
    matches,
    hasMatches: matches.length > 0,
    refetch: fetchNearbyMatches,
    expandSearchRadius,
    locationEnabled: Boolean(latitude && longitude),
    locationError
  };
};
