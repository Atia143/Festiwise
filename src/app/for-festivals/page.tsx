import type { Metadata } from 'next';
import ForFestivalsClient from './ForFestivalsClient';

export const metadata: Metadata = {
  title: 'List Your Festival on FestiWise | Reach 50,000+ Festival Fans',
  description:
    'Get your festival in front of highly targeted fans. Featured placement, real-time analytics, and lead capture - starting at $299/month.',
  openGraph: {
    title: 'List Your Festival on FestiWise',
    description:
      'Reach tens of thousands of festival fans actively searching for their next experience.',
    url: 'https://getfestiwise.com/for-festivals',
  },
};

export default function ForFestivalsPage() {
  return <ForFestivalsClient />;
}
