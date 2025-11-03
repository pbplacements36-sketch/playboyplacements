'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';

// --- Helper Functions (Centralized) ---
const getCityFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    if (!response.ok) throw new Error('Failed to fetch location');
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Unknown City';
  } catch (error) {
    console.error("Reverse geocoding failed for city:", error);
    return 'Unknown City';
  }
};

const getCountryCodeFromCoords = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    if (!response.ok) throw new Error('Failed to fetch country');
    const data = await response.json();
    return data.address.country_code?.toUpperCase() || 'IN';
  } catch (error) {
    console.error("Reverse geocoding failed for country:", error);
    return 'IN';
  }
};

// --- Context Definition ---
interface LocationContextType {
  city: string | null;
  country: string | null;
  permission: 'prompt' | 'granted' | 'denied';
  loading: boolean;
  isIndia: boolean;
  currencySymbol: '₹' | '$';
  requestLocation: () => void; // Function to re-trigger the request
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// --- Custom Hook for easy consumption ---
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

// --- Provider Component ---
export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [loading, setLoading] = useState(true);

  const handleSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    const fetchedCity = await getCityFromCoords(latitude, longitude);
    const fetchedCountry = await getCountryCodeFromCoords(latitude, longitude);
    
    setCity(fetchedCity);
    setCountry(fetchedCountry);
    setPermission('granted');
    setLoading(false);
  };

  const handleError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error.message);
    setPermission('denied');
    setLoading(false);
  };

  const requestLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setPermission('denied');
      setLoading(false);
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else if (permissionStatus.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else if (permissionStatus.state === 'denied') {
        setPermission('denied');
        setLoading(false);
      }
      permissionStatus.onchange = () => {
        if (permissionStatus.state === 'granted') requestLocation();
      };
    });
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const isIndia = useMemo(() => country === 'IN', [country]);
  const currencySymbol = useMemo(() => (isIndia ? '₹' : '$'), [isIndia]);

  const value: LocationContextType = {
    city,
    country,
    permission,
    loading,
    isIndia,
    currencySymbol,
    requestLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};