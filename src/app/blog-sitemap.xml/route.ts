import { MetadataRoute } from 'next';
import { featuredPosts } from '@/app/blog/featuredPosts';

// Function to generate the blog sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://getfestiwise.com';
  
  // Blog index page
  const blogIndex = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  };
  
  // Blog post pages
  const blogPosts = featuredPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // Blog category pages (extract unique categories)
  const categories = [...new Set(featuredPosts.map(post => post.category.toLowerCase().replace(/\s+/g, '-')))];
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  // Blog tag pages (extract unique tags)
  const tags = [...new Set(featuredPosts.flatMap(post => post.tags))];
  const tagPages = tags.map(tag => ({
    url: `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    blogIndex,
    ...blogPosts,
    ...categoryPages,
    ...tagPages,
  ];
}
