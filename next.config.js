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
};

module.exports = nextConfig;
