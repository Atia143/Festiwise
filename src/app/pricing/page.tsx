import PricingAndMonetization from '@/components/PricingAndMonetization'

export const metadata = {
  title: 'Pricing & Plans - FestiWise',
  description: 'Choose the perfect plan for your festival adventure. Free forever, or upgrade to Pro for early ticket alerts, unlimited compare and more.',
  alternates: { canonical: 'https://getfestiwise.com/pricing' },
  openGraph: {
    title: 'Pricing & Plans - FestiWise',
    description: 'Free forever, or upgrade to Pro. Find the right plan for your festival journey.',
    url: 'https://getfestiwise.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingAndMonetization />
}
