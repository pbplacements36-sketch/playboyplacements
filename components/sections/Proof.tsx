import Image from 'next/image'
import React from 'react'

const Proof = () => {
  return (
    <div className='proof-section'>
        <div className="text-container">
            <h3 className='heading proof'>Real Proofs. Real Clients. <span>Real Earnings.</span></h3>
            <p className='subheading proof'>Hum sirf claims nahi karte – yeh hai asli WhatsApp chats jahan hamare members ne clients se meetings fix ki aur payments receive kiya. Aap bhi next ho sakte ho.</p>
        </div>
        <div className="image-container">
            <Image src="/assets/proofs/proof.png" alt="Proof" width={800} height={600} />
            <Image src="/assets/proofs/proof.png" alt="Proof" width={800} height={600} />
        </div>
    </div>
  )
}

export default Proof