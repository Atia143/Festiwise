import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts, getBlogPost } from '@/data/blog-posts';

export const revalidate = 86400;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `https://getfestiwise.com/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedDate,
      images: [
        {
          url: post.heroImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.heroImage],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.heroImage,
    datePublished: post.date,
    dateModified: post.updatedDate,
    author: {
      '@type': 'Organization',
      name: 'FestiWise',
      url: 'https://getfestiwise.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FestiWise',
      url: 'https://getfestiwise.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://getfestiwise.com/festiwise-favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://getfestiwise.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero image */}
        <div className="relative w-full h-64 md:h-96 bg-gray-900 overflow-hidden">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 max-w-3xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-white/50 truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 pb-8">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-xs font-semibold px-2.5 py-0.5 bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4 text-sm text-gray-500">
            <time dateTime={post.date}>Published {formatDate(post.date)}</time>
            {post.updatedDate !== post.date && (
              <>
                <span>·</span>
                <time dateTime={post.updatedDate}>Updated {formatDate(post.updatedDate)}</time>
              </>
            )}
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Article content */}
        <article className="max-w-3xl mx-auto px-4 py-10">
          <div
            className="prose prose-gray prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-purple-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-ul:my-4 prose-li:text-gray-700 prose-li:leading-relaxed
              prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA box */}
        <div className="max-w-3xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">Find your perfect festival in 2 minutes</h2>
            <p className="text-white/80 text-sm mb-5">
              Answer 8 quick questions and we'll match you with festivals from our database of 100+
              world-class events — ranked by how well they fit your vibe, budget, and music taste.
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-white text-purple-700 font-bold px-7 py-3 rounded-xl hover:bg-purple-50 transition-colors"
            >
              Take the free festival quiz
            </Link>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
