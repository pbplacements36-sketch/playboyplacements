'use client';

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { event } from '@/lib/helpers/track'; // 1. Import the event helper

const Hero = () => {

  return (
    <div className='hero-section'>
        <div className="text-container">
            <h1 className='heading hero'>Real Clients. Real Meetings. Real Cash.</h1>
            <p className='subheading hero'>PlayboyPlacement ek professional platform hai jahan verified ladkiyan aapse milna chahti hain, aapke saath time spend karti hain aur uske badle me aapko handsome payment karti hain. Safe, secure aur 100% genuine system.</p>

            <div className="btn-container">
                <Link
                        href="/auth"
                        className='btn-primary' // Style it like a button
                        onClick={() => {
                            // 3. Fire the analytics event on click
                            event({
                                action: 'click_create_profile',
                                category: 'conversion',
                                label: 'hero_create_profile_button'
                            });
                        }}
                    >
                        Create Free Profile
                    </Link>
                    <Link
                        href="/auth"
                        className='btn-secondary' // Style it like a button
                        onClick={() => {
                            // 3. Fire the analytics event on click
                            event({
                                action: 'login_btn',
                                category: 'conversion',
                                label: 'login_btn'
                            });
                        }}
                    >
                        Login
                    </Link>
            </div>
        </div>
        <Image src="/assets/hero-bg.png" alt="Hero Image" width={600} height={400} />
    </div>
  )
}

export default Hero