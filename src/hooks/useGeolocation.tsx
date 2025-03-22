
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  watch?: boolean;
  showErrorToasts?: boolean;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      const errorMessage = 'Geolocation is not supported by your browser';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      
      if (options.showErrorToasts) {
        toast.error(errorMessage);
      }
      return;
    }

    const geoOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      maximumAge: options.maximumAge ?? 30000,
      timeout: options.timeout ?? 27000,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        isLoading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = '';
      switch (error.code) {
        case 1:
          errorMessage = 'Permission denied. Please allow location access to find matches near you.';
          break;
        case 2:
          errorMessage = 'Position unavailable. Could not determine your location.';
          break;
        case 3:
          errorMessage = 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage = error.message || 'An unknown error occurred.';
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      
      if (options.showErrorToasts) {
        toast.error(errorMessage);
      }
    };

    let watchId: number | null = null;

    if (options.watch) {
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options.enableHighAccuracy, options.maximumAge, options.timeout, options.watch, options.showErrorToasts]);

  return state;
};
