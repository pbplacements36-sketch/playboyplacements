"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const navLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];


export default function Navigation() {
  const navBtn = React.useRef<HTMLDivElement>(null);
  const mobileMenu = React.useRef<HTMLDivElement>(null);
  const navigation = React.useRef<HTMLDivElement>(null);
  

  const [navOpen, setnavOpen] = useState(false);

 const navToggle = () => {
    const isNowOpen = !navOpen;
    setnavOpen(isNowOpen);

    navBtn.current?.classList.toggle('nav-open');
    mobileMenu.current?.classList.toggle('open');

    if (isNowOpen) {
      navigation.current?.classList.add('nav-light');
    } else {
      navigation.current?.classList.remove('nav-light');
    }
  };

  return (
    <div className={`navigation`} ref={navigation}>
    
        <Link href="/" className="logo">
          <Image src={navOpen ? "/assets/logo-dark.svg" : "/assets/logo-white.png"} className='w-auto' alt="Playboy Placements" height={48} width={150} unoptimized />
        </Link>
        <div className="nav-btn-wrapper" ref={navBtn} onClick={navToggle}>
            <button className="nav-btn" aria-label="Main Menu" id="btn">
              <svg width="45" height="45" viewBox="0 0 100 100">
                <path className={`line line1`} d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                <path className={`line line2`} d="M 20,50 H 80" />
                <path className={`line line3`} d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
              </svg>
            </button>
          </div>
     
      {/* <div className="mobile-menu" ref={mobileMenu} onClick={navToggle}>

        <div className="bottom-section">
          <p>© Playboy Placements</p>
          <div className="social-container">
            <Link href="#">
              <Image src="/assets/social-icons/linkedin.png" alt="" width={36} height={36} />
            </Link>
            <Link href="#">
              <Image src="/assets/social-icons/ig.png" alt="" width={36} height={36} />
            </Link>
            <Link href="#">
              <Image src="/assets/social/fb.png" alt="" width={36} height={36} />
            </Link>
            <Link href="#">
              <Image src="/assets/social/x.png" alt="" width={36} height={36} />
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
} 