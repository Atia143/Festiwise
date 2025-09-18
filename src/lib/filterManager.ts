// Global filtering system with URL state management
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import festivalsData from '@/data/festivals.json';

export interface FilterState {
  genres: string[];
  countries: string[];
  months: string[];
  budgetMin?: number;
  budgetMax?: number;
  searchQuery?: string;
  sortBy: 'name' | 'cost' | 'popularity' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface FilteredResults {
  festivals: any[];
  totalCount: number;
  appliedFilters: FilterState;
}

export const DEFAULT_FILTERS: FilterState = {
  genres: [],
  countries: [],
  months: [],
  budgetMin: undefined,
  budgetMax: undefined,
  searchQuery: '',
  sortBy: 'popularity',
  sortOrder: 'desc'
};

class FilterManager {
  private router: any;
  private pathname: string;
  private searchParams: URLSearchParams;

  constructor(router: any, pathname: string, searchParams: URLSearchParams) {
    this.router = router;
    this.pathname = pathname;
    this.searchParams = searchParams;
  }

  // Parse filters from URL search params
  parseFiltersFromURL(): FilterState {
    const genres = this.searchParams.get('genres')?.split(',').filter(Boolean) || [];
    const countries = this.searchParams.get('countries')?.split(',').filter(Boolean) || [];
    const months = this.searchParams.get('months')?.split(',').filter(Boolean) || [];
    const budgetMin = this.searchParams.get('budgetMin') ? 
      parseInt(this.searchParams.get('budgetMin')!) : undefined;
    const budgetMax = this.searchParams.get('budgetMax') ? 
      parseInt(this.searchParams.get('budgetMax')!) : undefined;
    const searchQuery = this.searchParams.get('q') || '';
    const sortBy = (this.searchParams.get('sort') as FilterState['sortBy']) || 'popularity';
    const sortOrder = (this.searchParams.get('order') as FilterState['sortOrder']) || 'desc';

    return {
      genres,
      countries,
      months,
      budgetMin,
      budgetMax,
      searchQuery,
      sortBy,
      sortOrder
    };
  }

