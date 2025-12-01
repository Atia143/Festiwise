// This file helps manage 404 errors and redirect common mistakes

import type { NextApiRequest, NextApiResponse } from 'next';

// Map of common 404 URLs and where they should redirect to
const REDIRECT_MAP: Record<string, string> = {
  '/festvals': '/festivals',
  '/festival': '/festivals', 
  '/festivals-guide': '/festivals',
  '/festval-finder': '/quiz',
  '/find-festival': '/quiz',
  '/blog-posts': '/discover',
  '/blog': '/discover',
  '/music-festivals': '/festivals',
  '/events': '/festivals',
  // Add more common misspellings or old URLs as needed
};

// Handle common misspellings and old URLs with redirects
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.url?.split('?')[0] || '';
  
  // Check if we have a redirect for this path
  const redirectUrl = REDIRECT_MAP[path];
  
  if (redirectUrl) {
    // If there's a redirect, send a 301 (permanent) redirect
    res.setHeader('Location', redirectUrl);
    res.status(301).end();
    return;
  }
  
  // Log 404s to help identify patterns (in production you'd log to your analytics)
  if (process.env.NODE_ENV === 'production') {
    console.log(`404 error for: ${path}`);
  }

  // If no redirect found, pass through to the default 404 handler
  res.status(404).json({ 
    notFound: true, 
    message: 'Page not found',
    suggestedPages: [
      { title: 'Find your perfect festival', url: '/quiz' },
      { title: 'Browse all festivals', url: '/festivals' },
      { title: 'Festival discovery', url: '/discover' }
    ]
  });
}
