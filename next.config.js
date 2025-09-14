const { InjectManifest } = require('workbox-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Core settings
  reactStrictMode: true,
  skipMiddlewareUrlNormalize: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion'],
    webpackBuildWorker: true,
  },

  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Handle www to non-www redirect
      {
        source: '/',
        has: [{ type: 'host', value: 'www.getfestiwise.com' }],
        destination: 'https://getfestiwise.com',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.getfestiwise.com' }],
        destination: 'https://getfestiwise.com/:path*',
        permanent: true,
      },
      // Handle trailing slashes for non-root paths
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      }
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }

    // Service worker (production only)
    if (!isServer && !dev) {
      config.plugins.push(
        new InjectManifest({
          swSrc: './public/sw-source.js',
          swDest: '../public/sw.js',
          mode: 'production',
          additionalManifestEntries: [
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
            (manifestEntries) => {
              const manifest = manifestEntries.map((entry) => {
                if (entry.url.includes('/_next/static/')) {
                  entry.revision = null;
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
};

module.exports = nextConfig;
