'use client';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Component for adding breadcrumb structured data to any page
 * This will enhance search results with breadcrumb rich snippets
 */
export default function BreadcrumbsSchema({ items }: BreadcrumbsSchemaProps) {
  const baseUrl = 'https://getfestiwise.com';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url ? `${baseUrl}${item.url}` : undefined
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
