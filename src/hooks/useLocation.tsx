
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateUserCoordinates } from '@/services/MatchmakingService';
import { useAuth } from '@/contexts/AuthContext';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = (autoUpdate = true) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true
  });
  const { user } = useAuth();

  const requestLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true }));
    
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by your browser",
        loading: false
      });
      toast.error("Geolocation is not supported by your browser");
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLocation({
        latitude,
        longitude,
        error: null,
        loading: false
      });

      // If user is logged in and autoUpdate is true, update their coordinates in the database
      if (user?.id && autoUpdate) {
        try {
          await updateUserCoordinates(user.id, latitude, longitude);
          console.log("User coordinates updated in database");
        } catch (error) {
          console.error("Failed to update user coordinates:", error);
        }
      }

      return true;
    } catch (error) {
      let message = "Failed to get location";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
      }
      
      setLocation({
        latitude: null,
        longitude: null,
        error: message,
        loading: false
      });
      toast.error(message);
      return false;
    }
  };

  useEffect(() => {
    // Request location when component mounts if autoUpdate is true
    if (autoUpdate) {
      requestLocation();
    }
  }, [autoUpdate]);

  return {
    ...location,
    requestLocation
  };
};
