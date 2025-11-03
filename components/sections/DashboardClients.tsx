'use client';

import React, { useEffect, useState } from 'react';
import ClientCard from '../ClientCard';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/useLocation'; // 1. Import the global hook

interface Client {
  id: string;
  images: string[];
  earnings: number;
  location?: string;
  category: 'STANDARD' | 'PREMIUM';
}

// 2. All local location helper functions have been removed.
// (getCityFromCoords, getCountryCodeFromCoords, etc. are now in the context)

// Helper to generate random future date (remains here as it's component-specific)
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

// Add formatClientId helper (remains here)
const formatClientId = (fullId: string) => {
  const numericId = parseInt(fullId.slice(-3), 16) % 1000;
  return `Client #${numericId.toString().padStart(3, '0')}`;
};

const DashboardClients = () => {
  // 3. Use the global context for all location data. Local state is gone.
  const { city, isIndia, currencySymbol, loading: locationLoading } = useLocation();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const router = useRouter();

  // 4. All useEffects and functions for requesting location are removed.

  // Fetch clients (this logic remains)
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Function to format earnings, now using `isIndia` from the global context
  const formatEarnings = (earnings: number) => {
    if (isIndia) {
      return earnings; // Return the base price
    } else {
      // Perform the conversion for non-India users
      const multiplicationFactor = 5.5;
      const inrToUsdRate = 83;
      const multipliedInr = earnings * multiplicationFactor;
      const rawUsdPrice = multipliedInr / inrToUsdRate;
      return Math.round(rawUsdPrice / 10) * 10;
    }
  };

  // 5. The complex loading and permission-denied states are removed.
  // The LocationGate component now handles this globally.
  if (loadingClients || locationLoading) {
    return <div>Loading Clients...</div>;
  }

  return (
    <div className='dashboard-clients'>
      {/* 6. Use the `city` from the global context */}
      <h2>Hot Clients Near {city} 🔥</h2>
      <div className="clients-container">
        {clients.slice(0, 10).map((client) => {
          return (
            <ClientCard
              key={client.id}
              id={client.id}
              displayId={formatClientId(client.id)}
              location={city || 'Your Area'} // Use city from context
              price={formatEarnings(client.earnings)} // Pass the calculated price
              currencySymbol={currencySymbol} // Pass the currency symbol from context
              imageUrl={`/${client.images[0]}`}
              dateTime={generateRandomDate()}
              isInitiallyExpanded={false}
            />
          );
        })}
      </div>
      <button className='view-all-btn' onClick={() => {router.push('/clients');}}>View All</button>
    </div>
  );
};

export default DashboardClients;