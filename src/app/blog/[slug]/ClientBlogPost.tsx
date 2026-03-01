'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAnalyticsTracker } from '@/lib/analytics-tracker';
import { type BlogPost } from '../featuredPosts';

interface ClientBlogPostProps {
  post: BlogPost;
  slug: string;
}

export default function ClientBlogPost({ post, slug }: ClientBlogPostProps) {
  const { trackTakeQuiz } = useAnalyticsTracker();

  useEffect(() => {
    // Track page view or other analytics
    if (typeof window !== 'undefined') {
      // Any client-side analytics tracking
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-sm text-purple-600 font-medium mb-4">
            <Link href="/blog" className="hover:text-purple-800 transition-colors">
              Blog
            </Link>
            <span className="mx-2">•</span>
            <span className="text-gray-600">{post.category}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span>{post.author.name}</span>
            </div>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={384}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="prose prose-lg prose-purple max-w-none mb-12"
        >
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </motion.div>

        {/* Quiz CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="my-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 not-prose"
        >
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
              Find My Perfect Festival →
            </motion.button>
          </Link>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h4>
              <p className="text-gray-600 mb-4">{post.author.bio}</p>
              
              <div className="flex gap-3">
                {post.author.socialLinks?.instagram && (
                  <a 
                    href={`https://instagram.com/${post.author.socialLinks.instagram.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.017 0C8.396 0 7.999.01 6.756.048 5.517.085 4.668.25 3.935.496 3.176.756 2.527 1.122 1.88 1.769.233 2.415-.133 3.064-.372 3.823c-.248.733-.412 1.582-.449 2.821C.01 7.999 0 8.396 0 12.017c0 3.624.01 4.021.048 5.264.037 1.24.201 2.088.449 2.821.24.759.606 1.408 1.253 2.055.647.647 1.296 1.013 2.055 1.253.733.248 1.582.412 2.821.449C7.999 23.99 8.396 24 12.017 24c3.624 0 4.021-.01 5.264-.048 1.24-.037 2.088-.201 2.821-.449.759-.24 1.408-.606 2.055-1.253.647-.647 1.013-1.296 1.253-2.055.248-.733.412-1.582.449-2.821C23.99 16.021 24 15.624 24 12.003c0-3.624-.01-4.021-.048-5.264-.037-1.24-.201-2.088-.449-2.821-.24-.759-.606-1.408-1.253-2.055C21.603.233 20.954-.133 20.195-.372 19.462-.62 18.613-.784 17.374-.821 16.131-.859 15.734-.869 12.111-.869 8.487-.869 8.09-.859 6.847-.821 5.608-.784 4.759-.62 4.026-.372c-.733.24-1.382.606-2.029 1.253C1.35 1.527.984 2.176.746 2.935.498 3.668.334 4.517.297 5.756.259 6.999.249 7.396.249 11.017c0 3.624.01 4.021.048 5.264.037 1.24.201 2.088.449 2.821.24.759.606 1.408 1.253 2.055.647.647 1.296 1.013 2.055 1.253.733.248 1.582.412 2.821.449 1.243.038 1.64.048 5.264.048 3.624 0 4.021-.01 5.264-.048 1.24-.037 2.088-.201 2.821-.449.759-.24 1.408-.606 2.055-1.253.647-.647 1.013-1.296 1.253-2.055.248-.733.412-1.582.449-2.821.038-1.243.048-1.64.048-5.264 0-3.624-.01-4.021-.048-5.264-.037-1.24-.201-2.088-.449-2.821-.24-.759-.606-1.408-1.253-2.055-.647-.647-1.296-1.013-2.055-1.253-.733-.248-1.582-.412-2.821-.449C16.131.01 15.734 0 12.111 0h-.094zm-.017 5.487c-3.605 0-6.531 2.926-6.531 6.531s2.926 6.531 6.531 6.531 6.531-2.926 6.531-6.531-2.926-6.531-6.531-6.531zm0 10.776c-2.34 0-4.245-1.905-4.245-4.245s1.905-4.245 4.245-4.245 4.245 1.905 4.245 4.245-1.905 4.245-4.245 4.245zM19.847 5.26c0 .842-.68 1.523-1.523 1.523-.842 0-1.523-.68-1.523-1.523s.68-1.523 1.523-1.523 1.523.68 1.523 1.523z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {post.author.socialLinks?.twitter && (
                  <a 
                    href={`https://twitter.com/${post.author.socialLinks.twitter.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}