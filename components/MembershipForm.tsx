"use client";
import React, { useState } from 'react'

const MembershipForm = ({ user }: { user: any }) => {
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "usdt">("upi");

  const handleActivateNow = () => {
  const packageDetails = {
    basic: { name: "Basic", amount: "₹1499" },
    standard: { name: "Standard", amount: "₹4499" },
    premium: { name: "Premium", amount: "₹7999" },
  }[selectedPackage];

  const message = `
    User's Name: ${user?.name || ""}
    Email: ${user?.email || ""}
    Age: ${user?.age || ""}
    Phone: ${user?.phone || ""}
    City: ${user?.city || ""}
    Country: ${user?.country || ""}
    Package: ${packageDetails.name}
    Amount: ${packageDetails.amount}
    Payment Method: ${selectedMethod.toUpperCase()}`;

    const whatsappUrl = `https://wa.me/917016272690?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    };

  return (
    <div className="membership-container">
          <h3>Activate Your Profile<br /><span>Start Earning Today</span></h3>
          <div className="packages-container" id="packages-container">
            <div className="packs-container">
              <div className={`package ${selectedPackage === "basic" ? "active" : ""}`} onClick={() => setSelectedPackage("basic")} style={{ cursor: "pointer" }}>
                <div className="content">
                  <div className="tag"><p>Basic</p></div>
                  <span>₹1499</span>
                  <p>For beginners who want to start their journey.</p>
                </div>
                <hr />
                <div className="features">
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Verified Profile Activation</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Access to Basic Client Listings</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Limited Chat Requests</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>Standard Profile Visibility</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-white.svg" alt="" />
                    <p>24/7 Basic Support</p>
                  </div>
                </div>
                <button
                    className={selectedPackage === "basic" ? "active" : ""}
                    onClick={(e) => { e.stopPropagation(); setSelectedPackage("basic"); }}
                    type="button"
                >
                    Select Now
                </button>
              </div>
              <div className={`package gold-pack ${selectedPackage === "standard" ? "active" : ""}`} onClick={() => setSelectedPackage("standard")} style={{ cursor: "pointer" }}>
                <div className="content">
                  <div className="tag"><p>Standard</p></div>
                  <span>₹4499</span>
                  <p>For serious users looking for more exposure.</p>
                </div>
                <hr />
                <div className="features">
                  <div className="feature">
                    <img src="/assets/profile/tick-gold.svg" alt="" />
                    <p>All Features of Basic</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-gold.svg" alt="" />
                    <p>Premium Client Access</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-gold.svg" alt="" />
                    <p>Unlimited Chat Requests</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-gold.svg" alt="" />
                    <p>Higher Profile Ranking</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-gold.svg" alt="" />
                    <p>Priority Support</p>
                  </div>
                </div>
                <button
                    className={selectedPackage === "standard" ? "active" : ""}
                    onClick={(e) => { e.stopPropagation(); setSelectedPackage("standard"); }}
                    type="button"
                >
                    Select Now
                </button>
              </div>
              <div className={`package best-pack ${selectedPackage === "premium" ? "active" : ""}`} onClick={() => setSelectedPackage("premium")} style={{ cursor: "pointer" }}>
                <div className="content">
                  <div className="tag"><p>Premium</p></div>
                  <span>₹7999</span>
                  <p>For professionals who want maximum benefits.</p>
                </div>
                <hr />
                <div className="features">
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>All Features of Standard</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Top Profile Placement</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Direct Selecting Priority</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Exclusive High-Paying Clients</p>
                  </div>
                  <div className="feature">
                    <img src="/assets/profile/tick-color.svg" alt="" />
                    <p>Personal Account Manager</p>
                  </div>
                </div>
                <button
                    className={selectedPackage === "premium" ? "active" : ""}
                    onClick={(e) => { e.stopPropagation(); setSelectedPackage("premium"); }}
                    type="button"
                >
                    Select Now
                </button>
              </div>
            </div>
          </div>
          <div className="payments-container">
            <span>select payment</span>
            <div className="method-container">
              <div className={`method ${selectedMethod === "upi" ? "active" : ""}`} onClick={() => setSelectedMethod("upi")}>
                <img src="/assets/profile/upi.png" alt="visa" />
              </div>
              <div className={`method ${selectedMethod === "usdt" ? "active" : ""}`} onClick={() => setSelectedMethod("usdt")}>
                <img src="/assets/profile/usdt.png" alt="mastercard" />
                <h3>USDT</h3>
              </div>
            </div>
          </div>
          <button className='btn-primary' onClick={handleActivateNow} type="button">
            Activate Now
          </button>
        </div>
  )
}

export default MembershipForm