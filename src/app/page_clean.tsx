'use client';

import Hero from '@/components/Hero'
import SocialProof from '@/components/SocialProof'
import FestivalGrid from '@/components/FestivalGrid'
import NewsletterForm from '@/components/NewsletterForm'
import FAQ from '@/components/FAQ'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FestivalGrid festivals={[]} />
      <SocialProof />
      <NewsletterForm />
      <FAQ />
    </main>
  )
}
