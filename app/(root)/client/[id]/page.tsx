'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import BookingSection from '@/components/sections/BookingSection';
import { useLocation } from '@/hooks/useLocation'; // 1. Import the global hook

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


// --- Helpers (non-location related) ---

// Update the getHotelSuggestions function to properly use category
const getHotelSuggestions = async (city: string, category: string) => {
    try {
        const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch hotels');
        }
        const hotels = await response.json();
        return hotels;
    } catch (error) {
        console.error("Error fetching hotel suggestions:", error);
        return []; // Return an empty array on failure
    }
}

// Helper to generate random booking slots 1-2 weeks from now
const generateRandomBookingSlots = (count = 3) => {
    const slots = [];
    const timeRanges = ["1PM - 5PM", "7PM - 12AM", "9PM - 2AM", "8PM - 1AM", "2PM - 7PM"];
    let usedDays: number[] = [];

    for (let i = 0; i < count; i++) {
        const now = new Date();
        let randomDays;
        do {
            randomDays = Math.floor(Math.random() * 8) + 7; // 7 to 14 days from now
        } while (usedDays.includes(randomDays));
        usedDays.push(randomDays);

        const futureDate = new Date(now.setDate(now.getDate() + randomDays));
        const dateString = futureDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const randomTime = timeRanges[Math.floor(Math.random() * timeRanges.length)];
        slots.push({ date: dateString, time: randomTime });
    }
    return slots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort slots by date
};

