import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <>
    <div className='footer-section'>
        <div className="text-container">
            <Image src="assets/logo-dark.svg" alt="Logo" width={120} height={40} />
            <p>PlayboyPlacements is a trusted platform connecting verified clients with professional playboys. Our mission is to provide safe, secure, and profitable opportunities for individuals looking to earn while enjoying exclusive experiences.</p>
        </div>
        <div className="links-container">
            <div className="link">
                <h3>Quick Links</h3>
                <div className="links">
                    <Link href="#">Home</Link>
                    <Link href="#">About Us</Link>
                    <Link href="#">How It Works</Link>
                    <Link href="#">Plans & Pricing</Link>
                    <Link href="#">FAQs</Link>
                    <Link href="#">Contact Us</Link>
                    <Link href="#">Login/Signup</Link>
                </div>
            </div>

            <div className="link">
                <h3>Reach Us At</h3>
                <div className="links reach-us">
                    <div className="item">
                        <Image src="assets/footer/Mail.png" alt="Location" width={16} height={16} />
                        <span>support@playboyplacements.com</span>
                    </div>
                    <div className="item">
                        <Image src="assets/footer/phone.png" alt="Location" width={16} height={16} />
                        <span>+91 8832903020</span>
                    </div>
                    <div className="item">
                        <Image src="assets/footer/office.png" alt="Location" width={16} height={16} />
                        <div className="office">
                            <span>Karnataka Office</span>
                            <p>B-29, 3rd Floor, Devasandra Main Rd, Bangalore, Karnataka, 560049</p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div className="download-container">
            <Image src="assets/footer/app-store.png" alt="App Store" width={150} height={50} />
            <Image src="assets/footer/play-store.png" alt="Play Store" width={150} height={50} />
        </div>
        <span className='soon'>launching soon</span>
    </div>
    <div className="social-container">
        <p>Copyright © 2015-2025 Playboyplacements. All Rights Reserved.</p>
        <div className="icons">
            <Image src="assets/social-icons/fb.png" alt="Facebook" width={24} height={24} />
            <Image src="assets/social-icons/ig.png" alt="Instagram" width={24} height={24} />
            <Image src="assets/social-icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
            <Image src="assets/social-icons/x.png" alt="Twitter" width={24} height={24} />
            <Image src="assets/social-icons/yt.png" alt="Twitter" width={24} height={24} />
        </div>
    </div>
    </>
  )
}

export default Footer