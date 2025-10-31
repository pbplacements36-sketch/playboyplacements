'use client';

import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react' // Import useRef
import { useRouter } from 'next/navigation';



// Helper to format time for the countdown
const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return { hours, minutes, seconds };
};

const BookingSection = ({ clientData, hotels, slots, clientId }: { clientData: any, hotels: any[], slots: any[], clientId: string }) => {
    const [activeHotel, setActiveHotel] = useState(0);
    const [activeSlot, setActiveSlot] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const bookingSectionRef = useRef<HTMLDivElement>(null); // Ref for the main booking section
    const [showFixedCta, setShowFixedCta] = useState(false); // State to control visibility of fixed CTA

    const router = useRouter();
    // Build and open WhatsApp message with selected details
    const handleConfirmAndPay = async () => {
        const selectedHotel = hotels && hotels.length > 0 ? hotels[activeHotel] : null;
        const selectedSlot = slots && slots.length > 0 ? slots[activeSlot] : null;

        // Try to fetch current user info
        let userInfo: any = null;
        try {
            const res = await fetch('/api/me', { headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                const payload = await res.json();
                userInfo = payload.user ?? null;
            }
        } catch (err) {
            console.warn('Failed to fetch /api/me for WhatsApp message', err);
        }

        const msgLines = [
            'Booking Request from App',
            `Client: ${clientId}`,
            clientData?.name ? `Client Name: ${clientData.name}` : null,
            `Client Category: ${clientData?.category ?? 'N/A'}`,
            `Hotel: ${selectedHotel?.name ?? 'N/A'}`,
            selectedHotel?.address ? `Address: ${selectedHotel.address}` : null,
            selectedHotel?.mapUrl ? `Map: ${selectedHotel.mapUrl}` : null,
            `Slot: ${selectedSlot ? `${selectedSlot.date}, ${selectedSlot.time}` : 'N/A'}`,
            `Deposit: ${formattedDeposit}`,
            userInfo ? `User: ${userInfo.name ?? 'Unknown'} (${userInfo.email ?? 'no-email'})` : 'User: Guest',
            '',
            'Please confirm and provide payment instructions.'
        ].filter(Boolean);

        const message = encodeURIComponent(msgLines.join('\n'));
        // Open WhatsApp (no fixed phone number) so user can choose recipient or you can replace with a number
        const waUrl = `https://wa.me/918266907660?text=${message}`;
        window.open(waUrl, '_blank');
    };

    useEffect(() => {
        if (timeLeft === 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    // Intersection Observer to detect when bookingSection is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set showFixedCta to true if any part of the booking section is visible
                setShowFixedCta(entry.isIntersecting);
            },
            {
                root: null, // Use the viewport as the root
                rootMargin: '0px',
                threshold: 0.1, // Trigger when 10% of the target is visible
            }
        );

        if (bookingSectionRef.current) {
            observer.observe(bookingSectionRef.current);
        }

        return () => {
            if (bookingSectionRef.current) {
                observer.unobserve(bookingSectionRef.current);
            }
        };
    }, []); // Run once on component mount

    const { hours, minutes, seconds } = formatTime(timeLeft);
    const formattedDeposit = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(clientData.earnings * 0.20);

    // Function to handle hotel selection and scroll to slots
    const handleHotelSelect = (index: number) => {
        setActiveHotel(index);
        const slotsContainer = document.getElementById('slots-container');
        if (slotsContainer) {
            slotsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <> {/* Use a fragment to return multiple top-level elements */}
            <div className='booking-section' ref={bookingSectionRef}> {/* Attach ref here */}
                <div className="step-container">
                    <div className="text-container">
                        <span>Step 1</span>
                        <h3>Choose Location</h3>
                    </div>
                    <div className="hotels-container" id='hotels-container'>
                        {hotels && hotels.length > 0 ? hotels.map((hotel, index) => (
                            <div key={index} className={`hotel ${activeHotel === index ? 'active' : ''}`} onClick={() => handleHotelSelect(index)}>
                                <Image
                                    src={hotel.imageUrl || "/assets/client-page/hotel.png"}
                                    alt={hotel.name}
                                    width={100}
                                    height={100}
                                    className="hotel-image"
                                />
                                <div className="text-container">
                                    <h4>{hotel.name} {hotel.rating ? `(${hotel.rating} ★)` : ''}</h4>
                                    <div className="amenities-container">
                                        <div className="amenity">
                                            <Image src="/assets/client-page/bathroom.png" alt="Bathroom Icon" width={15} height={15} />
                                            <span>{hotel.amenities.bathrooms} Bathroom</span>
                                        </div>
                                        <div className="amenity">
                                            <Image src="/assets/client-page/bedroom.png" alt="Bedroom Icon" width={15} height={15} />
                                            <span>{hotel.amenities.bedrooms} Bedroom</span>
                                        </div>
                                        {hotel.amenities.wifi && (
                                            <div className="amenity">
                                                <Image src="/assets/client-page/wifi.png" alt="WiFi Icon" width={15} height={15} />
                                                <span>Free WiFi</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="address-container">
                                        <span>ADDRESS</span>
                                        <p className="hotel-address" title={hotel.address}>{hotel.address}</p>
                                    </div>
                                    <div className="maps-container">
                                        <a href={hotel.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                                            <Image src="/assets/client-page/maps.png" alt="Map Icon" width={15} height={15} />
                                            <span>View on Google Maps</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )) : <p>Loading hotel suggestions...</p>}
                    </div>
                </div>
                <div className="step-container">
                    <div className="text-container">
                        <span>Step 2</span>
                        <h3>Choose Date & Time</h3>
                    </div>
                    <div className="slots-container" id='slots-container'>
                        {slots && slots.length > 0 ? slots.map((slot, index) => (
                            <div key={index} className={`slot ${activeSlot === index ? 'active' : ''}`} onClick={() => setActiveSlot(index)}>
                                <span>Slot-{index + 1}</span>
                                <div className="times-container">
                                    <div className="item">
                                        <Image src="/assets/client-page/calender.png" alt="Calender Icon" width={15} height={15} />
                                        <span>{slot.date}</span>
                                    </div>
                                    <div className="item">
                                        <Image src="/assets/client-page/clock.png" alt="Clock Icon" width={15} height={15} />
                                        <span>{slot.time}</span>
                                    </div>
                                </div>
                            </div>
                        )) : <p>Generating available slots...</p>}
                    </div>
                </div>
                <div className="booking-info-container">
                    <div className="info">
                        <Image src="/assets/dashboard/verified.png" alt="Info Icon" width={20} height={20} />
                        <div className="text">
                            <span>You’re Booking: Client {clientId}</span>
                            <p>Activate Premium Membership & Get 0% booking fee for the next 3 sessions!</p>
                        </div>
                    </div>
                    <div className="info pay">
                        <Image src="/assets/client-page/rupee.png" alt="Info Icon" width={20} height={20} />
                        <span className='price-info'>Pay Now: {formattedDeposit} (refundable)</span>
                    </div>
                    <button onClick={() => router.push('/profile#membership-container')}>Get Premium Plan</button>
                </div>
            </div> {/* End of booking-section */}

            {/* These sections are now rendered as siblings and will be fixed at the bottom */}
            <div className={`countdown-section ${showFixedCta ? 'visible' : 'hidden'}`}>
                <div className="text-container">
                    <Image src="/assets/features/quick-setup.png" alt="Clock Icon" width={20} height={20} />
                    <h3>Limited-time offer</h3>
                    <p>This special offer expires in...</p>
                </div>
                <div className="timer">
                    <div className="time-block">
                        <div className="block-container">
                            <span className="number">{hours[0]}</span>
                            <span className="number">{hours[1]}</span>
                        </div>
                        <span className="label">hours</span>
                    </div>
                    <span className="separator">:</span>
                    <div className="time-block">
                        <div className="block-container">
                            <span className="number">{minutes[0]}</span>
                            <span className="number">{minutes[1]}</span>
                        </div>
                        <span className="label">minutes</span>
                    </div>
                    <span className="separator">:</span>
                    <div className="time-block">
                        <div className="block-container">
                            <span className="number">{seconds[0]}</span>
                            <span className="number">{seconds[1]}</span>
                        </div>
                        <span className="label">seconds</span>
                    </div>
                </div>
            </div>
            <div className={`cta-section ${showFixedCta ? 'visible' : 'hidden'}`}>
                <button onClick={handleConfirmAndPay}>Confirm & Pay {formattedDeposit}</button>
                <span>Need help before booking? Contact Support</span>
            </div>
        </>
    )
}

export default BookingSection;