'use client';

// Export the BlogPost interface
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    verified: boolean;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
    };
  };
  tags: string[];
  featured: boolean;
  views?: number;
  likes?: number;
  image?: string;
  festivalYear?: string;
  festivalLocation?: string;
}

// Featured Posts (add more as you grow)
export const featuredPosts: BlogPost[] = [
  {
    slug: 'ozora-festival-2025-transformational-journey',
    title: 'Ozora Festival 2025: A Life-Changing Journey Into Consciousness',
    excerpt: 'My first trip to Hungary’s legendary Ozora Festival turned out to be far more than just a week of music—it was a transformative adventure that reshaped how I see festivals, community, and even myself. From stepping onto the vibrant, dreamlike grounds to forming deep connections under the open sky, Ozora left me changed in ways I never expected.',
    date: '2025-08-30',
    readTime: '18 min read',
    category: 'Transformational',
    author: {
      name: 'Yuval Atia',
      avatar: '🧠',
      bio: 'tba',
      verified: true,
      socialLinks: {
        instagram: '@yuvalatia',
        twitter: '@yuval_atia'
      }
    },
    tags: ['Ozora', 'Psytrance', 'Hungary', 'Transformational', 'Consciousness', 'First-Timer'],
    featured: true,
    views: 32,
    likes: 18,
    image: '/api/placeholder/1200/600',
    festivalYear: '2025',
    festivalLocation: 'Ozora, Hungary'
  },
  {
    slug: 'budget-festival-masterclass-100-festivals-under-budget',
    title: 'The $50-a-Day Festival Masterclass: How I Attended 100+ Festivals Without Going Broke',
    excerpt: 'After 8 years and 100+ festivals across 25 countries, I\'ve cracked the code on festival economics. From sleeping in hostels to finding free meals, here\'s my complete playbook for experiencing world-class festivals on an impossible budget.',
    date: '2025-08-28',
    readTime: '22 min read',
    category: 'Budget & Planning',
    author: {
      name: 'Budget Ben',
      avatar: '🎒',
      bio: 'Backpacker extraordinaire. 100+ festivals, 25 countries, $10k total budget over 8 years.',
      verified: true,
      socialLinks: {
        instagram: '@budgetben_festivals',
        twitter: '@budget_ben_fests'
      }
    },
    tags: ['Budget', 'Money-Saving', 'Backpacking', 'Planning', 'Travel-Hacks', 'Europe'],
    featured: true,
    views: 5893,
    likes: 341,
    image: '/api/placeholder/1200/600',
    festivalYear: '2017-2025',
    festivalLocation: 'Europe & Beyond'
  }
];
