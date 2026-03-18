import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blog-posts';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Music Festival Blog — Guides, Tips & News',
  description:
    'In-depth music festival guides, solo travel tips, and head-to-head comparisons. Everything you need to plan your perfect festival experience in 2026.',
  keywords: [
    'music festival blog',
    'festival travel tips',
    'tomorrowland guide',
    'coachella guide',
    'solo festival travel',
    'festival comparison',
    'festival planning 2026',
  ],
  alternates: {
    canonical: 'https://getfestiwise.com/blog',
  },
  openGraph: {
    title: 'Music Festival Blog — Guides, Tips & News | FestiWise',
    description:
      'In-depth festival guides, solo travel tips, and head-to-head comparisons for 2026.',
    url: 'https://getfestiwise.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'FestiWise Festival Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Festival Blog — Guides, Tips & News | FestiWise',
    description: 'In-depth festival guides, solo travel tips, and comparisons for 2026.',
    images: ['https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80'],
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Festival Knowledge Base
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            The FestiWise{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Blog
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            In-depth guides, practical tips, and honest comparisons to help you plan the perfect
            festival experience.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Hero image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src={post.heroImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Read time badge */}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {post.readTime} min read
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block text-xs font-medium px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <time className="text-xs text-gray-400" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-800 transition-colors">
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Not sure which festival suits you?</h2>
          <p className="text-white/80 mb-5 text-sm">
            Take our free 2-minute quiz and get personalised recommendations from 100+ world festivals.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-purple-700 font-bold px-7 py-3 rounded-xl hover:bg-purple-50 transition-colors"
          >
            Find my perfect festival
          </Link>
        </div>
      </section>
    </div>
  );
}
