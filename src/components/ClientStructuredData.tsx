// src/components/StructuredData.tsx
'use client'; // Only if you use browser APIs

/**
 * Injects structured data for SEO.
 */
export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Your Site Name",
          "url": "https://your-site.com"
        })
      }}
    />
  );
}