  // Update URL with new filters
  updateFiltersInURL(filters: Partial<FilterState>) {
    const currentFilters = this.parseFiltersFromURL();
    const newFilters = { ...currentFilters, ...filters };
    
    const params = new URLSearchParams();

    // Add non-empty filters to params
    if (newFilters.genres.length > 0) {
      params.set('genres', newFilters.genres.join(','));
    }
    if (newFilters.countries.length > 0) {
      params.set('countries', newFilters.countries.join(','));
    }
    if (newFilters.months.length > 0) {
      params.set('months', newFilters.months.join(','));
    }
    if (newFilters.budgetMin !== undefined) {
      params.set('budgetMin', newFilters.budgetMin.toString());
    }
    if (newFilters.budgetMax !== undefined) {
      params.set('budgetMax', newFilters.budgetMax.toString());
    }
    if (newFilters.searchQuery && newFilters.searchQuery.trim()) {
      params.set('q', newFilters.searchQuery.trim());
    }
    if (newFilters.sortBy !== 'popularity') {
      params.set('sort', newFilters.sortBy);
    }
    if (newFilters.sortOrder !== 'desc') {
      params.set('order', newFilters.sortOrder);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${this.pathname}?${queryString}` : this.pathname;
    
    this.router.push(newUrl, { scroll: false });
  }

  // Clear all filters
  clearFilters() {
    this.router.push(this.pathname, { scroll: false });
  }

  // Get canonical URL for current filters
  getCanonicalURL(): string {
    const baseUrl = 'https://festivalfinder.com';
    const queryString = this.searchParams.toString();
    return queryString ? `${baseUrl}${this.pathname}?${queryString}` : `${baseUrl}${this.pathname}`;
  }
}

// Festival filtering logic
export class FestivalFilter {
  static filterFestivals(filters: FilterState): FilteredResults {
    let filtered = [...festivalsData];

    // Apply genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter(festival =>
        festival.genres.some(genre => filters.genres.includes(genre))
      );
    }

    // Apply country filter
    if (filters.countries.length > 0) {
      filtered = filtered.filter(festival =>
        filters.countries.includes(festival.country)
      );
    }

    // Apply month filter
    if (filters.months.length > 0) {
      filtered = filtered.filter(festival =>
        festival.months.some(month => 
          filters.months.includes(month.toLowerCase())
        )
      );
    }

    // Apply budget filter
    if (filters.budgetMin !== undefined || filters.budgetMax !== undefined) {
      filtered = filtered.filter(festival => {
        const festivalMin = festival.estimated_cost_usd.min;
        const festivalMax = festival.estimated_cost_usd.max;
        
        if (filters.budgetMin !== undefined && festivalMax < filters.budgetMin) {
          return false;
        }
        if (filters.budgetMax !== undefined && festivalMin > filters.budgetMax) {
          return false;
        }
        return true;
      });
    }

    // Apply search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(festival =>
        festival.name.toLowerCase().includes(query) ||
        festival.city.toLowerCase().includes(query) ||
        festival.country.toLowerCase().includes(query) ||
        festival.genres.some(genre => genre.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          comparison = a.estimated_cost_usd.min - b.estimated_cost_usd.min;
          break;
        case 'date':
          // Sort by month order
          const monthOrder = ['january', 'february', 'march', 'april', 'may', 'june',
                             'july', 'august', 'september', 'october', 'november', 'december'];
          const aMonth = monthOrder.indexOf(a.months[0]?.toLowerCase() || 'july');
          const bMonth = monthOrder.indexOf(b.months[0]?.toLowerCase() || 'july');
          comparison = aMonth - bMonth;
          break;
        case 'popularity':
        default:
          // Mock popularity - in real app, this would be based on actual data
          comparison = (a.audience_size === 'massive' ? 3 : a.audience_size === 'large' ? 2 : 1) -
                      (b.audience_size === 'massive' ? 3 : b.audience_size === 'large' ? 2 : 1);
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return {
      festivals: filtered,
      totalCount: filtered.length,
      appliedFilters: filters
    };
  }

  // Get available filter options from data
  static getFilterOptions() {
    const allGenres = [...new Set(festivalsData.flatMap(f => f.genres))].sort();
    const allCountries = [...new Set(festivalsData.map(f => f.country))].sort();
    const allMonths = ['january', 'february', 'march', 'april', 'may', 'june',
                      'july', 'august', 'september', 'october', 'november', 'december'];
    
    const budgetRanges = [
      { label: 'Under $300', min: 0, max: 300 },
      { label: '$300 - $500', min: 300, max: 500 },
      { label: '$500 - $1000', min: 500, max: 1000 },
      { label: '$1000 - $2000', min: 1000, max: 2000 },
      { label: 'Over $2000', min: 2000, max: 10000 }
    ];

    return {
      genres: allGenres,
      countries: allCountries,
      months: allMonths,
      budgetRanges
    };
  }
}

// Custom hook for filter management
export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const filterManager = useMemo(
    () => new FilterManager(router, pathname || '/', searchParams || new URLSearchParams()),
    [router, pathname, searchParams]
  );

  const currentFilters = useMemo(
    () => filterManager.parseFiltersFromURL(),
    [filterManager, searchParams]
  );

  const filteredResults = useMemo(
    () => FestivalFilter.filterFestivals(currentFilters),
    [currentFilters, filterManager]
  );

  const updateFilters = useCallback((filters: Partial<FilterState>) => {
    filterManager.updateFiltersInURL(filters);
  }, [filterManager]);

  const clearFilters = useCallback(() => {
    filterManager.clearFilters();
  }, [filterManager]);

  const canonicalURL = useMemo(
    () => filterManager.getCanonicalURL(),
    [filterManager]
  );

  return {
    filters: currentFilters,
    results: filteredResults,
    updateFilters,
    clearFilters,
    canonicalURL,
    filterOptions: FestivalFilter.getFilterOptions()
  };
}

export default FilterManager;
