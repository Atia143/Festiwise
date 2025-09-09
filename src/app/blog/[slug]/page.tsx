'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import BlogPostStructuredData from '@/components/SEO/BlogPostStructuredData';
import { featuredPosts, type BlogPost } from '../featuredPosts';
import { useAnalyticsTracker } from '@/lib/analytics-tracker';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageUrl, setPageUrl] = useState('');
  
  const { trackTakeQuiz } = useAnalyticsTracker();
  
  // Find the post based on the slug
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    // In a real app, this would be an API call
    const foundPost = featuredPosts.find(post => post.slug === slug);
    setPost(foundPost || null);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Get current URL for canonical and structured data
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="mb-6">The blog post you're looking for could not be found.</p>
        <Link href="/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{post.title} | FestiWise Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author.name} />
        {post.tags.map((tag: string, index: number) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        <link rel="canonical" href={pageUrl} />
      </Head>
      
      {/* Add Schema.org structured data */}
      <BlogPostStructuredData post={post} url={pageUrl} />
      
      <article className="max-w-4xl mx-auto px-4 py-16">
        <header className="mb-12">
          <div className="mb-6">
            <Link href="/blog" className="text-purple-600 hover:text-purple-800 transition-colors">
              ← Back to all stories
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <Link 
                key={tag} 
                href={`/blog?tag=${tag}`}
                className="text-sm px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg font-medium hover:from-blue-100 hover:to-purple-100 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.author.avatar}
            </div>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })} · {post.readTime}
              </div>
            </div>
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none">
          {/* This would typically be content from a CMS */}
          <p className="lead text-xl text-gray-700 mb-6">{post.excerpt}</p>
          
          <p>This is a placeholder for the full blog content.</p>
          
          {/* Quiz CTA */}
          <div className="my-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 not-prose">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Your Perfect Festival</h3>
            <p className="text-gray-700 mb-6">
              Inspired by {post.festivalLocation || "this story"}? Find more festivals that match your unique preferences. 
              Our personalized quiz takes just 2 minutes and helps you discover hidden gems you'll love.
            </p>
            <Link href="/quiz">
              <motion.button
                onClick={() => trackTakeQuiz('blog_post_content')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take the Festival Quiz →
              </motion.button>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
