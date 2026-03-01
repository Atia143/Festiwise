'use client';

import { useEffect } from 'react';

type BlogPostType = {
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  author: {
    name: string;
  };
  category: string;
  tags: string[];
};

type BlogPostStructuredDataProps = {
  post: BlogPostType;
  url: string;
};

/**
 * Adds Schema.org BlogPosting structured data to the page for improved SEO
 */
export default function BlogPostStructuredData({ post, url }: BlogPostStructuredDataProps) {
  useEffect(() => {
    // Create the structured data object
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.image || 'https://festiwise.com/og-image.jpg',
      datePublished: post.date,
      dateModified: post.date, // Assuming we don't have a separate modified date
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'FestiWise',
        logo: {
          '@type': 'ImageObject',
          url: 'https://festiwise.com/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      articleSection: post.category,
      keywords: post.tags.join(', '),
      inLanguage: 'en',
    };

    // Add the structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = 'blog-post-structured-data';
    
    // Remove any existing script with the same ID
    const existingScript = document.getElementById('blog-post-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
    
    // Clean up on unmount
    return () => {
      const scriptToRemove = document.getElementById('blog-post-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [post, url]);
  
  return null; // This component doesn't render anything
}
