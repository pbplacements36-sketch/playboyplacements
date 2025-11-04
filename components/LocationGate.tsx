'use client';

import { useLocation } from '@/hooks/useLocation';
import React, { useEffect, useState } from 'react';
import { isInAppBrowser, openInExternalBrowser } from '@/utils/inAppBrowserDetector'; // Import the detector

const LocationGate = ({ children }: { children: React.ReactNode }) => {
  const { loading, permission, requestLocation, country } = useLocation();
  const [isCurrentInAppBrowser, setIsCurrentInAppBrowser] = useState(false);

  useEffect(() => {
    setIsCurrentInAppBrowser(isInAppBrowser());
  }, []);

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
  if (permission === 'denied' && !country) {
    return (
      <div className="loader-overlay">
        <div className="loader-text-content">
          <h2>Location Access Required</h2>
          {isCurrentInAppBrowser ? (
            <>
              <p>
                It looks like you're using an in-app browser (e.g., from Telegram or WhatsApp) which often blocks location access.
                Please open this page in your device's default browser (like Chrome or Safari) to grant location permission.
              </p>
              <button
                className="view-all-btn"
                onClick={() => openInExternalBrowser(window.location.href)} // Attempt to open current URL
              >
                Open in Browser
              </button>
            </>
          ) : (
            <>
              <p>
                You've previously blocked location access for this site, or it was denied. To enable it, please go to your browser's site settings (usually by clicking the 🔒 icon in the address bar), allow location access, and then click 'Try Again'.
              </p>
              <button className="view-all-btn" onClick={requestLocation}>
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // If permission is 'granted' or 'prompt' (and not loading), or if we have a stored location, show the app
  return <>{children}</>;
};

export default LocationGate;