import Script from 'next/script';

interface SchemaMarkupProps {
  data: object;
}

export default function SchemaMarkup({ data }: SchemaMarkupProps) {
  return (
    <Script
      id="schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
