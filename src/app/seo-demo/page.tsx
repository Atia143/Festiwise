import { type Metadata } from 'next';
import { generateCanonicalUrl } from '@/components/SEO/CanonicalUrl';
import ClientStructuredData from '@/components/ClientStructuredData';
import dynamic from 'next/dynamic';

// Dynamically import the SEO Analyzer so it only loads during development
const SEOAnalyzer = dynamic(
  () => process.env.NODE_ENV === 'development' 
    ? import('@/components/SEO/SEOAnalyzer').then(mod => mod.default) 
    : Promise.resolve(() => null),
  { ssr: false }
);

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

export default function SEODemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Best Practices for Festival Pages</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What makes a festival page SEO-friendly?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Descriptive page titles with target keywords</li>
          <li>Compelling meta descriptions that encourage clicks</li>
          <li>Properly structured headings (H1, H2, H3)</li>
          <li>Rich structured data for enhanced search results</li>
          <li>Canonical URLs to prevent duplicate content</li>
          <li>Optimized images with descriptive alt text</li>
          <li>Mobile-friendly, responsive design</li>
          <li>Fast page load times</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Structured Data Implementation</h2>
        <p className="mb-4">
          This page implements the following structured data types:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Organization schema</li>
          <li>WebSite schema</li>
          <li>Article schema</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          View the page source to see the structured data implementation.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Canonical URL</h2>
        <p>
          This page has a canonical URL set to <code>https://getfestiwise.com/seo-demo</code> to 
          prevent duplicate content issues.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Images with Alt Text</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <img 
              src="/og-image.jpg" 
              alt="Music festival crowd enjoying a concert with dynamic lighting effects" 
              className="rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              Image with descriptive alt text for accessibility and SEO.
            </p>
          </div>
          <div>
            <img 
              src="/favicon.png" 
              alt="FestiWise logo" 
              className="rounded-lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              Brand logo with proper alt text.
            </p>
          </div>
        </div>
      </div>
      
      {/* SEO Analyzer will only show up in development mode */}
      <SEOAnalyzer />
    </div>
  );
}
