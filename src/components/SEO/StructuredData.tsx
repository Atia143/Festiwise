import Script from 'next/script';

interface StructuredDataProps {
  type: 'WebSite' | 'Organization' | 'Quiz' | 'Event' | 'LocalBusiness';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    switch (type) {
      case 'WebSite':
        return {
          ...baseData,
          url: "https://getfestiwise.com",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://getfestiwise.com/festivals?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        };
      case 'Quiz':
        return {
          ...baseData,
          mainEntity: {
            "@type": "Quiz",
            name: "Music Festival Finder Quiz",
            about: "Find your perfect music festival",
            educationalUse: "assessment",
            assesses: "music festival preferences"
          }
        };
      default:
        return baseData;
    }
  };

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  );
}
