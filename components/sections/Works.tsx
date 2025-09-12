import Image from 'next/image'
import React from 'react'

const Works = () => {
  return (
    <div className='works-section'>
        <div className="text-container">
            <h2 className='heading works'>How it Works?</h2>
            <p className='subheading works'>Jitna Zyada Kaam, Utni Zyada Income.</p>
        </div>
        <div className="steps-container">
            <div className="step">
                <div className="image-container">
                    <Image src="/assets/how-it-works/step-1.png" alt="Step 1" width={100} height={100} />
                </div>
                <div className="text-container">
                    <span>Step 1</span>
                    <h4>Free Registration</h4>
                    <p>Apna profile banao – name, age, city, photos add karo.</p>
                </div>
            </div>
             <div className="step">
                <div className="image-container">
                    <Image src="/assets/how-it-works/step-2.png" alt="Step 1" width={100} height={100} />
                </div>
                <div className="text-container">
                    <span>Step 2</span>
                    <h4>Membership Activation</h4>
                    <p>India me ₹500–₹1000, international members ke liye $100 fee. Ye ensure karta hai ki sirf serious log join karein.</p>
                </div>
            </div>
             <div className="step">
                <div className="image-container">
                    <Image src="/assets/how-it-works/step-3.png" alt="Step 1" width={100} height={100} />
                </div>
                <div className="text-container">
                    <span>Step 3</span>
                    <h4>Browse Clients</h4>
                    <p>Verified female clients ke profiles dekho – har ek profile me photos, location, date aur earning likhi hoti hai.</p>
                </div>
            </div>
             <div className="step">
                <div className="image-container">
                    <Image src="/assets/how-it-works/step-4.png" alt="Step 1" width={100} height={100} />
                </div>
                <div className="text-container">
                    <span>Step 4</span>
                    <h4>Secure Booking</h4>
                    <p>Client choose karo, 20–30% refundable deposit do aur booking confirm ho jaati hai.</p>
                </div>
            </div>
             <div className="step">
                <div className="image-container">
                    <Image src="/assets/how-it-works/step-5.png" alt="Step 1" width={100} height={100} />
                </div>
                <div className="text-container">
                    <span>Step 5</span>
                    <h4>Meet & Earn</h4>
                    <p>Client se milo, time spend karo, aur meeting ke baad cash lo.</p>
                </div>
            </div>
             <div className="step">
                <div className="image-container">
                    <Image src="/assets/how-it-works/step-6.png" alt="Step 1" width={100} height={100} />
                </div>
                <div className="text-container">
                    <span>Step 6</span>
                    <h4>Build Career</h4>
                    <p>Har successful booking ke baad aapko aur clients milte hain. Jitna zyada kaam, utni zyada income.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Works