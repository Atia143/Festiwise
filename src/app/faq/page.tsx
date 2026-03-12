import { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'Music Festival FAQ — Your Questions Answered',
  description: 'Everything you need to know about finding, booking, and attending music festivals. From quiz tips to ticket alerts, packing, and budgeting.',
  alternates: { canonical: 'https://getfestiwise.com/faq' },
  openGraph: {
    title: 'Music Festival FAQ | FestiWise',
    description: 'Answers to the most common questions about festival discovery, tickets, budgeting, and more.',
    url: 'https://getfestiwise.com/faq',
    type: 'website',
  },
};

export default function FAQPage() {
  return <FaqClient />;
}
