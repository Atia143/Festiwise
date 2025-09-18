import { MetadataRoute } from 'next';
import { featuredPosts } from '@/app/blog/featuredPosts';

// GET function to generate the blog sitemap
export async function GET(): Promise<Response> {
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

  const sitemap = [
    blogIndex,
    ...blogPosts,
    ...categoryPages,
    ...tagPages,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
