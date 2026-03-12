import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About FestiWise — Our Mission to Match People with Festivals',
  description: 'FestiWise is a free festival discovery platform matching music lovers with 100+ world-class festivals through a personalised quiz. Learn about our mission, team, and approach.',
  alternates: { canonical: 'https://getfestiwise.com/about' },
  openGraph: {
    title: 'About FestiWise | Music Festival Discovery',
    description: 'We help music lovers find their perfect festival in under 2 minutes. 100+ curated events, zero bias, totally free.',
    url: 'https://getfestiwise.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
