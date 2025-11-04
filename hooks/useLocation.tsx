"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface LocationContextType {
  country: string | null;
  city: string | null;
  isIndia: boolean;
  currencySymbol: string;
  loading: boolean;
  permission: 'granted' | 'denied' | 'prompt' | null;
  requestLocation: () => void; // Function to re-request permission
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Helper functions (getCountryFromCoords, getCityFromCoords) remain the same
const getCountryFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
    const data = await response.json();
    return data.address.country_code?.toUpperCase() || null;
  } catch (error) {
    console.error("Error fetching country from coords:", error);
    return null;
  }
};

const getCityFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || data.address.county || null;
  } catch (error) {
    console.error("Error fetching city from coords:", error);
    return null;
  }
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [isIndia, setIsIndia] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);

  // Function to fetch and set location, now made reusable and checks localStorage
  const fetchAndSetLocation = useCallback(async () => {
    setLoading(true);
    setPermission(null); // Reset permission state before attempting

    // 1. Check if location is already stored in localStorage
    const storedLocation = localStorage.getItem('pb_user_location');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setCountry(parsedLocation.country);
        setCity(parsedLocation.city);
        setIsIndia(parsedLocation.isIndia);
        setCurrencySymbol(parsedLocation.currencySymbol);
        setPermission('granted'); // Assume granted if stored
        setLoading(false);
        return; // Exit if stored location is used
      } catch (e) {
        console.error("Failed to parse stored location, fetching new.", e);
        localStorage.removeItem('pb_user_location'); // Clear invalid storage
      }
    }

    // 2. If no stored location or parsing failed, proceed with geolocation
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      setPermission('denied'); // Treat as denied if not supported
      setLoading(false);
      return;
    }

    try {
      const geoPermission = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(geoPermission.state);

      if (geoPermission.state === 'granted' || geoPermission.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const detectedCountry = await getCountryFromCoords(latitude, longitude);
            const detectedCity = await getCityFromCoords(latitude, longitude);

            const newIsIndia = detectedCountry === 'IN';
            const newCurrencySymbol = newIsIndia ? '₹' : '$';

            setCountry(detectedCountry);
            setCity(detectedCity);
            setIsIndia(newIsIndia);
            setCurrencySymbol(newCurrencySymbol);
            setPermission('granted'); // Explicitly set to granted on success

            // Store the fetched location
            localStorage.setItem('pb_user_location', JSON.stringify({
              country: detectedCountry,
              city: detectedCity,
              isIndia: newIsIndia,
              currencySymbol: newCurrencySymbol,
            }));
            setLoading(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setPermission('denied'); // Set to denied on error
            setLoading(false);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
      } else {
        // If permission is 'denied' initially, and no stored location
        setLoading(false);
      }
    } catch (error) {
      console.error("Error querying geolocation permission:", error);
      setPermission('denied');
      setLoading(false);
    }
  }, []);

  // Effect to run on component mount to initiate location fetching
  useEffect(() => {
    fetchAndSetLocation();
  }, [fetchAndSetLocation]);

  // Function to allow re-requesting location (e.g., from a "Try Again" button)
  const requestLocation = useCallback(() => {
    localStorage.removeItem('pb_user_location'); // Clear stored location to force re-fetch
    fetchAndSetLocation();
  }, [fetchAndSetLocation]);

  const value = {
    country,
    city,
    isIndia,
    currencySymbol,
    loading,
    permission,
    requestLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};