"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    text: '“Mujhe laga pehle fake hoga, par sirf ek hafte me mujhe 2 bookings mili aur ₹60,000 kama liya. Ab regular clients mil rahe hain.“',
    name: 'Ankit Singh',
    location: 'Mumbai',
    userImg: '/assets/testimonials/user-1.png',
  },
  {
    text: '“Bahut hi accha experience tha, payment time pe mil gaya aur support bhi best tha.“',
    name: 'Rajat Singh',
    location: 'Delhi',
    userImg: '/assets/testimonials/user-2.png',
  },
  {
    text: '“Yahan se mujhe regular kaam mil raha hai, sab kuch genuine hai.“',
    name: 'Rahul Verma',
    location: 'Bangalore',
    userImg: '/assets/testimonials/user-3.png',
  },
  {
    text: '“Yahan se mujhe regular kaam mil raha hai, sab kuch genuine hai.“',
    name: 'Kaushal Gupta',
    location: 'Lucknow',
    userImg: '/assets/testimonials/user-4.png',
  },
  {
    text: '“Yahan se mujhe regular kaam mil raha hai, sab kuch genuine hai.“',
    name: 'Kartik Sharma',
    location: 'Gujarat',
    userImg: '/assets/testimonials/user-5.png',
  },
  // Add more testimonials as needed
]

const INITIAL_INDEX = 2

const Testimonials = () => {
    const [active, setActive] = useState(INITIAL_INDEX)
    const swiperRef = useRef<any>(null)


  return (
    <div className='testimonials-section'>
        <div className="title">
            <span>OUR TESTIMONIALS</span>
        </div>
        <div className="text-container">
        <h2>{testimonials[active].text}</h2>
        <div className="user-details">
          <p>{testimonials[active].name}</p>
          <div className="details">
            <Image className='location' src="/assets/testimonials/location.png" alt="Location" width={20} height={20} />
            <span>{testimonials[active].location}</span>
            <Image className='stars' src="/assets/testimonials/stars.png" alt="Star" width={100} height={20} unoptimized />
          </div>
        </div>
      </div>
    <Swiper
        className="image-container"
        slidesPerView={3}
        centeredSlides
        loop
        spaceBetween={32}
        initialSlide={INITIAL_INDEX}
        onSwiper={swiper => (swiperRef.current = swiper)}
        onSlideChange={swiper => setActive(swiper.realIndex)}
        pagination={{ clickable: true }}
        style={{ width: '100%', marginTop: 64, marginBottom: 8 }}
        breakpoints={{
          0: { slidesPerView: 3 },
          600: { slidesPerView: 3 }
        }}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <div
        className={`testimonial-img${
          i === active
            ? ' active'
            : i === (active - 1 + testimonials.length) % testimonials.length
            ? ' prev'
            : i === (active + 1) % testimonials.length
            ? ' next'
            : ''
        }`}
      >
              <Image src={t.userImg} alt={t.name} width={160} height={160} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="slider-dots">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={i === active ? 'dot active' : 'dot'}
            onClick={() => {
              setActive(i)
              if (swiperRef.current) {
                swiperRef.current.slideToLoop(i) // Use slideToLoop for looping Swiper
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Testimonials