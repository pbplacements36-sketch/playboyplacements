import Image from 'next/image'
import React from 'react'

const VerifiedCard = () => {
  return (
    <>
    <div className='verified-card'>
        <div className="images-container">
            <Image src="/assets/verified-clients/1.png" alt="Verified Image 1" width={115} height={120} />
            <Image src="/assets/verified-clients/2.png" alt="Verified Image 2" width={115} height={120} />
            <Image src="/assets/verified-clients/3.png" alt="Verified Image 3" width={115} height={120} />
        </div>
        <div className="icons-container">
            <div className="icon">
                <Image src="/assets/verified-clients/photos.png" alt="Icon 1" width={40} height={40} unoptimized />
                <h3>Real Photos</h3>
            </div>
            <div className="icon">
                <Image src="/assets/verified-clients/verified.png" alt="Icon 1" width={40} height={40} />
                <h3>Verified Profiles</h3>
            </div>
            <div className="icon">
                <Image src="/assets/verified-clients/location.png" alt="Icon 1" width={40} height={40} />
                <h3>Worldwide</h3>
            </div>
        </div>
    </div>
    <div className="badge-container">
        <Image src="/assets/verified-clients/verified-badge.png" alt="Badge" width={100} height={100} />
        <div className="text-container">
            <h3>Sabse badi baat – jo ladki hamare portal pe hai wo asli hai.</h3>
            <p>Har profile check hoti hai, photos asli hote hain, details verify hoti hain. Matlab jo aap dekh rahe ho wahi aapko milne wali hai.</p>
        </div>
    </div>
    </>
    
  )
}

export default VerifiedCard