import React from 'react';
import Link from 'next/link';

interface RelatedGuidesProps {
  guides: {
    title: string;
    url: string;
  }[];
}

const RelatedGuides: React.FC<RelatedGuidesProps> = ({ guides }) => {
  if (!guides?.length) return null;

  return (
    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
      <h4 className="font-medium text-purple-900 mb-2">Related Guides</h4>
      <ul className="space-y-2">
        {guides.map((guide, index) => (
          <li key={index}>
            <Link
              href={guide.url}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedGuides;
