'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ClientCard from '../ClientCard';

interface Client {
  id: string;
  images: string[];
  earnings: number;
  location?: string;
  category: 'STANDARD' | 'PREMIUM';
}

// Helper to get city name from coordinates (already existing)
const getCityFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    if (!response.ok) throw new Error('Failed to fetch location');
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Delhi';
  } catch (error) {
    console.error("Reverse geocoding failed for city:", error);
    return 'Delhi';
  }
};

// Helper to get country code from coordinates (adapted from MembershipForm.tsx)
const getCountryCodeFromCoords = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch country');
        const data = await response.json();
        return data.address.country_code?.toUpperCase() || 'IN'; // Default to India if not found
    } catch (error) {
        console.error("Reverse geocoding failed for country:", error);
        return 'IN'; // Fallback to India on error
    }
};

// Helper to generate random future date
const generateRandomDate = () => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 8) + 7;
  const futureDate = new Date(today.setDate(today.getDate() + randomDays));
  
  const timeSlots = ["1PM - 5PM", "7PM - 12AM", "9PM - 2AM", "8PM - 1AM"];
  const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  
  return `${futureDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short'
  })}, ${randomTime}`;
};

// Format client ID helper
const formatClientId = (fullId: string) => {
  const numericId = parseInt(fullId.slice(-3), 16) % 1000;
  return `Client #${numericId.toString().padStart(3, '0')}`;
};

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [userLocation, setUserLocation] = useState<string>("Delhi");
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null); // New state for country
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true); // New state for location loading

  // Get user's location (city and country)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const city = await getCityFromCoords(latitude, longitude);
          const countryCode = await getCountryCodeFromCoords(latitude, longitude); // Get country code
          setUserLocation(city);
          setDetectedCountry(countryCode);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation("Delhi");
          setDetectedCountry("IN"); // Fallback to India
          setLoadingLocation(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setUserLocation("Delhi");
      setDetectedCountry("IN"); // Fallback to India
      setLoadingLocation(false);
    }
  }, []);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Determine if the user is from India based on the detected country
  const isIndia = useMemo(() => detectedCountry === 'IN', [detectedCountry]);

  if (loading || loadingLocation) { // Wait for both clients and location to load
    return <div>Loading...</div>;
  }

  // Separate clients by category
  const standardClients = clients.filter(client => client.category === 'STANDARD');
  const premiumClients = clients.filter(client => client.category === 'PREMIUM');

  // Function to format earnings based on country
  const formatEarnings = (earnings: number) => {
    if (isIndia) {
      return {
        price: earnings,
        currencySymbol: '₹'
      };
    } else {
      // Constants for calculation
      const multiplicationFactor = 5.5; // The factor to increase the price by (5-6 times)
      const inrToUsdRate = 83; // Approximate conversion rate for 1 USD

      // 1. Multiply the base INR earnings to get the new target INR value
      const multipliedInr = earnings * multiplicationFactor;

      // 2. Convert the new INR value to USD
      const rawUsdPrice = multipliedInr / inrToUsdRate;

      // 3. Round the USD price to the nearest 10 for a cleaner, round figure
      const roundedUsdPrice = Math.round(rawUsdPrice / 10) * 10;

      return {
        price: roundedUsdPrice,
        currencySymbol: '$'
      };
    }
  };

  return (
    <div className='clients-section'>
      <div className="text-container">
        <h2>Available Clients</h2>
        <p>Browse through verified clients and book your next opportunity</p>
      </div>
      <div className="clients-container">
        <div className="label">
          <div className="left"></div>
          <p>Standard Profile</p>
          <div className="right"></div>
        </div>
        {standardClients.map((client) => {
          const { price, currencySymbol } = formatEarnings(client.earnings);
          return (
            <ClientCard
              key={client.id}
              id={client.id}
              displayId={formatClientId(client.id)}
              location={userLocation}
              price={price} // Pass formatted price
              currencySymbol={currencySymbol} // Pass currency symbol
              imageUrl={`/${client.images[0]}`}
              dateTime={generateRandomDate()}
              isInitiallyExpanded={true}
            />
          );
        })}

        <div className="label">
          <div className="left"></div>
          <p>Premium Profile</p>
          <div className="right"></div>
        </div>
        {premiumClients.map((client) => {
          const { price, currencySymbol } = formatEarnings(client.earnings);
          return (
            <ClientCard
              key={client.id}
              id={client.id}
              displayId={formatClientId(client.id)}
              location={userLocation}
              price={price} // Pass formatted price
              currencySymbol={currencySymbol} // Pass currency symbol
              imageUrl={`/${client.images[0]}`}
              dateTime={generateRandomDate()}
              isInitiallyExpanded={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ClientsSection;