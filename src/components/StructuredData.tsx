'use client';

import { usePathname } from 'next/navigation';

export default function StructuredData() {
  const pathname = usePathname();
  
  // Base organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FestiWise",
    "url": "https://getfestiwise.com",
    "logo": "https://getfestiwise.com/logo.png",
    "sameAs": [
      "https://twitter.com/festiwise",
      "https://www.instagram.com/festiwise/",
      "https://www.facebook.com/festiwise"
    ]
  };
  
  // Generate appropriate schema based on the current page
  const getPageSchema = () => {
    if (pathname === '/') {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://getfestiwise.com",
        "name": "FestiWise - Find Your Perfect Music Festival",
        "description": "Discover your ideal music festival from 100+ world-class events worldwide.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://getfestiwise.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
    }
    
    if (pathname && pathname.startsWith('/festival/')) {
      // This would be dynamic based on the actual festival data
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Festival Name",
        "startDate": "2025-07-15",
        "endDate": "2025-07-18",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "Festival Location",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "City",
            "addressRegion": "Region",
            "addressCountry": "Country"
          }
        },
        "image": [
          "https://getfestiwise.com/festival-image.jpg"
        ],
        "description": "Festival description",
        "offers": {
          "@type": "Offer",
          "url": "https://getfestiwise.com/tickets",
          "price": "150",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-01-01"
        },
        "organizer": {
          "@type": "Organization",
          "name": "Festival Organizer",
          "url": "https://example.com"
        }
      };
    }
    
    return null;
  };
  
  const pageSchema = getPageSchema();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      {pageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageSchema)
          }}
        />
      )}
    </>
  );
}
