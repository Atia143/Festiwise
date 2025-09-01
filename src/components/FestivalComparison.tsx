'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type ComparisonFestival = {
  id: string;
  name: string;
  location: string;
  dates: string;
  price_range: string;
  genres: string[];
  audience_size: string;
  camping_available: boolean;
  rating: number;
  image_url: string;
};

export default function FestivalComparison() {
  const [compareList, setCompareList] = useState<ComparisonFestival[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  // Simulated access to local storage
  useEffect(() => {
    // In production, this would load from localStorage or a state management system
    const savedCompareList = localStorage.getItem('festiwiseCompare');
    if (savedCompareList) {
      try {
        setCompareList(JSON.parse(savedCompareList));
      } catch (e) {
        console.error('Error parsing compare list', e);
      }
    }
  }, []);
  
  // Save to storage when list changes
  useEffect(() => {
    if (compareList.length > 0) {
      localStorage.setItem('festiwiseCompare', JSON.stringify(compareList));
    }
  }, [compareList]);
  
  const removeFestival = (id: string) => {
    setCompareList(prev => prev.filter(festival => festival.id !== id));
    if (compareList.length <= 1) {
      setIsCompareOpen(false);
    }
  };
  
  const clearAll = () => {
    setCompareList([]);
    setIsCompareOpen(false);
    localStorage.removeItem('festiwiseCompare');
  };

  if (compareList.length === 0) return null;
  
  return (
    <>
      {/* Comparison Drawer Trigger */}
      {!isCompareOpen && compareList.length > 0 && (
        <button
          onClick={() => setIsCompareOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-24 md:right-8 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg z-40 flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          <span className="font-medium">Compare {compareList.length}</span>
        </button>
      )}

      {/* Comparison Drawer */}
      <AnimatePresence>
        {isCompareOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-2xl border-t border-gray-200 max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Compare Festivals</h3>
              <div className="flex space-x-3">
                <button 
                  onClick={clearAll}
                  className="text-gray-500 hover:text-gray-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="p-2 text-left font-medium text-gray-500 w-[150px]">Festival</th>
                      {compareList.map(festival => (
                        <th key={festival.id} className="p-2 text-left">
                          <div className="relative">
                            <button
                              onClick={() => removeFestival(festival.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                            <div className="h-24 w-full bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${festival.image_url})` }}></div>
                            <h4 className="font-bold mt-2">{festival.name}</h4>
                            <p className="text-sm text-gray-500">{festival.location}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-500">Dates</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">{festival.dates}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-500">Price Range</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">{festival.price_range}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-500">Music Genres</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {festival.genres.map(genre => (
                              <span key={genre} className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                {genre}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-500">Audience Size</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">{festival.audience_size}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-500">Camping</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">
                          {festival.camping_available ? (
                            <span className="text-green-600 flex items-center">
                              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Available
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                              Not Available
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 font-medium text-gray-500">Rating</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < festival.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-500">Details</td>
                      {compareList.map(festival => (
                        <td key={festival.id} className="p-3">
                          <Link href={`/festival/${festival.id}`} className="text-purple-600 font-medium hover:text-purple-800 underline">
                            View Details
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
