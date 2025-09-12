import React from 'react'
import Image from 'next/image';

const Features = () => {
  return (
    <div className="why-us" id="why-us">
        <span className="highlight" data-aos="fade-up">why us?</span>
        <h2 className="title" data-aos="fade-up">Why Earn with Playboyplacements?</h2>

        <div className="features-container">
          <div className="feature money" data-aos="fade-right">
            <div className="glow"></div>
            <img src="/assets/features/money.png" alt="" 
            />
            <div className="text-container">
              <h2>Earn Money Easily</h2>
              <p>
                Get paid for promoting creators content to your followers.
              </p>
            </div>
          </div>
          <div className="feature quick" data-aos="fade-right">
            <div className="glow"></div>
            <img src="/assets/features/quick-setup.png" alt="" 
            />
            <div className="text-container">
              <h2>Quick Setup</h2>
              <p>
                Sign up and verify your Instagram page to start receiving
                offers.
              </p>
            </div>
          </div>
          <div className="feature trust" data-aos="fade-right">
            <div className="glow"></div>
            <img src="/assets/features/safe.png" alt="" 
            />
            <div className="text-container">
              <h2>Safe and Trusted</h2>
              <p>
                Work only with verified creators, so you're always paid for your
                work.
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Features