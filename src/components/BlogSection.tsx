import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blog-posts';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogSection() {
  const latest = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-3">
              Festival Knowledge
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              From the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Blog
              </span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Guides, tips and honest comparisons to plan your perfect festival experience.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            All articles →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Hero image */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Read time badge */}
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {post.readTime} min read
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <time className="text-xs text-gray-400" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span className="text-xs font-semibold text-purple-600 group-hover:text-purple-800 transition-colors">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "all articles" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            See all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
