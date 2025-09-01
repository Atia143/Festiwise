'use client';

import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof'
import FestivalGrid from '@/components/FestivalGrid'
import NewsletterForm from '@/components/NewsletterForm'
import FAQ from '@/components/FAQ'
import festivalsData from '@/data/festivals.json'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FestivalGrid festivals={festivalsData.slice(0, 12)} />
      <SocialProof 
        ratingValue={4.8}
        ratingCount={15429}
        ratingAsOf="December 2024"
      />
      <NewsletterForm />
      <FAQ />
    </>
  )
}
