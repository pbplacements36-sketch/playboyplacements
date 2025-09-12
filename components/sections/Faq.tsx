"use client"
import React, { useState } from 'react'

const faqData = [
  {
    question: "Kaise join kar sakte hain PlayboyPlacement?",
    answer:
      "Aapko sirf ek simple registration form fill karna hai aur apne basic details deni hain. Account banate hi aap profile complete karke plans buy kar sakte ho.",
  },
  {
    question: "Kya joining free hai?",
    answer: "Nahi, joining ke liye aapko ek plan select karke pay karna hota hai.",
  },
  {
    question: "Payment kaise milta hai?",
    answer:
      "Aapke account me directly payout hota hai jab aapki booking confirm aur complete ho jaati hai.",
  },
  {
    question: "Kya yeh safe hai?",
    answer: "Haan, saare clients verify hote hain aur secure payment gateway ka use hota hai.",
  },
  {
    question: "Mujhe kitna earn hoga?",
    answer:
      "Aapki bookings aur clients par depend karta hai. Average users ₹50,000+ tak earn kar rahe hain.",
  },
  {
    question: "Security amount kyun dena padta hai?",
    answer:
      "Security amount ek safety deposit hota hai jo platform ke trust aur fraud protection ke liye hota hai.",
  },
  {
    question: "Agar client cancel kare toh mera security amount kya hoga?",
    answer:
      "Agar client cancel karta hai toh aapka security amount safe rehta hai, koi deduction nahi hota.",
  },
  {
    question: "Kaunse cities me available hai service?",
    answer:
      "Hamari service major metro cities me available hai jaise Mumbai, Delhi, Bangalore, Pune aur aur bhi.",
  },
];

const Faq = () => {
      const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className='faq-section'>
        <div className="title">
            <span>FAQs</span>
        </div>
        <h2 className='heading faq'>FAQs and Support</h2>
        <div className="faq-card-container">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`faq-card ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFaq(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="arrow">{activeIndex === index ? "▲" : "▼"}</span>
            </div>
            {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Faq