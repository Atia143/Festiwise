// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporarily ignore ESLint warnings for production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript warnings for production build  
    ignoreBuildErrors: true,
  },
  // Skip middleware with full static export
  skipMiddlewareUrlNormalize: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable bundle analyzer on demand
  webpack: (config, { isServer }) => {
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
    return config;
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Compression
  compress: true,
  poweredByHeader: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Redirects: www → apex, remove trailing slash
  async redirects() {
    return [
      // Redirect www.getfestiwise.com to getfestiwise.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.getfestiwise.com' }],
        destination: 'https://getfestiwise.com/:path*',
        permanent: true,
      },
      // Remove trailing slash (if you want URLs without slash at the end)
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
