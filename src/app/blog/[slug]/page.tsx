import { type Metadata } from 'next';
import { generateCanonicalUrl } from '@/components/SEO/CanonicalUrl';

// This function generates metadata for an individual blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  // Here you would normally fetch the blog post data
  // const post = await getBlogPost(slug);
  
  // For now we'll use placeholder data
  const post = {
    title: 'Example Blog Post',
    description: 'This is an example blog post that demonstrates how to use the SEO components.',
    publishDate: '2023-10-15',
    updateDate: '2023-10-20',
    author: 'FestiWise Team',
    image: '/blog/example-post.jpg',
    slug: slug
  };
  
  // Generate the canonical URL
  const canonicalMetadata = generateCanonicalUrl(`/blog/${slug}`);
  
  // Return the metadata object
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.updateDate,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image]
    },
    ...canonicalMetadata // Spread the canonical URL metadata
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Blog Post: {params.slug}</h1>
      {/* Blog content would go here */}
    </div>
  );
}
