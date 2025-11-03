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
        // REMOVE THE TEMPORARY DELAY HERE if you added it for testing
        // await new Promise(resolve => setTimeout(resolve, 1500)); 

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

  // RE-ENABLE THE LOCAL LOADING STATE HERE
  if (loadingClients || locationLoading) {
    return (
      <div className='clients-section loading-state'>
        <div className="text-container">
          <h2>Loading Clients...</h2>
          <p>Please wait while we fetch available opportunities.</p>
        </div>
        <div className="spinner-container">
          <div className="spinner"></div> {/* Use the same spinner style */}
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
          return (
            <ClientCard
              key={client.id}
              id={client.id}
              displayId={formatClientId(client.id)}
              location={city || 'Your Area'}
              price={formatEarnings(client.earnings)}
              currencySymbol={currencySymbol}
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