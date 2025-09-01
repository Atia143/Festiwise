// Updated homepage component with real stats and SEO
'use client';

import { useEffect, useState } from 'react';
import { Metadata } from 'next';
import { seoManager } from '@/lib/seoManager';
import { schemaGenerator } from '@/lib/schemaGenerator';
import { statsManager } from '@/lib/realTimeStats';
import { analytics } from '@/lib/analytics';
import Script from 'next/script';
import { Link } from 'lucide-react';

// This would replace your current homepage
export default function EnhancedHomepage() {
  const [stats, setStats] = useState(statsManager.getFormattedStats());

  useEffect(() => {
    // Initialize analytics
    analytics.initialize('G-YOUR-GA4-ID');
    
    // Update stats periodically
    const interval = setInterval(() => {
      setStats(statsManager.getFormattedStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* JSON-LD Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGenerator.generateOrganizationSchema())
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGenerator.generateWebSiteSchema())
        }}
      />

      {/* Hero Section with Real Stats */}
      <section className="hero">
        <h1>Find Your Perfect Music Festival 2025</h1>
        <p>Discover the best music festivals from our database of {stats.festivals}</p>
        
        {/* Trust Indicators with Real Data */}
        <div className="trust-stats">
          <div className="stat">
            <span className="number">{stats.festivals}</span>
            <span className="label">Festivals</span>
          </div>
          <div className="stat">
            <span className="number">{stats.users}</span>
            <span className="label">Happy Users</span>
          </div>
          <div className="stat">
            <span className="number">{stats.countries}</span>
            <span className="label">Countries</span>
          </div>
          <div className="stat">
            <span className="number">{stats.currentUsers}</span>
            <span className="label">Online Now</span>
          </div>
        </div>

        {/* Last Updated */}
        <p className="last-updated">
          Last updated: {stats.lastUpdated} | 
          <a href="/about#data-sources">Data Sources</a>
        </p>
      </section>

      {/* Quick Links to Index Pages */}
      <section className="index-links">
        <h2>Browse by Category</h2>
        <div className="category-grid">
          <Link href="/festivals/genre/electronic">Electronic Festivals</Link>\
          <Link href="/festivals/germany">Germany Festivals</Link>
          <Link href="/festivals/budget/under-500">Budget Festivals</Link>
          <Link href="/festivals/month/july">July Festivals</Link>
        </div>
      </section>
    </>
  );
}

// Generate metadata for homepage
export function generateMetadata(): Metadata {
  return seoManager.generateHomepageMetadata();
}
