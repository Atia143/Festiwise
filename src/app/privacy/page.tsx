import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How FestiWise collects, uses, and protects your personal data. We store only what is necessary — quiz answers stay on your device, never our servers.',
  alternates: { canonical: 'https://getfestiwise.com/privacy' },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
