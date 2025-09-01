// Template for all index pages (country/genre/month/budget)
'use client';

import Link from 'next/link';
import { useFilters } from '@/lib/filterManager';
import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { schemaGenerator } from '@/lib/schemaGenerator';
// import { FestivalCard } from '@/components/FestivalCard'; // TODO: Create this component
import Script from 'next/script';

interface IndexPageProps {
  type: 'country' | 'genre' | 'month' | 'budget';
  value: string;
  title: string;
  description: string;
  initialFilters: Record<string, any>;
}

export default function IndexPageTemplate({ 
  type, 
  value, 
  title, 
  description, 
  initialFilters 
}: IndexPageProps) {
  const { results, filters, updateFilters, filterOptions } = useFilters();

  useEffect(() => {
    // Apply initial filters
    updateFilters(initialFilters);
    
    // Track page view
    analytics.trackPageView(window.location.pathname, title);
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Festivals', url: '/festivals' },
    { name: title, url: window.location.pathname }
  ];

  const collectionSchema = schemaGenerator.generateCollectionPageSchema(
    title,
    description,
    results.festivals
  );

  const breadcrumbSchema = schemaGenerator.generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* JSON-LD Schemas */}
      <Script
        id="collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.url}>
            {index > 0 && ' / '}
            {index === breadcrumbs.length - 1 ? (
              <span aria-current="page">{crumb.name}</span>
            ) : (
              <a href={crumb.url}>{crumb.name}</a>
            )}
          </span>
        ))}
      </nav>

      {/* Page Header */}
      <header className="page-header">
        <h1>{title}</h1>
        <p>{description}</p>
        <p className="results-count">
          {results.totalCount} festivals found
        </p>
      </header>

      {/* Filters */}
      <section className="filters" aria-label="Festival filters">
        <div className="filter-group">
          <label htmlFor="genre-filter">Genre:</label>
          <select 
            id="genre-filter"
            value={filters.genres[0] || ''}
            onChange={(e) => updateFilters({ 
              genres: e.target.value ? [e.target.value] : [] 
            })}
          >
            <option value="">All Genres</option>
            {filterOptions.genres.map(genre => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="country-filter">Country:</label>
          <select 
            id="country-filter"
            value={filters.countries[0] || ''}
            onChange={(e) => updateFilters({ 
              countries: e.target.value ? [e.target.value] : [] 
            })}
          >
            <option value="">All Countries</option>
            {filterOptions.countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="budget-filter">Budget:</label>
          <select 
            id="budget-filter"
            onChange={(e) => {
              const range = filterOptions.budgetRanges.find(r => r.label === e.target.value);
              if (range) {
                updateFilters({ budgetMin: range.min, budgetMax: range.max });
              } else {
                updateFilters({ budgetMin: undefined, budgetMax: undefined });
              }
            }}
          >
            <option value="">All Budgets</option>
            {filterOptions.budgetRanges.map(range => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => {
            analytics.trackFilterClear(
              Object.values(filters).filter(Boolean).length
            );
            window.location.href = window.location.pathname;
          }}
          className="clear-filters"
        >
          Clear Filters
        </button>
      </section>

      {/* Festival Grid */}
      <section className="festival-grid">
        {results.festivals.map(festival => (
          <div 
            key={festival.id} 
            className="festival-card"
            onClick={() => analytics.trackFestivalView(
              festival.id, 
              festival.name, 
              'browse'
            )}
          >
            <h3>{festival.name}</h3>
            <p>{festival.location.city}, {festival.location.country}</p>
            {/* TODO: Replace with proper FestivalCard component */}
          </div>
        ))}
      </section>

      {/* Internal Links */}
      <section className="related-pages">
        <h2>Related Festival Categories</h2>
        <ul>
          <li><Link href="/festivals/genre/electronic">Electronic Festivals</Link></li>
          <li><Link href="/festivals/budget/under-500">Budget Festivals</Link></li>
          <li><Link href="/festivals/month/summer">Summer Festivals</Link></li>
        </ul>
      </section>
    </>
  );
}
