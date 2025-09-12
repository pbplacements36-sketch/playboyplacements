import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import Verified from '@/components/sections/Verified'
import Whyus from '@/components/sections/Whyus'
import Works from '@/components/sections/Works'
import Earnings from '@/components/sections/Earnings'
import React from 'react'
import Features from '@/components/sections/Features'
import Testimonials from '@/components/sections/Testimonials'
import Proof from '@/components/sections/Proof'
import Whatsapp from '@/components/sections/Whatsapp'
import Faq from '@/components/sections/Faq'
import Footer from '@/components/sections/Footer'

const Home = () => {
  return (
    <>
      <Navigation />
      <Hero />
      <Verified />
      <Whyus />
      <Works />
      <Earnings />
      <Features />
      <Testimonials />
      <Proof />
      <Whatsapp />
      <Faq />
      <Footer />
    </>
  )
}

export default Home