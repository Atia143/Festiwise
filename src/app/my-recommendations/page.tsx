import { Metadata } from 'next';
import MyRecommendationsClient from './MyRecommendationsClient';

export const metadata: Metadata = {
  title: 'My Festival Recommendations',
  description: 'Your personalised music festival matches based on your quiz results. Compare, save, and book your perfect festival.',
  alternates: { canonical: 'https://getfestiwise.com/my-recommendations' },
  robots: { index: false, follow: false }, // user-specific page — no SEO value
};

export default function MyRecommendationsPage() {
  return <MyRecommendationsClient />;
}
