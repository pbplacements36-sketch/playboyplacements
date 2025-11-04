'use client';

import { useLocation } from '@/hooks/useLocation';
import React from 'react';

const LocationGate = ({ children }: { children: React.ReactNode }) => {
  const { loading, permission, requestLocation, country } = useLocation(); // Also get 'country' to check if location data is available

  // If loading, show the spinner
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-text-content">
          <h2>Detecting Your Location...</h2>
          <p>Please wait while we configure the experience for your region.</p>
        </div>
        <div className="spinner"></div>
      </div>
    );
  }

  // If permission is denied AND we don't have a stored location (country is null)
  // This ensures that if a location was previously granted and stored, we don't block even if permission is later denied.
  if (permission === 'denied' && !country) {
    return (
      <div className="loader-overlay"> {/* Reusing the loader-overlay for consistent styling */}
        <div className="loader-text-content">
          <h2>Location Access Blocked</h2>
          <p>
            You've previously blocked location access for this site, or it was denied. To enable it, please go to your browser's site's settings (usually by clicking the 🔒 icon in the address bar), allow location access, and then click 'Try Again'.
          </p>
        </div>
        <button className="view-all-btn" onClick={requestLocation}>
          Try Again
        </button>
      </div>
    );
  }

  // If permission is 'granted' or 'prompt' (and not loading), or if we have a stored location, show the app
  return <>{children}</>;
};

export default LocationGate;