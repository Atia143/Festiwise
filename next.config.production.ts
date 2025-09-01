// next.config.ts - Production-Ready Performance Configuration
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ⚡ Performance Optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@radix-ui/react-icons',
      'lucide-react'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP'],
    optimizeCss: true
  },

  // 🖼️ Image Optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.festivaldata.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  // 📦 Bundle Optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Split chunks optimally
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Framework chunk
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
        // Common chunk
        lib: {
          test(module: any) {
            return module.size() > 160000 && /node_modules[/\\]/.test(module.nameForCondition() || '');
          },
          chunks: 'all',
          name: 'lib',
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        // Framer Motion chunk (heavy library)
        framerMotion: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          chunks: 'all',
          priority: 20,
        },
        // Shared components
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    };

    // Tree shaking for Framer Motion
    config.resolve.alias = {
      ...config.resolve.alias,
      'framer-motion': 'framer-motion/dist/framer-motion',
    };

    // Remove unused imports
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // 🌐 Headers for Performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 🚀 Redirects for SEO
  async redirects() {
    return [
      {
        source: '/festivals-finder',
        destination: '/festivals',
        permanent: true,
      },
      {
        source: '/festival-guide',
        destination: '/what-festival-should-i-go-to',
        permanent: true,
      },
    ];
  },

  // 🔧 Compiler Optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-test'],
    } : false,
  },

  // 📱 PWA Configuration
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },

  // 🎯 Output Configuration
  output: 'standalone',
  
  // 📊 Analytics
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,

  // 🔒 Security
  poweredByHeader: false,
};

export default nextConfig;
