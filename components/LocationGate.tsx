'use client';

import { useLocation } from '@/hooks/useLocation';
import React from 'react';

const LocationGate = ({ children }: { children: React.ReactNode }) => {
  const { loading, permission, requestLocation } = useLocation();

  if (loading) {
    return (
      <div className="location-gate">
        <h2>Detecting Your Location...</h2>
        <p>Please wait while we configure the experience for your region.</p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="location-gate">
        <h2>Location Access Required</h2>
        <p>This site requires location access to display relevant clients and pricing. Please enable it in your browser's site settings (click the 🔒 icon) and try again.</p>
        <button className="view-all-btn" onClick={requestLocation}>
          Try Again
        </button>
      </div>
    );
  }

  // If permission is 'granted' or 'prompt' (and not loading), show the app
  return <>{children}</>;
};

export default LocationGate;