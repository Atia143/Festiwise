'use client';

import React, { useState } from 'react';
import { validateEventSchema, validateFestivalListingSchema } from './SchemaValidator';

/**
 * A development tool to validate schema markup on the site
 * Only use this component during development - remove in production
 */
export default function SchemaDebugTool() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const validateAllSchemas = async () => {
    setLoading(true);
    try {
      // Find all script elements with type="application/ld+json"
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const validationResults = [];
      
      for (let i = 0; i < scripts.length; i++) {
        try {
          const scriptContent = scripts[i].innerHTML;
          const schema = JSON.parse(scriptContent);
          
          let validation;
          
          if (schema['@type'] === 'MusicEvent') {
            validation = validateEventSchema(schema);
            validationResults.push({
              type: 'MusicEvent',
              name: schema.name || 'Unnamed event',
              validation
            });
          } else if (schema['@type'] === 'CollectionPage' || schema['@type'] === 'ItemList') {
            validation = validateFestivalListingSchema(schema);
            validationResults.push({
              type: schema['@type'],
              name: schema.name || 'Unnamed list',
              validation
            });
          } else {
            validationResults.push({
              type: schema['@type'] || 'Unknown',
              name: schema.name || 'Unnamed schema',
              validation: {
                valid: true,
                criticalErrors: [],
                nonCriticalErrors: ['Schema type not validated']
              }
            });
          }
        } catch (err) {
          validationResults.push({
            type: 'Error',
            name: 'Failed to parse',
            validation: {
              valid: false,
              criticalErrors: [(err as Error).message],
              nonCriticalErrors: []
            }
          });
        }
      }
      
      setResults(validationResults);
    } catch (err) {
      console.error('Schema validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Schema Debug Tool</h2>
      <button 
        onClick={validateAllSchemas}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Validating...' : 'Validate Schema'}
      </button>
      
      {results && (
        <div className="mt-4">
          <h3 className="font-medium">Results:</h3>
          <div className="mt-2 space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.map((result: any, index: number) => (
              <div key={index} className={`p-3 rounded ${result.validation.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{result.type}:</span> {result.name}
                  </div>
                  <div className={`text-sm ${result.validation.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {result.validation.valid ? 'Valid' : 'Invalid'}
                  </div>
                </div>
                
                {result.validation.criticalErrors.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-red-600">Critical Errors:</div>
                    <ul className="ml-4 text-sm text-red-600 list-disc">
                      {result.validation.criticalErrors.map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.validation.nonCriticalErrors.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-amber-600">Recommendations:</div>
                    <ul className="ml-4 text-sm text-amber-600 list-disc">
                      {result.validation.nonCriticalErrors.map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