// --- New helper for persistent slots ---
const getOrGeneratePersistentSlots = (clientId: string) => {
    const storageKey = `bookingSlots_${clientId}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
        try {
            const { slots, expiry } = JSON.parse(storedData);
            // Check if the stored slots are not expired
            if (new Date().getTime() < expiry) {
                return slots;
            }
        } catch (error) {
            console.error("Failed to parse stored slots:", error);
        }
    }

    // If no valid data exists, generate new slots
    const newSlots = generateRandomBookingSlots();
    // Set an expiry date 48 hours from now
    const newExpiry = new Date().getTime() + 48 * 60 * 60 * 1000;

    localStorage.setItem(storageKey, JSON.stringify({ slots: newSlots, expiry: newExpiry }));
    return newSlots;
};


const ClientPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // 3. Use the global context for location data
    const { city, isIndia, currencySymbol, loading: locationLoading } = useLocation();

    const [clientData, setClientData] = useState<any>(null);
    const [slots, setSlots] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [loadingClientData, setLoadingClientData] = useState(true); // New state for client-specific data loading
    
    // fetch current user (this logic remains)
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedMembership = localStorage.getItem('membership');
                console.log('Stored membership:', storedMembership);

                const res = await fetch('/api/me');
                console.log('API Response status:', res.status);
                
                const data = await res.json();
                console.log('API Response data:', data);

                if (data.user) {
                    setUser(data.user);
                    if (data.user.membershipType) {
                        localStorage.setItem('membership', data.user.membershipType);
                    }
                } else {
                    console.log('No user from API, using localStorage membership:', storedMembership);
                    if (storedMembership) {
                        setUser({ membershipType: storedMembership });
                    } else {
                        setUser({ membershipType: 'inactive' });
                        localStorage.setItem('membership', 'inactive');
                    }
                }
            } catch (err) {
                console.error('Failed to load user:', err);
                const fallbackMembership = localStorage.getItem('membership') || 'inactive';
                setUser({ membershipType: fallbackMembership });
            }
        };
        loadUser();
    }, []);

    // Single source of truth for membership type
    const membershipType = user?.membershipType || 
        (typeof window !== 'undefined' ? 
            localStorage.getItem('membership') as ('inactive'|'STANDARD'|'PREMIUM') | null 
            : 'inactive') || 'inactive';

    // Debug log
    useEffect(() => {
        console.log('Current membership type:', membershipType);
    }, [membershipType]);

    // Load all other data once the location (city) is known from the context
    useEffect(() => {
        // Depend on `city` from the context now
        if (!id || !city) return;

        const loadData = async () => {
            setLoadingClientData(true); // Start loading
            try {
                const res = await fetch(`/api/clients/${id}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setClientData(data);

                // Fetch hotel data using `city` from the context
                const hotelData = await getHotelSuggestions(city, data.category);
                setHotels(hotelData);

                // Get booking slots
                const persistentSlots = getOrGeneratePersistentSlots(id);
                setSlots(persistentSlots);
            } catch (error) {
                console.error("Failed to load data:", error);
                setClientData(null);
            } finally {
                setLoadingClientData(false); // End loading
            }
        };

        loadData();
    }, [id, city]); // Dependency array updated to use `city`

    const { formattedEarnings, formattedDeposit } = useMemo<{ formattedEarnings: string; formattedDeposit: string }>(() => {
        if (!clientData) {
            return { formattedEarnings: '...', formattedDeposit: '...' };
        }

        const baseEarnings = clientData.earnings;
        let displayPrice = baseEarnings;
        let locale = 'en-IN';
        let currency = 'INR';

        // Use `isIndia` from the global context
        if (!isIndia) {
            const multiplicationFactor = 5.5;
            const inrToUsdRate = 83;
            const multipliedInr = baseEarnings * multiplicationFactor;
            const rawUsdPrice = multipliedInr / inrToUsdRate;
            const roundedUsdPrice = Math.round(rawUsdPrice / 10) * 10;
            
            displayPrice = roundedUsdPrice;
            locale = 'en-US';
            currency = 'USD';
        }

        const earnings = new Intl.NumberFormat(locale, { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(displayPrice);
        const deposit = new Intl.NumberFormat(locale, { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(displayPrice * 0.20);

        return { formattedEarnings: earnings, formattedDeposit: deposit  };
    }, [clientData, isIndia]);

    // 7. The loading check now uses `locationLoading` from the context AND local loading state.
     if (!clientData || locationLoading || loadingClientData) {
        return (
            <div className='loader-overlay'> {/* Use the global loader-overlay class */}
                <div className="loader-text-content"> {/* New container for text */}
                    <h2>Loading Client Details...</h2>
                    <p>Please wait while we fetch the client's information.</p>
                </div>
                <div className="spinner"></div> {/* Directly use the spinner class */}
            </div>
        );
    }

    // Add this helper function inside the component
    const formatClientId = (fullId: string) => {
        // Extract last 3 digits or generate a number from the hash
        const numericId = parseInt(fullId.slice(-3), 16) % 1000;
        return `Client #${numericId.toString().padStart(3, '0')}`;
    };

    // Helper to check if user can view images
    const canViewImages = () => {
        if (membershipType === 'inactive') return false;
        if (membershipType === 'PREMIUM') return true;
        return membershipType === clientData.category;
    };

    return (
        <div className='client-page'>
            <div className="client-images-wrapper">
                <button 
                    onClick={() => router.push('/clients')}
                    className="back-button"
                >
                    <Image 
                        src="/assets/profile/close.png" 
                        alt="Back" 
                        width={24} 
                        height={24} 
                    />
                </button>

                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    className="mySwiper"
                >
                    {clientData.images.map((src: string, index: number) => (
                        <SwiperSlide key={index}>
                            <div className={`image-wrapper ${!canViewImages() ? 'blurred' : ''}`}>
                                <Image 
                                    src={`/${src}`} 
                                    alt={`Client ${index + 1}`} 
                                    width={300} 
                                    height={300} 
                                    className="client-image" 
                                    style={{ width: '100%', height: 'auto' }} 
                                />
                                
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Only show upgrade overlay if user has STANDARD membership but trying to view PREMIUM */}
                                {membershipType === 'STANDARD' && clientData.category === 'PREMIUM' && (
                                    <div className="upgrade-overlay">
                                        <p>Upgrade to {clientData.category} to view</p>

                                        <button 
                                            onClick={() => router.push('/profile#membership-container')}
                                            className="upgrade-button"
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                )}

                {/* Only show membership notice if user is inactive */}
                {membershipType === 'inactive' && (
                    <div className="membership-notice">
                        <p>Please activate your account to view full-resolution images</p>
                        <button 
                            onClick={() => router.push('/profile#membership-container')}
                            className="activate-button"
                        >
                            Activate Now
                        </button>
                    </div>
                )}
            </div>
            <div className="client-details-container">
                <div className="id-container">
                    <h3>{formatClientId(clientData.id)}</h3>
                    <div className="image-container">
                        <Image src="/assets/dashboard/verified.png" alt="Verified Icon" width={20} height={20} />
                        <span>Verified</span>
                    </div>
                </div>
                <div className="client-info">
                    <div className="item">
                        <Image src="/assets/client-page/location.png" alt="Location Icon" width={20} height={20} />
                        {/* 8. Use `city` from the global context */}
                        <span>{city}</span>
                    </div>
                    <div className="item">
                        <Image src="/assets/client-page/clock.png" alt="Clock Icon" width={20} height={20} />
                        <span>{slots.length > 0 ? `${slots[0].date}, ${slots[0].time}` : 'Fetching slots...'}</span>
                    </div>
                </div>
                {/* Replaced the fantasy container with a category display */}
                <div className="client-category-container">
                    <div className="category-item">
                        <Image src="/assets/dashboard/star.png" alt="Category Icon" width={20} height={20} />
                        <span>{clientData.category} Client</span>
                    </div>
                </div>
            </div>
            <div className="earning-details-container">
                <div className="heading-container">
                    <div className="item">
                        <span>Your Earnings</span>
                        <h1>{formattedEarnings}</h1>
                    </div>
                    <div className="item">
                        <span>Service Type</span>
                        <h1>{clientData.serviceType}</h1>
                    </div>
                </div>
                <div className="info-container">
                    <div className="image-container">
                        <div className="currency-image">
                            {/* 9. Use `currencySymbol` from the global context */}
                            <h1>{currencySymbol}</h1>
                        </div>
                        <p>For this booking, you will earn <span>{formattedEarnings}</span> after completion.</p>
                    </div>
                    <div className="deposit-container">
                        <Image src="/assets/client-page/deposit.png" alt="Deposit Icon" width={40} height={40} />
                        <p>Remember: You must deposit 20% security amount ({formattedDeposit}) to confirm this booking</p>
                    </div>
                </div>
            </div>
            <BookingSection clientData={clientData} hotels={hotels} slots={slots} clientId={formatClientId(clientData.id)} />
        </div>
    )
}

export default ClientPage;