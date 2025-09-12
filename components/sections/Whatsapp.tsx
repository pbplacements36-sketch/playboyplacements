import Image from 'next/image'
import React from 'react'

const Whatsapp = () => {
  return (
    <div className='whatsapp-section'>
        <div className="text-container">
            <Image src="/assets/proofs/whatsapp.png" alt="WhatsApp Icon" width={50} height={50} />
            <h2>Live Whatsapp Proofs</h2>
        </div>
        <div className="image-container">
        {Array.from({ length: 17 }).map((_, i) => (
          <Image
            key={i}
            src={`/assets/proofs/chat-${i + 1}.png`}
            alt={`WhatsApp Proof ${i + 1}`}
            width={240}
            height={400}
          />
        ))}
      </div>
    </div>
  )
}

export default Whatsapp