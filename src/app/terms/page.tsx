import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'FestiWise Terms of Service — the rules that govern your use of our festival discovery platform.',
  alternates: { canonical: 'https://getfestiwise.com/terms' },
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return <TermsClient />;
}
