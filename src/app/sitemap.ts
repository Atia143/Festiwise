import { MetadataRoute } from 'next';
import festivalsData from '@/data/festivals.json';
import { seoIndexGenerator } from '@/lib/seoIndexGenerator';

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
    // SEO landing pages (2026)
    {
      url: `${baseUrl}/cheap-music-festivals-europe-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/festival-packing-list-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/electronic-music-festivals-usa-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/summer-music-festivals-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music-festival-safety-tips-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/best-music-festivals-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/music-festival-guide-2026`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/when-to-buy-festival-tickets-2026`,
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

  // Festival pages
  const festivalPages = festivalsData.map(festival => ({
    url: `${baseUrl}/festival/${festival.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Country index pages
  const countryIndexes = seoIndexGenerator.generateCountryIndexes().map(country => ({
    url: `${baseUrl}${country.canonical}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Genre index pages
  const genreIndexes = seoIndexGenerator.generateGenreIndexes().map(genre => ({
    url: `${baseUrl}${genre.canonical}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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
      const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
      const hasFestivals = (festivalsData as { genres: string[]; region?: string; status: string }[]).some(
        f => f.genres.some(g => slug(g) === slug(genre)) && f.region && slug(f.region) === slug(region) && f.status === 'active',
      );
      if (hasFestivals) {
        genreRegionPages.push({
          url: `${baseUrl}/festivals/${slug(genre)}/${slug(region)}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
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
  ];
}
