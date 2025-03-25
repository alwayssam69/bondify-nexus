
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseGeolocationProps {
  enableHighAccuracy?: boolean;
  showErrorToasts?: boolean;
}

export const useGeolocation = ({
  enableHighAccuracy = true,
  showErrorToasts = true
}: UseGeolocationProps = {}) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setError(errorMsg);
      if (showErrorToasts) toast.error(errorMsg);
      return false;
    }

    setLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy, timeout: 10000, maximumAge: 60000 }
        );
      });

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      let errorMsg = "Failed to get location";
      
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable location services.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable";
            break;
          case err.TIMEOUT:
            errorMsg = "Location request timed out";
            break;
        }
      }
      
      setError(errorMsg);
      if (showErrorToasts) toast.error(errorMsg);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    // Initial location request
    requestLocation();
  }, []);

  return {
    latitude,
    longitude,
    error,
    loading,
    requestLocation
  };
};
