"use client";
import React, { useMemo, useState, useEffect } from 'react'
import { event } from '@/lib/helpers/track';

// Helper to get country code from coordinates using Nominatim (free reverse geocoding)
const getCountryFromCoords = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        // Nominatim returns country_code (e.g., 'IN', 'US')
        return data.address.country_code?.toUpperCase() || 'IN'; // Default to India if not found
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return 'IN'; // Fallback to India on error
    }
};

const packageDetailsData = {
  inr: {
    standard: { name: "Standard", amount: 4499, currency: "₹", currencyCode: "INR" },
    premium: { name: "Premium", amount: 7999, currency: "₹", currencyCode: "INR" },
  },
  usd: {
    standard: { name: "Standard", amount: 300, currency: "$", currencyCode: "USD" },
    premium: { name: "Premium", amount: 600, currency: "$", currencyCode: "USD" },
  }
};

const MembershipForm = ({ user }: { user: any }) => {
  // State to store the country detected by client-side geolocation
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  // State to manage loading status of geolocation
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Effect to get user's geolocation when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const countryCode = await getCountryFromCoords(latitude, longitude);
          setDetectedCountry(countryCode);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error: ", error.message);
          setDetectedCountry('IN'); // Fallback to India on error
          setLoadingLocation(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser, defaulting to India.");
      setDetectedCountry('IN'); // Fallback to India if not supported
      setLoadingLocation(false);
    }
  }, []); // Run only once on component mount

  // Determine if the user is from India based on the detected country
  const isIndia = useMemo(() => detectedCountry === 'IN', [detectedCountry]);
  const currentPackages = isIndia ? packageDetailsData.inr : packageDetailsData.usd;

  const [selectedPackage, setSelectedPackage] = useState<"standard" | "premium">("standard");
  // Initialize selectedMethod based on isIndia, but only after location is loaded
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "usdt">("usdt"); // Default to usdt

  // Update selectedMethod once location is loaded and isIndia is determined
  useEffect(() => {
    if (!loadingLocation) {
      setSelectedMethod(isIndia ? "upi" : "usdt");
    }
  }, [isIndia, loadingLocation]);


  // Function to handle package selection and scroll
  const handlePackageSelect = (packageName: "standard" | "premium") => {
    setSelectedPackage(packageName);
    // Scroll to the payments-container
    const paymentsContainer = document.getElementById('payments-container');
    if (paymentsContainer) {
      paymentsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleActivateNow = () => {
  const packageDetails = currentPackages[selectedPackage];
  const message = `
    User's Name: ${user?.name || ""}
    Email: ${user?.email || ""}
    Age: ${user?.age || ""}
    Phone: ${user?.phone || ""}
    City: ${user?.city || ""}
    Country: ${detectedCountry || user?.country || "N/A"}
    Package: ${packageDetails.name}
    Amount: ${packageDetails.currency}${packageDetails.amount}
    Payment Method: ${selectedMethod.toUpperCase()}`;

    const whatsappUrl = `https://wa.me/918266907660?text=${encodeURIComponent(message)}`;
     event({
        action: 'membership_activate_now',
        category: 'conversion',
        label: 'membership_form',
        value: packageDetails.amount,
     });
    window.open(whatsappUrl, "_blank");
    };

  // Show a loading state while geolocation is being fetched
  if (loadingLocation) {
    return (
      <div className="membership-container" id='membership-container'>
        <h3>Loading Location...</h3>
        <p>Please allow location access to determine pricing and payment methods.</p>
      </div>
    );
  }

  return (
    <div className="membership-container" id='membership-container'>
          <h3>Activate Your Profile<br /><span>Start Earning Today</span></h3>
          <div className="packages-container" id="packages-container">
            <div className="packs-container">
              <div
                className={`package gold-pack ${selectedPackage === "standard" ? "active" : ""}`}
                onClick={() => handlePackageSelect("standard")}
                style={{ cursor: "pointer" }}
              >
                <div className="content">
                  <div className="tag"><p>Standard</p></div>
                  <span>{currentPackages.standard.currency}{currentPackages.standard.amount}</span>
                  <p>For beginners who want to start their journey.</p>
                </div>
                <hr />
                <div className="features">
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Verified Profile Activation</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Access to Basic Client Listings</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Limited Chat Requests</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Standard Profile Visibility</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>24/7 Basic Support</p>
                  </div>
                </div>
                <button
                    className={selectedPackage === "standard" ? "active" : ""}
                    onClick={(e) => { e.stopPropagation(); handlePackageSelect("standard"); }}
                    type="button"
                >
                    Select Now
                </button>
              </div>
              <div
                className={`package best-pack ${selectedPackage === "premium" ? "active" : ""}`}
                onClick={() => handlePackageSelect("premium")}
                style={{ cursor: "pointer" }}
              >
                <div className="content">
                  <div className="tag"><p>Premium</p></div>
                  <span>{currentPackages.premium.currency}{currentPackages.premium.amount}</span>
                  <p>For professionals who want maximum benefits.</p>
                </div>
                <hr />
                <div className="features">
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>All Features of Standard</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Top Profile Placement</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Direct Selecting Priority</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Exclusive High-Paying Clients</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Personal Account Manager</p>
                  </div>
                </div>
                <button
                    className={selectedPackage === "premium" ? "active" : ""}
                    onClick={(e) => { e.stopPropagation(); handlePackageSelect("premium"); }}
                    type="button"
                >
                    Select Now
                </button>
              </div>
            </div>
          </div>
          <div className="payments-container" id='payments-container'>
            <span>select payment</span>
            <div className="method-container">
              {isIndia && (
                <div className={`method ${selectedMethod === "upi" ? "active" : ""}`} onClick={() => setSelectedMethod("upi")}>
                  <img src="/assets/profile/upi.png" alt="UPI" />
                </div>
              )}
              {/* USDT is shown for all, but is the default for non-India */}
              <div className={`method ${selectedMethod === "usdt" ? "active" : ""}`} onClick={() => setSelectedMethod("usdt")}>
                <img src="/assets/profile/usdt.png" alt="USDT" />
                <h3>USDT</h3>
              </div>
            </div>
          </div>
          <button className='btn-primary' onClick={handleActivateNow} type="button">
            Activate Now
          </button>
        </div>
  )
}

export default MembershipForm