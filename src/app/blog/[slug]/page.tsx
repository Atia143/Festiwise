import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostStructuredData from '@/components/SEO/BlogPostStructuredData';
import { featuredPosts, type BlogPost } from '../featuredPosts';
import ClientBlogPost from './ClientBlogPost';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = featuredPosts.find(post => post.slug === slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | FestiWise',
      description: 'The requested blog post could not be found.'
    };
  }

  const postImage = post.image || 'https://getfestiwise.com/images/default-blog.jpg';

  return {
    title: `${post.title} | FestiWise Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `https://getfestiwise.com/blog/${slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      images: [{
        url: postImage,
        width: 1200,
        height: 630,
        alt: post.title
      }],
      url: `https://getfestiwise.com/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [postImage],
    }
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return featuredPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = featuredPosts.find(post => post.slug === slug);

  if (!post) {
    notFound();
  }

  const pageUrl = `https://getfestiwise.com/blog/${slug}`;

  return (
    <>
      <BlogPostStructuredData post={post} url={pageUrl} />
      <ClientBlogPost post={post} slug={slug} />
    </>
  );
}