'use client';

import React, { useEffect, useState } from 'react';
import ClientCard from '../ClientCard';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  images: string[];
  earnings: number;
  location?: string;
  category: 'STANDARD' | 'PREMIUM';
}

// Helper to get city name from coordinates
const getCityFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    if (!response.ok) throw new Error('Failed to fetch location');
    const data = await response.json();
    return data.address.city || data.address.town || data.address.village || 'Delhi';
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return 'Delhi'; // Fallback location
  }
};

// Helper to generate random future date
const generateRandomDate = () => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 8) + 7; // 7-15 days from now
  const futureDate = new Date(today.setDate(today.getDate() + randomDays));
  
  const timeSlots = ["1PM - 5PM", "7PM - 12AM", "9PM - 2AM", "8PM - 1AM"];
  const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  
  return `${futureDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short'
  })}, ${randomTime}`;
};

// Add formatClientId helper
const formatClientId = (fullId: string) => {
  const numericId = parseInt(fullId.slice(-3), 16) % 1000;
  return `Client #${numericId.toString().padStart(3, '0')}`;
};

const DashboardClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [userLocation, setUserLocation] = useState<string>("Delhi");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const city = await getCityFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setUserLocation(city);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation("Delhi"); // Fallback to Delhi
        }
      );
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='dashboard-clients'>
      <h2>Hot Clients Near {userLocation} 🔥</h2>
      <div className="clients-container">
        {clients.slice(0, 10).map((client) => (
          <ClientCard
            key={client.id}
            id={client.id}               // Pass the full UUID
            displayId={formatClientId(client.id)}  // Pass the formatted ID for display
            location={userLocation}
            price={client.earnings}
            imageUrl={`/${client.images[0]}`}
            dateTime={generateRandomDate()}
            isInitiallyExpanded={false}
          />
        ))}
      </div>
      <button className='view-all-btn' onClick={() => {router.push('/clients');}}>View All</button>
    </div>
  );
};

export default DashboardClients;