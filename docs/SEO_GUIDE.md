# SEO Implementation Guide for FestiWise

This guide outlines the SEO components and best practices for the FestiWise website.

## Key Components

### 1. Metadata

Use Next.js Metadata API for setting page metadata:

```tsx
export const metadata: Metadata = {
  title: 'Page Title | FestiWise',
  description: 'Page description goes here.',
  // Other metadata...
};
```

### 2. Canonical URLs

Use the `generateCanonicalUrl` helper:

```tsx
import { generateCanonicalUrl } from '@/components/SEO/CanonicalUrl';

export const metadata: Metadata = {
  // Your metadata...
  ...generateCanonicalUrl('/your-page-path')
};
```

### 3. Structured Data

For client-side structured data, use the appropriate component:

- `ClientStructuredData` - For sitewide structured data
- `FAQSchema` - For FAQ pages
- `BreadcrumbsSchema` - For navigation breadcrumbs

Example:

```tsx
import FAQSchema from '@/components/SEO/FAQSchema';

// In your component:
<FAQSchema 
  faqs={[
    {
      question: "What is FestiWise?",
      answer: "FestiWise is a festival finder..."
    }
  ]} 
/>
```

### 4. SEO Analysis (Development Only)

Use the SEOAnalyzer component during development to check your pages:

```tsx
import dynamic from 'next/dynamic';

const SEOAnalyzer = dynamic(
  () => process.env.NODE_ENV === 'development' 
    ? import('@/components/SEO/SEOAnalyzer').then(mod => mod.default) 
    : Promise.resolve(() => null),
  { ssr: false }
);

// In your component:
<SEOAnalyzer />
```

## Best Practices

1. **Page Titles**
   - Include the target keyword near the beginning
   - Keep titles between 50-60 characters
   - Use the format: `[Primary Keyword] | FestiWise`

2. **Meta Descriptions**
   - Write compelling copy that encourages clicks
   - Include primary and secondary keywords naturally
   - Keep between 120-155 characters
   - Include a call-to-action when appropriate

3. **Content Structure**
   - One H1 per page
   - Logical hierarchy of H2, H3, etc.
   - Include keywords in headings
   - Break content into scannable sections

4. **Images**
   - Add descriptive alt text to all images
   - Compress images for fast loading
   - Use semantic naming for image files

5. **Structured Data**
   - Use appropriate schema types for each page
   - Test using Google's Rich Results Test
   - Include all required properties

## Common Schema Types

- WebSite (sitewide)
- Organization (sitewide)
- Event (festival pages)
- FAQPage (FAQ sections)
- BreadcrumbList (navigation)
- Article (blog posts)

## Testing Tools

- [Google Search Console](https://search.google.com/search-console)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema Validator](https://validator.schema.org/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
