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
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
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
    {
      url: `${baseUrl}/seo-demo`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }
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

  return [
    ...corePages,
    ...festivalPages,
    ...countryIndexes,
    ...genreIndexes,
    ...monthIndexes,
    ...budgetIndexes
  ];
}
