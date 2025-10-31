'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import BookingSection from '@/components/sections/BookingSection';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


// --- Mock Data & Helpers ---

// Helper to get city name from coordinates using a free reverse geocoding service
const getCityFromCoords = async (latitude: number, longitude: number) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        // The city can be in 'city', 'town', or 'village' property
        return data.address.city || data.address.town || data.address.village || 'Delhi';
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return 'Delhi'; // Fallback location
    }
};

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

    const [clientData, setClientData] = useState<any>(null);
    const [slots, setSlots] = useState<any[]>([]);
    const [hotels, setHotels] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<string | null>(null);
    const [currentLocation, setCurrentLocation] = useState<string>("Fetching location...");
    const [user, setUser] = useState<any | null>(null);

    // fetch current user (real way) from server
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

    // Update the geolocation effect
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const city = await getCityFromCoords(latitude, longitude);
                    setCurrentLocation(city);
                    setUserLocation(city);
                },
                (error) => {
                    console.error("Geolocation error: ", error.message);
                    setCurrentLocation("Delhi");
                    setUserLocation("Delhi");
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            setCurrentLocation("Delhi");
            setUserLocation("Delhi");
        }
    }, []); // Runs only once on component mount

    // 2. Load all other data once the location is known
    useEffect(() => {
    if (!id || !userLocation) return;

    const loadData = async () => {
        try {
            console.log('Fetching client with ID:', id);
            
            const res = await fetch(`/api/clients/${id}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Received client data:', data);
            setClientData(data);

            // Fetch hotel data with proper category
            console.log('Fetching hotels for category:', data.category);
            const hotelData = await getHotelSuggestions(userLocation, data.category);
            setHotels(hotelData);

            // Get booking slots
            const persistentSlots = getOrGeneratePersistentSlots(id);
            setSlots(persistentSlots);
        } catch (error) {
            console.error("Failed to load data:", error);
            setClientData(null); // Reset client data on error
        }
    };

    loadData();
}, [id, userLocation]);

    if (!clientData) {
        return <div>Loading...</div>; // Or a loading skeleton
    }

    const formattedEarnings = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(clientData.earnings);
    const formattedDeposit = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(clientData.earnings * 0.20);

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
                                {/* Only show upgrade overlay if user has STANDARD membership but trying to view PREMIUM */}
                                {membershipType === 'STANDARD' && clientData.category === 'PREMIUM' && (
                                    <div className="upgrade-overlay">
                                        <p>Upgrade to {clientData.category} to view</p>
                                        <button 
                                            onClick={() => router.push('/membership')}
                                            className="upgrade-button"
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Only show membership notice if user is inactive */}
                {membershipType === 'inactive' && (
                    <div className="membership-notice" role="alert">
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
                        <span>{currentLocation}</span>
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
                            <h1>₹</h1>
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