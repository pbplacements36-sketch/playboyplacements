"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface ClientCardProps {
  id: string;
  displayId: string;
  location: string;
  price: number;
  currencySymbol: string; // Add this new prop
  imageUrl: string;
  dateTime?: string;
  isInitiallyExpanded?: boolean;
}

const ClientCard: React.FC<ClientCardProps> = ({
  id,
  displayId,
  location,
  price,
  currencySymbol, // Destructure the new prop
  imageUrl,
  dateTime = '21 Sept, 7PM-12AM',
  isInitiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const router = useRouter();

  // Collapsed View
  if (!isExpanded) {
    return (
      <div className='client-card'>
        <div className="image-container">
            <Image src={imageUrl} alt={displayId} width={150} height={150} />
        </div>
        <div className="text-container">
            <div className="details">
                <h3>{displayId}</h3>
                <div className="location-details">
                    <Image src="/assets/verified-clients/location-light.png" alt="Location Icon" width={20} height={20} />
                    <p>
                        {location}
                    </p>
                    <p>•</p>
                    {/* Use currencySymbol here */}
                    <h3>{currencySymbol}{price.toLocaleString()}</h3>
                </div>   
            </div>
            <button onClick={() => router.push(`/client/${id}`)}>View</button>
        </div>
      </div>
    );
  }

  // Expanded View
  return (
    <div className='client-card expanded'>
        <div className="expanded-details">
            <div className="image-container">
                <Image src={imageUrl} alt={displayId} width={150} height={150} />
            </div>
            <div className="text-container">      
              <div className="client-details">
                <h3>{displayId}</h3>
                <div className="verified">
                  <Image src="/assets/dashboard/verified.png" alt="Verified Badge" width={100} height={100} />
                  <span>Verified</span>
                </div>
              </div>
              <div className="other-details">
                <div className="detail">
                  <Image src="/assets/verified-clients/location-light.png" alt="Location Icon" width={20} height={20} />
                  <p>
                      {location}
                  </p>
                </div>
                <div className="detail">
                  <Image src="/assets/dashboard/time.svg" alt="Location Icon" width={20} height={20} />
                  <p>
                      {dateTime}
                  </p>
                </div>
                <div className="detail">
                  <Image src="/assets/dashboard/money.png" alt="Location Icon" width={20} height={20} />
                  {/* Use currencySymbol here */}
                  <h3>{currencySymbol}{price.toLocaleString()}</h3>
                </div>
              </div>   
            </div>
        </div>
        <button onClick={() => router.push(`/client/${id}`)}>View & Book</button>
      </div>
  );
};

export default ClientCard;