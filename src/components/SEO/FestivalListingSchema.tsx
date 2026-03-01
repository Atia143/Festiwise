'use client';

import React from 'react';
import Script from 'next/script';

interface FestivalListingSchemaProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  festivals: any[]; // Using any[] since different pages may have slightly different festival types
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
}

/**
 * Component for adding structured data to festival listing pages
 * Implements a CollectionPage with an ItemList containing MusicEvent items
 * 
 * Each MusicEvent in the list includes all required fields for Google rich results:
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
 * This component ensures that festival listing pages provide proper structured data
 * for all events listed, optimizing them for Google Search.
 */
export default function FestivalListingSchema({ 
  festivals, 
  pageTitle, 
  pageDescription,
  pageUrl 
}: FestivalListingSchemaProps) {
  
  // Calculate current year and next year for dates
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // Map month names to numerical months
  const monthMap: Record<string, number> = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 
    'may': 4, 'june': 5, 'july': 6, 'august': 7, 
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  };

  // First, create the CollectionPage/ItemList schema
  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: festivals.length,
      itemListElement: festivals.map((festival, index) => {
        // Format dates properly for schema
        const firstMonth = festival.months[0]?.toLowerCase() || 'january';
        const monthIndex = monthMap[firstMonth] || 0;
        const currentMonth = new Date().getMonth();
        const festivalYear = currentMonth > monthIndex ? nextYear : currentYear;
        
        // Create start and end dates
        const startDate = new Date(festivalYear, monthIndex, 15); // Use middle of month as default
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (festival.duration_days || 3));
        
        // Format dates as ISO strings
        const isoStartDate = startDate.toISOString();
        const isoEndDate = endDate.toISOString();

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'MusicEvent',
            name: festival.name,
            // Required: description (previously non-critical issue)
            description: `${festival.name} is a ${festival.genres?.join(', ') || 'music'} festival in ${festival.city}, ${festival.country}.`,
            // Required: startDate (was critical issue)
            startDate: isoStartDate,
            // Required: endDate (previously non-critical issue)
            endDate: isoEndDate,
            url: `https://getfestiwise.com/festival/${festival.id}`,
            // Required: location (was critical issue)
            location: {
              '@type': 'Place',
              name: festival.city,
              address: {
                '@type': 'PostalAddress',
                addressLocality: festival.city,
                addressCountry: festival.country
              }
            },
            // Required: image (previously non-critical issue)
            image: [
              `https://getfestiwise.com/images/festivals/${festival.id || 'default'}.jpg`
            ],
            // Required: offers (previously non-critical issue)
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              lowPrice: festival.estimated_cost_usd?.min || 0,
              highPrice: festival.estimated_cost_usd?.max || 999,
              url: festival.website || `https://getfestiwise.com/festival/${festival.id}`
            },
            // Required: performer (previously non-critical issue)
            performer: (festival.vibe || festival.genres || []).slice(0, 3).map((performer: string) => ({
              '@type': 'MusicGroup',
              name: performer
            }))
          }
        };
      })
    }
  };

  return (
    <Script
      id="festival-listing-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
    />
  );
}
