const { InjectManifest } = require('workbox-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core settings
  reactStrictMode: true,
  skipMiddlewareUrlNormalize: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons', 'lucide-react', '@heroicons/react'],
    webpackBuildWorker: true,
    // Optimize CSS in development for better DX
    optimizeServerReact: true,
  },
  
  // Server configuration  
  serverExternalPackages: ['sharp'],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https', 
        hostname: 'res.cloudinary.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    unoptimized: false,
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
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com https://res.cloudinary.com data: blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.web3forms.com; frame-ancestors 'none';" 
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
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
    // Optimize bundle splitting for better performance
    if (!isServer && !dev) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        animations: {
          test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
          name: 'animations',
          chunks: 'all',
          priority: 20,
        },
        icons: {
          test: /[\\/]node_modules[\\/](react-icons|lucide-react|@heroicons)[\\/]/,
          name: 'icons',
          chunks: 'all',
          priority: 20,
        },
      };
    }

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
