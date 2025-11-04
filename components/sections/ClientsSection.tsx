'use client';

import React, { useEffect, useState } from 'react';
import ClientCard from '../ClientCard';
import { useLocation } from '@/hooks/useLocation';

interface Client {
  id: string;
  images: string[];
  earnings: number;
  location?: string;
  category: 'STANDARD' | 'PREMIUM';
}

// Helper to generate a single random date/time string
const generateSingleRandomDateTime = () => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 8) + 7; // 7 to 14 days from now
  const futureDate = new Date(today.setDate(today.getDate() + randomDays));
  
  const timeSlots = ["1PM - 5PM", "7PM - 12AM", "9PM - 2AM", "8PM - 1AM"];
  const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  
  return `${futureDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short'
  })}, ${randomTime}`;
};

// NEW: Helper to get or generate persistent date/time for a client
const getOrGeneratePersistentDateTime = (clientId: string) => {
  const storageKey = `client_datetime_${clientId}`;
  const storedData = localStorage.getItem(storageKey);
  const expiryDuration = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

  if (storedData) {
    try {
      const { dateTime, expiry } = JSON.parse(storedData);
      if (new Date().getTime() < expiry) {
        return dateTime; // Return stored if not expired
      }
    } catch (e) {
      console.error("Failed to parse stored client datetime:", e);
      localStorage.removeItem(storageKey); // Clear corrupted data
    }
  }

  // If no valid stored data, generate new and store
  const newDateTime = generateSingleRandomDateTime();
  const newExpiry = new Date().getTime() + expiryDuration;
  localStorage.setItem(storageKey, JSON.stringify({ dateTime: newDateTime, expiry: newExpiry }));
  return newDateTime;
};


const formatClientId = (fullId: string) => {
  const numericId = parseInt(fullId.slice(-3), 16) % 1000;
  return `Client #${numericId.toString().padStart(3, '0')}`;
};

const ClientsSection = () => {
  const { city, isIndia, currencySymbol, loading: locationLoading } = useLocation();

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

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

  const formatEarnings = (earnings: number) => {
    if (isIndia) {
      return earnings;
    } else {
      const multiplicationFactor = 5.5;
      const inrToUsdRate = 83;
      const multipliedInr = earnings * multiplicationFactor;
      const rawUsdPrice = multipliedInr / inrToUsdRate;
      return Math.round(rawUsdPrice / 10) * 10;
    }
  };

  if (loadingClients || locationLoading) {
    return (
      <div className='clients-section loading-state'>
        <div className="text-container">
          <h2>Loading Clients...</h2>
          <p>Please wait while we fetch available opportunities.</p>
        </div>
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const standardClients = clients.filter(client => client.category === 'STANDARD');
  const premiumClients = clients.filter(client => client.category === 'PREMIUM');

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
          return (
            <ClientCard
              key={client.id}
              id={client.id}
              displayId={formatClientId(client.id)}
              location={city || 'Your Area'}
              price={formatEarnings(client.earnings)}
              currencySymbol={currencySymbol}
              imageUrl={`/${client.images[0]}`}
              dateTime={getOrGeneratePersistentDateTime(client.id)}
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
          return (
            <ClientCard
              key={client.id}
              id={client.id}
              displayId={formatClientId(client.id)}
              location={city || 'Your Area'}
              price={formatEarnings(client.earnings)}
              currencySymbol={currencySymbol}
              imageUrl={`/${client.images[0]}`}
              dateTime={getOrGeneratePersistentDateTime(client.id)}
              isInitiallyExpanded={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ClientsSection;