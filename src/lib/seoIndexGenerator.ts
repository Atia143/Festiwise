// SEO index page generator utilities
import festivalsData from '@/data/festivals.json';

export interface IndexPageData {
  slug: string;
  title: string;
  description: string;
  festivals: any[];
  count: number;
  canonical: string;
}

class SEOIndexGenerator {
  private festivals = festivalsData;

  // Generate country index pages
  generateCountryIndexes(): IndexPageData[] {
    const countryGroups = this.groupBy(this.festivals, 'country');
    
    return Object.entries(countryGroups).map(([country, festivals]) => ({
      slug: country.toLowerCase().replace(/\s+/g, '-'),
      title: `Music Festivals in ${country} 2025 | Best Festival Guide`,
      description: `Discover the best music festivals in ${country}. ${festivals.length} festivals including EDM, indie, rock & more. Compare prices, dates & tickets.`,
      festivals,
      count: festivals.length,
      canonical: `/festivals/${country.toLowerCase().replace(/\s+/g, '-')}`
    }));
  }

  // Generate genre index pages
  generateGenreIndexes(): IndexPageData[] {
    const allGenres = new Set(this.festivals.flatMap(f => f.genres));
    
    return Array.from(allGenres).map(genre => {
      const genreFestivals = this.festivals.filter(f => f.genres.includes(genre));
      return {
        slug: genre.toLowerCase(),
        title: `Best ${this.capitalizeGenre(genre)} Festivals 2025 | ${this.capitalizeGenre(genre)} Music Events`,
        description: `Find the best ${genre} music festivals worldwide. ${genreFestivals.length} festivals featuring top ${genre} artists. Compare tickets & dates.`,
        festivals: genreFestivals,
        count: genreFestivals.length,
        canonical: `/festivals/genre/${genre.toLowerCase()}`
      };
    });
  }

  // Generate month index pages
  generateMonthIndexes(): IndexPageData[] {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
    
    return months.map(month => {
      const monthFestivals = this.festivals.filter(f => 
        f.months.some(m => m.toLowerCase() === month)
      );
      
      return {
        slug: month,
        title: `Music Festivals in ${this.capitalizeFirst(month)} 2025 | ${this.capitalizeFirst(month)} Festival Guide`,
        description: `Best music festivals happening in ${this.capitalizeFirst(month)} 2025. ${monthFestivals.length} festivals worldwide. Find your perfect festival this ${month}.`,
        festivals: monthFestivals,
        count: monthFestivals.length,
        canonical: `/festivals/month/${month}`
      };
    });
  }

  // Generate budget index pages
  generateBudgetIndexes(): IndexPageData[] {
    const budgetRanges = [
      { slug: 'under-300', min: 0, max: 300, label: 'Under $300' },
      { slug: 'under-500', min: 0, max: 500, label: 'Under $500' },
      { slug: 'under-1000', min: 0, max: 1000, label: 'Under $1000' },
      { slug: 'luxury', min: 1500, max: 10000, label: 'Luxury' }
    ];

    return budgetRanges.map(range => {
      const budgetFestivals = this.festivals.filter(f => 
        f.estimated_cost_usd.min >= range.min && f.estimated_cost_usd.max <= range.max
      );

      return {
        slug: range.slug,
        title: `${range.label} Music Festivals 2025 | Affordable Festival Guide`,
        description: `Best music festivals ${range.label.toLowerCase()} in 2025. ${budgetFestivals.length} budget-friendly festivals worldwide. Compare prices & save money.`,
        festivals: budgetFestivals,
        count: budgetFestivals.length,
        canonical: `/festivals/budget/${range.slug}`
      };
    });
  }

  // Helper methods
  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = (item[key] as string) || 'Other';
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private capitalizeGenre(genre: string): string {
    const genreMap: Record<string, string> = {
      'electronic': 'Electronic',
      'hiphop': 'Hip-Hop',
      'indie': 'Indie',
      'rock': 'Rock',
      'pop': 'Pop',
      'folk': 'Folk',
      'jazz': 'Jazz',
      'classical': 'Classical',
      'reggae': 'Reggae'
    };
    return genreMap[genre] || this.capitalizeFirst(genre);
  }

  // Generate all indexes for sitemap
  generateAllIndexes(): IndexPageData[] {
    return [
      ...this.generateCountryIndexes(),
      ...this.generateGenreIndexes(),
      ...this.generateMonthIndexes(),
      ...this.generateBudgetIndexes()
    ];
  }
}

export const seoIndexGenerator = new SEOIndexGenerator();
