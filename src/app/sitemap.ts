import { MetadataRoute } from 'next';
import festivalsData from '@/data/festivals.json';
import { seoIndexGenerator } from '@/lib/seoIndexGenerator';
import { blogPosts } from '@/data/blog-posts';

// Duplicated from compare/[slug]/page.tsx to avoid cross-route imports
const COMPARISON_PAIRS: [string, string][] = [
  ['coachella', 'tomorrowland'],
  ['coachella', 'glastonbury'],
  ['coachella', 'burning_man'],
  ['coachella', 'lollapalooza_chicago'],
  ['coachella', 'bonnaroo'],
  ['tomorrowland', 'ultra_miami'],
  ['tomorrowland', 'glastonbury'],
  ['tomorrowland', 'exit_festival'],
  ['glastonbury', 'reading_leeds'],
  ['glastonbury', 'download_festival'],
  ['glastonbury', 'primavera'],
  ['ultra_miami', 'electric_daisy_carnival'],
  ['burning_man', 'lightning_in_a_bottle'],
  ['lollapalooza_chicago', 'governors_ball'],
  ['lollapalooza_chicago', 'outside_lands'],
  ['primavera', 'sonar'],
  ['sziget', 'exit_festival'],
  ['fuji_rock', 'splendour_in_the_grass'],
  ['osheaga', 'lollapalooza_chicago'],
  ['rock_am_ring', 'rock_im_park'],
  ['creamfields_uk', 'tomorrowland'],
  ['montreux_jazz', 'newport_jazz'],
  ['roskilde', 'glastonbury'],
  ['rolling_loud_california', 'coachella'],
  ['outside_lands', 'bonnaroo'],
];

function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://getfestiwise.com';
  const currentDate = new Date();

  // Core pages
  const corePages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/festivals`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    // Discover / Festival Radar
    {
      url: `${baseUrl}/discover`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/discover/leaderboards`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    // SEO landing pages
    {
      url: `${baseUrl}/cheap-music-festivals-europe-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/festival-packing-list-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/electronic-music-festivals-usa-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/summer-music-festivals-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music-festival-safety-tips-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best-music-festivals-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music-festival-guide-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/when-to-buy-festival-tickets-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/what-festival-should-i-go-to`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/my-recommendations`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-festivals`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/music-festivals-in`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/festival-calendar-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    // International language landing pages
    {
      url: `${baseUrl}/es`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/de`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // Festival pages — highest priority content
  const festivalPages = festivalsData.map(festival => ({
    url: `${baseUrl}/festival/${festival.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Country index pages
  const countryIndexes = seoIndexGenerator.generateCountryIndexes().map(country => ({
    url: `${baseUrl}${country.canonical}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Genre index pages (/festivals/genre/[genre])
  const genreIndexes = seoIndexGenerator.generateGenreIndexes().map(genre => ({
    url: `${baseUrl}${genre.canonical}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Month index pages
  const monthIndexes = seoIndexGenerator.generateMonthIndexes().map(month => ({
    url: `${baseUrl}${month.canonical}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Budget index pages
  const budgetIndexes = seoIndexGenerator.generateBudgetIndexes().map(budget => ({
    url: `${baseUrl}${budget.canonical}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Genre × Region landing pages
  const allGenres = [...new Set((festivalsData as { genres: string[] }[]).flatMap(f => f.genres))];
  const allRegions = [...new Set((festivalsData as { region?: string }[]).map(f => f.region).filter(Boolean) as string[])];
  const genreRegionPages: MetadataRoute.Sitemap = [];
  for (const genre of allGenres) {
    for (const region of allRegions) {
      const slug = (s: string) => s.toLowerCase().replace(/'/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-');
      const hasFestivals = (festivalsData as { genres: string[]; region?: string; status: string }[]).some(
        f => f.genres.some(g => slug(g) === slug(genre)) && f.region && slug(f.region) === slug(region) && f.status === 'active',
      );
      if (hasFestivals) {
        genreRegionPages.push({
          url: `${baseUrl}/festivals/${slug(genre)}/${slug(region)}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      }
    }
  }

  // Collections & Map pages
  const collectionsAndMap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Individual collection pages
  const collectionSlugs = [
    'most-sustainable', 'solo-traveler-best', 'budget-gems',
    'luxury-experiences', 'family-adventures', 'underground-legends',
    'beach-summer-vibes', 'electronic-meccas',
  ];
  const collectionPages: MetadataRoute.Sitemap = collectionSlugs.map(slug => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // Festival comparison pages
  const comparisonPages: MetadataRoute.Sitemap = COMPARISON_PAIRS.map(([a, b]) => ({
    url: `${baseUrl}/compare/${a.replace(/_/g, '-')}-vs-${b.replace(/_/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Best-of landing pages
  const bestOfSlugs = [
    'edm-festivals', 'rock-festivals', 'hip-hop-festivals', 'jazz-festivals',
    'world-music-festivals', 'summer-festivals', 'europe-festivals', 'usa-festivals',
    'budget-festivals', 'luxury-festivals', 'camping-festivals', 'family-festivals',
    'small-festivals', 'australia-festivals', 'canada-festivals',
    'latin-america-festivals', 'asia-pacific-festivals',
  ];
  const bestOfPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/best`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    ...bestOfSlugs.map(slug => ({
      url: `${baseUrl}/best/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  // City landing pages
  const uniqueCities = [...new Set((festivalsData as { city: string }[]).map(f => f.city))].filter(
    c => c !== 'Multiple Cities'
  );
  const cityPages: MetadataRoute.Sitemap = uniqueCities.map(city => ({
    url: `${baseUrl}/music-festivals-in/${cityToSlug(city)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog index + individual article pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedDate),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];

  return [
    ...corePages,
    ...festivalPages,
    ...countryIndexes,
    ...genreIndexes,
    ...monthIndexes,
    ...budgetIndexes,
    ...genreRegionPages,
    ...collectionsAndMap,
    ...collectionPages,
    ...comparisonPages,
    ...cityPages,
    ...bestOfPages,
    ...blogPages,
  ];
}
