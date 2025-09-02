import { type Metadata } from 'next';
import { generateCanonicalUrl } from '@/components/SEO/CanonicalUrl';

export const metadata: Metadata = {
  title: 'SEO Best Practices | FestiWise',
  description: 'Demonstration of proper SEO implementation for music festival pages using Next.js metadata, structured data, and canonical URLs.',
  keywords: ['SEO', 'music festivals', 'structured data', 'canonical URLs', 'Next.js SEO'],
  openGraph: {
    title: 'SEO Best Practices for Festival Pages',
    description: 'Learn how to implement proper SEO for music festival pages.',
    url: 'https://getfestiwise.com/seo-demo',
    type: 'article',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FestiWise SEO Best Practices'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Best Practices for Festival Pages',
    description: 'Learn how to implement proper SEO for music festival pages.',
    images: ['/og-image.jpg']
  },
  ...generateCanonicalUrl('/seo-demo')
};
