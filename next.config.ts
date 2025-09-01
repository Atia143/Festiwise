const { InjectManifest } = require('workbox-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  experimental: {
    webpackBuildWorker: true,
  },
  
  
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // SEO & Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400'
          }
        ]
      }
    ]
  },
  
  // Image optimization (consolidated)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  webpack: (config: any, { isServer, dev }: any) => {
    // Only add service worker in production client build
    if (!isServer && !dev) {
      config.plugins.push(
        new InjectManifest({
          swSrc: './public/sw-source.js',
          swDest: '../public/sw.js',
          mode: 'production',
          additionalManifestEntries: [
            // Precache critical routes
            { url: '/', revision: null },
            { url: '/quiz', revision: null },
            { url: '/festivals', revision: null },
            { url: '/blog', revision: null },
            { url: '/faq', revision: null },
          ],
          exclude: [
            /\.map$/,
            /manifest$/,
            /\.htaccess$/,
            /service-worker\.js$/,
            /sw\.js$/,
          ],
          manifestTransforms: [
            // Custom transform to optimize manifest
            (manifestEntries: any) => {
              const manifest = manifestEntries.map((entry: any) => {
                // Cache bust static assets
                if (entry.url.includes('/_next/static/')) {
                  entry.revision = null; // Next.js handles versioning
                }
                return entry;
              });
              return { manifest };
            },
          ],
        })
      );
    }
    
    return config;
  },
}

module.exports = nextConfig
