'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type MonthData = {
  name: string;
  festivals: number;
  peak: boolean;
}

export default function FestivalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data - in production this would be dynamically generated
  const monthsData: MonthData[] = [
    { name: 'Jan', festivals: 12, peak: false },
    { name: 'Feb', festivals: 15, peak: false },
    { name: 'Mar', festivals: 28, peak: false },
    { name: 'Apr', festivals: 56, peak: false },
    { name: 'May', festivals: 87, peak: true },
    { name: 'Jun', festivals: 142, peak: true },
    { name: 'Jul', festivals: 178, peak: true },
    { name: 'Aug', festivals: 152, peak: true },
    { name: 'Sep', festivals: 76, peak: true },
    { name: 'Oct', festivals: 45, peak: false },
    { name: 'Nov', festivals: 22, peak: false },
    { name: 'Dec', festivals: 18, peak: false },
  ];

  // Get the max festivals count for normalization
  const maxFestivals = Math.max(...monthsData.map(month => month.festivals));

  // Get current month index (0-based)
  const currentMonthIndex = new Date().getMonth();
  
  useEffect(() => {
    // Set current month as selected on initial load
    setSelectedMonth(currentMonthIndex);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [currentMonthIndex]);

  const getMonthDetails = (monthIndex: number) => {
    const regionData = [
      { name: 'Europe', count: Math.floor(monthsData[monthIndex].festivals * 0.45) },
      { name: 'North America', count: Math.floor(monthsData[monthIndex].festivals * 0.3) },
      { name: 'Asia', count: Math.floor(monthsData[monthIndex].festivals * 0.15) },
      { name: 'Other Regions', count: Math.floor(monthsData[monthIndex].festivals * 0.1) }
    ];
    
    const genreData = [
      { name: 'Electronic', percent: 35 },
      { name: 'Rock & Alternative', percent: 25 },
      { name: 'Pop & Mainstream', percent: 20 },
      { name: 'Urban & Hip Hop', percent: 15 },
      { name: 'Other Genres', percent: 5 }
    ];
    
    return { regions: regionData, genres: genreData };
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Global Festival Calendar</h2>
          <p className="text-gray-600 mt-2">
            Plan your year with our interactive festival timeline
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col space-y-4">
            {/* Calendar visualization */}
            <div className="flex items-end justify-between h-40 mb-6">
              {monthsData.map((month, index) => {
                // Calculate height percentage based on festival count
                const heightPercentage = (month.festivals / maxFestivals) * 100;
                const isSelected = selectedMonth === index;
                
                return (
                  <div 
                    key={month.name} 
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative w-full flex justify-center mb-2">
                      <motion.div
                        className={`w-full max-w-[30px] md:max-w-[40px] rounded-t-md cursor-pointer ${
                          isSelected 
                            ? 'bg-purple-600' 
                            : month.peak 
                              ? 'bg-gradient-to-b from-purple-400 to-purple-500' 
                              : 'bg-gray-200'
                        }`}
                        style={{ height: `${Math.max(heightPercentage, 10)}%` }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedMonth(index)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${month.name}`}
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedMonth(index);
                          }
                        }}
                      />
                      
                      {/* Show festival count on hover/selected */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                          >
                            {month.festivals} festivals
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className={`text-xs font-medium ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
                      {month.name}
                    </span>
                  </div>
                );
              })}
            </div>
            
              {/* Selected month details */}
            {selectedMonth !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border-t border-gray-100 pt-6"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4">
                      {new Date(2025, selectedMonth).toLocaleString('default', { month: 'long' })} Highlights
                    </h3>                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Festivals</span>
                        <span className="font-semibold">{monthsData[selectedMonth].festivals}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Peak Season</span>
                        <span className={`${monthsData[selectedMonth].peak ? 'text-green-500' : 'text-gray-500'} font-medium`}>
                          {monthsData[selectedMonth].peak ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Average Ticket Price</span>
                        <span className="font-semibold">
                          ${monthsData[selectedMonth].peak ? '250 - 400' : '150 - 300'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={`/festivals?month=${selectedMonth + 1}`}
                        className="text-sm text-purple-600 font-medium hover:text-purple-700 flex items-center"
                      >
                        View all {monthsData[selectedMonth].name} festivals
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-4">Regional Breakdown</h3>
                    {getMonthDetails(selectedMonth).regions.map((region, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{region.name}</span>
                          <span className="font-medium">{region.count} festivals</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="h-2 bg-purple-500 rounded-full" 
                            style={{ width: `${(region.count / monthsData[selectedMonth].festivals) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Data based on our comprehensive global festival database.
            Updated monthly with the latest announcements.
          </p>
        </div>
      </div>
    </section>
  );
}
