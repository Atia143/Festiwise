import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact FestiWise',
  description: 'Get in touch with the FestiWise team. Questions about festival recommendations, partnership enquiries, or press — we\'d love to hear from you.',
  alternates: { canonical: 'https://getfestiwise.com/contact' },
  openGraph: {
    title: 'Contact FestiWise',
    description: 'Get in touch — festival questions, partnerships, or press enquiries.',
    url: 'https://getfestiwise.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
