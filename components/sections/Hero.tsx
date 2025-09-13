import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className='hero-section'>
        <div className="text-container">
            <h1 className='heading hero'>Real Clients. Real Meetings. Real Cash.</h1>
            <p className='subheading hero'>PlayboyPlacement ek professional platform hai jahan verified ladkiyan aapse milna chahti hain, aapke saath time spend karti hain aur uske badle me aapko handsome payment karti hain. Safe, secure aur 100% genuine system.</p>

            <div className="btn-container">
                <Link href="/auth" className='btn-primary'>Create Free Profile</Link>
                <Link href="#" className='btn-secondary'>Learn More</Link>
            </div>
        </div>
        <Image src="/assets/hero-bg.png" alt="Hero Image" width={600} height={400} />
    </div>
  )
}

export default Hero