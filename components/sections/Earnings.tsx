import Image from 'next/image'
import React from 'react'

const Earnings = () => {
  return (
    <div className='earnings-section'>
        <h3 className='heading earnings'>Earnings Potential</h3>
        <div className="earning-cards-container">
            <div className="earning-card">
                <div className="text-container">
                    <span>INDIA AVERAGE PER BOOKING</span>
                    <h2>₹25,000 - ₹100,000</h2>
                </div>
                <Image src="/assets/earnings/graph.svg" alt="India Earnings" width={120} height={120} />
            </div>
            <div className="earning-card">
                <div className="text-container">
                    <span>INTERNATIONAL BOOKINGS</span>
                    <h2>$20,000<span>/m</span></h2>
                    <div className="image-container">
                        <Image src="/assets/earnings/flag-1.png" alt="USA Earnings" width={40} height={40} />
                        <Image src="/assets/earnings/flag-2.png" alt="UK Earnings" width={40} height={40} />
                        <Image src="/assets/earnings/flag-3.png" alt="UAE Earnings" width={40} height={40} />
                        <Image src="/assets/earnings/flag-4.png" alt="Singapore Earnings" width={40} height={40} />
                    </div>
                    <Image className='earth' src="/assets/earnings/earth.gif" alt="International Earnings" width={120} height={120} />
                </div>
                
            </div>
            <div className="earning-card">
                <div className="text-container">
                    <span>TOP MEMBER EARNS UPTO</span>
                    <h2 className='member-heading'>₹5 LAKH - ₹10 LAKH<span>/m</span></h2>
                </div>
                <Image className='coins' src="/assets/earnings/coins.png" alt="India Earnings" width={120} height={120} />
            </div>
        </div>
    </div>
  )
}

export default Earnings