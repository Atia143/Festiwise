/**
 * Schema Validator Utility
 * 
 * This utility ensures that all structured data for festival events follows
 * Google's requirements for rich results by validating essential fields are present.
 * 
 * Based on Google Search Console requirements:
 * - Critical fields: startDate, location
 * - Non-critical fields: image, offers, performer, endDate, description
 */

export type EventSchema = {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: {
    '@type': string;
    name: string;
    address: {
      '@type': string;
      addressLocality: string;
      addressCountry: string;
    };
  };
  image?: string[];
  performer?: Array<{ '@type': string; name: string }>;
  offers?: {
    '@type': string;
    priceCurrency: string;
    lowPrice: number;
    highPrice: number;
    availability?: string;
    url: string;
  };
  [key: string]: any;
};

/**
 * Validates if a schema meets Google's requirements for events
 */
export const validateEventSchema = (schema: EventSchema): {
  valid: boolean;
  criticalErrors: string[];
  nonCriticalErrors: string[];
} => {
  const criticalErrors: string[] = [];
  const nonCriticalErrors: string[] = [];

  // Check critical fields
  if (!schema.startDate) {
    criticalErrors.push("Missing field 'startDate'");
  }
  
  if (!schema.location) {
    criticalErrors.push("Missing field 'location'");
  } else if (!schema.location.name || !schema.location.address) {
    criticalErrors.push("Incomplete 'location' field");
  }
  
  // Check non-critical fields
  if (!schema.image || schema.image.length === 0) {
    nonCriticalErrors.push("Missing field 'image'");
  }
  
  if (!schema.offers) {
    nonCriticalErrors.push("Missing field 'offers'");
  }
  
  if (!schema.performer || schema.performer.length === 0) {
    nonCriticalErrors.push("Missing field 'performer'");
  }
  
  if (!schema.endDate) {
    nonCriticalErrors.push("Missing field 'endDate'");
  }
  
  if (!schema.description) {
    nonCriticalErrors.push("Missing field 'description'");
  }
  
  return {
    valid: criticalErrors.length === 0,
    criticalErrors,
    nonCriticalErrors,
  };
};

/**
 * Validates event items in a ListingSchema
 */
export const validateFestivalListingSchema = (schema: any): {
  valid: boolean;
  criticalErrors: string[];
  nonCriticalErrors: string[];
} => {
  const criticalErrors: string[] = [];
  const nonCriticalErrors: string[] = [];
  
  if (!schema.mainEntity || !schema.mainEntity.itemListElement) {
    criticalErrors.push("Missing itemListElement in schema");
    return { valid: false, criticalErrors, nonCriticalErrors };
  }
  
  // Validate each event in the list
  schema.mainEntity.itemListElement.forEach((listItem: any, index: number) => {
    if (!listItem.item || listItem.item['@type'] !== 'MusicEvent') {
      criticalErrors.push(`Item at position ${index + 1} is not a valid MusicEvent`);
      return;
    }
    
    const eventSchema = listItem.item as EventSchema;
    const validation = validateEventSchema(eventSchema);
    
    if (validation.criticalErrors.length > 0) {
      criticalErrors.push(`Event at position ${index + 1} has critical errors: ${validation.criticalErrors.join(', ')}`);
    }
    
    if (validation.nonCriticalErrors.length > 0) {
      nonCriticalErrors.push(`Event at position ${index + 1} has non-critical errors: ${validation.nonCriticalErrors.join(', ')}`);
    }
  });
  
  return {
    valid: criticalErrors.length === 0,
    criticalErrors,
    nonCriticalErrors,
  };
};
