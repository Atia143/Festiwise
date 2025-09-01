import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FestiWise - Find Your Perfect Music Festival',
    short_name: 'FestiWise',
    description: 'Discover music festivals worldwide that match your preferences. Find the perfect festival based on your music taste, budget, and travel preferences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#6366f1',
    categories: ['music', 'travel', 'entertainment'],
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait-primary',
    scope: '/',
    id: 'festiwise-app'
  }
}
