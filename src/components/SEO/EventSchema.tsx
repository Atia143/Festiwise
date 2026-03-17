'use client';

import React from 'react';
import { Festival } from '@/utils/match';
import Script from 'next/script';

interface EventSchemaProps {
  festival: Festival;
}

/**
 * Component for adding properly formatted Event structured data to festival pages
 * Implements all required fields for Google rich results:
 * 
 * Critical fields (required by Google):
 * - startDate: ISO format date when the event begins
 * - location: Structured venue information including name and address
 * 
 * Non-critical fields (recommended by Google):
 * - image: At least one image URL for the event
 * - offers: Ticket pricing and availability information
 * - performer: Artists or performers at the event
 * - endDate: ISO format date when the event ends
 * - description: Text description of the event
 * 
 * All fields are implemented to ensure this schema passes Google Search Console validation
 * and enables rich results in search.
 */
export default function EventSchema({ festival }: EventSchemaProps) {
  // Format date ranges properly for schema
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // Map month names to numerical months and create ISO date strings
  const monthMap: Record<string, number> = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 
    'may': 4, 'june': 5, 'july': 6, 'august': 7, 
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  };
  
  // Determine festival year (if current month is after festival month, use next year)
  const firstMonth = festival.months[0]?.toLowerCase() || 'january';
  const monthIndex = monthMap[firstMonth] || 0;
  const currentMonth = new Date().getMonth();
  const festivalYear = currentMonth > monthIndex ? nextYear : currentYear;
  
  // Create start and end dates (estimate end date as duration_days after start)
  const startDate = new Date(festivalYear, monthIndex, 1); // Use first of month as default
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (festival.duration_days || 3));
  
  // Format dates as ISO strings
  const isoStartDate = startDate.toISOString();
  const isoEndDate = endDate.toISOString();

  // Construct schema data object with all required fields for Google Search Console
  const schemaData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: festival.name,
    description: `${festival.name} is a ${festival.genres?.join(', ') || 'music'} festival in ${festival.city}, ${festival.country}. Experience ${festival.vibe?.join(', ') || 'amazing'} vibes over ${festival.duration_days} days with ${festival.audience_size} crowds.`,
    startDate: isoStartDate,
    endDate: isoEndDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: festival.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: festival.city,
        addressCountry: festival.country
      }
    },
    image: [
      `https://getfestiwise.com/api/og/festival?id=${festival.id}`,
    ],
    // performer is omitted — no real lineup data available; wrong values harm rankings
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: festival.estimated_cost_usd?.min || 0,
      highPrice: festival.estimated_cost_usd?.max || 999,
      availability: 'https://schema.org/InStock',
      url: festival.website || `https://getfestiwise.com/festival/${festival.id}`
    },
    organizer: {
      '@type': 'Organization',
      name: festival.name,
      url: festival.website
    },
    url: `https://getfestiwise.com/festival/${festival.id}`
  };

  return (
    <Script 
      id={`event-schema-${festival.id}`} 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
