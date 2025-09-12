import Image from 'next/image'
import React from 'react'

const Whyus = () => {
  return (
    <div className='whyus-section'>
        <h3 className='heading whyus'>Why Choose Us?</h3>
        <div className="why-us-cards-container">
            <div className="why-us-card">
                <div className="text-container">
                    <Image src="/assets/why-us/verified.png" alt="Expertise Icon" width={48} height={48} />   
                    <h4 className='subheading'>Verified Clients</h4>
                    <p>Har client profile verify hoti hai.</p>
                </div>
                <Image src="/assets/why-us/girls.png" alt="Verified Clients" width={240} height={160} />
            </div>
            <div className="why-us-card">
                <div className="text-container">
                    <Image src="/assets/why-us/payments.png" alt="Expertise Icon" width={48} height={48} />   
                    <h4 className='subheading'>Guaranteed Payments</h4>
                    <p>Booking ke pehle hi security system ensure karta hai ki paisa milega hi.</p>
                </div>
            </div>

            <div className="why-us-card">
                <div className="text-container">
                    <Image src="/assets/why-us/secure.png" alt="Expertise Icon" width={48} height={48} />   
                    <h4 className='subheading'>Safe & Secure</h4>
                    <p>Aapki identity aur details bilkul safe hain.</p>
                </div>
            </div>

            <div className="why-us-card">
                <div className="text-container">
                    <Image src="/assets/why-us/global.png" alt="Expertise Icon" width={48} height={48} />   
                    <h4 className='subheading'>Global Network</h4>
                    <p>India se lekar Dubai, Singapore, Europe tak kaam milta hai.</p>
                </div>
            </div>

            <div className="why-us-card">
                <div className="text-container">
                    <Image src="/assets/why-us/support.png" alt="Expertise Icon" width={48} height={48} />   
                    <h4 className='subheading'>24x7 Support</h4>
                    <p>Humari support team hamesha available hai.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Whyus