'use client';

import React from 'react';
import LocationGate from './LocationGate'; // Assuming LocationGate is in the same components folder

const LocationRequiredWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LocationGate>
      {children}
    </LocationGate>
  );
};

export default LocationRequiredWrapper;