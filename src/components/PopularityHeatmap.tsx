'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type Region = {
  name: string;
  value: number; // 0-100 scale
  festivals: number;
  coordinates: {
    x: number; 
    y: number;
  }
}

export default function PopularityHeatmap() {
  const mapRef = useRef<SVGSVGElement>(null);
  
  // Sample data - in production this would come from your analytics or database
  const regions: Region[] = [
    { name: 'Western Europe', value: 92, festivals: 145, coordinates: { x: 45, y: 42 } },
    { name: 'North America (East)', value: 85, festivals: 87, coordinates: { x: 25, y: 40 } },
    { name: 'North America (West)', value: 78, festivals: 72, coordinates: { x: 15, y: 38 } },
    { name: 'UK & Ireland', value: 88, festivals: 76, coordinates: { x: 42, y: 37 } },
    { name: 'Iberian Peninsula', value: 80, festivals: 64, coordinates: { x: 42, y: 47 } },
    { name: 'Australia', value: 72, festivals: 52, coordinates: { x: 85, y: 75 } },
    { name: 'Eastern Europe', value: 68, festivals: 48, coordinates: { x: 53, y: 40 } },
    { name: 'Southeast Asia', value: 62, festivals: 37, coordinates: { x: 77, y: 55 } },
    { name: 'South America', value: 58, festivals: 42, coordinates: { x: 30, y: 68 } },
    { name: 'Middle East', value: 45, festivals: 24, coordinates: { x: 60, y: 50 } },
    { name: 'Africa', value: 40, festivals: 32, coordinates: { x: 50, y: 60 } },
    { name: 'Japan & Korea', value: 65, festivals: 38, coordinates: { x: 82, y: 45 } },
  ];

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  
  // Function to get color based on popularity value
  const getHeatColor = (value: number) => {
    // Purple-based heat gradient
    if (value >= 90) return '#7e22ce'; // purple-700
    if (value >= 80) return '#9333ea'; // purple-600
    if (value >= 70) return '#a855f7'; // purple-500
    if (value >= 60) return '#c084fc'; // purple-400
    if (value >= 50) return '#d8b4fe'; // purple-300
    if (value >= 40) return '#e9d5ff'; // purple-200
    return '#f3e8ff'; // purple-100
  };
  
  useEffect(() => {
    // Any initialization code for the map if needed
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Festival Popularity Map</h2>
          <p className="text-gray-600 mt-2">
            Discover where the world's most popular festivals are happening
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="relative">
              {/* World map - simplified outlines */}
              <svg
                ref={mapRef}
                viewBox="0 0 100 80"
                className="w-full h-auto max-h-[50vh] md:max-h-[60vh]"
                style={{ filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))' }}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified world map SVG paths would go here */}
                <path
                  d="M10,40 Q25,35 35,40 Q50,45 60,40 Q70,35 80,40 Q90,45 95,40 L95,55 Q80,50 70,55 Q60,60 50,55 Q40,50 30,55 Q20,60 10,55 Z"
                  fill="#f8f8f8"
                  stroke="#e5e5e5"
                  strokeWidth="0.2"
                />
                <path
                  d="M10,25 Q25,30 40,25 Q55,20 70,25 Q85,30 95,25 L95,40 Q80,35 65,40 Q50,45 35,40 Q20,35 10,40 Z"
                  fill="#f8f8f8"
                  stroke="#e5e5e5"
                  strokeWidth="0.2"
                />
                <path
                  d="M40,55 Q45,60 50,55 Q55,50 60,55 Q65,60 70,55 L70,65 Q65,70 60,65 Q55,60 50,65 Q45,70 40,65 Z"
                  fill="#f8f8f8"
                  stroke="#e5e5e5"
                  strokeWidth="0.2"
                />
                
                {/* Heat spots for each region */}
                {regions.map((region) => (
                  <g key={region.name}>
                    <motion.circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r={region.value / 20 + 1.5}
                      fill={getHeatColor(region.value)}
                      opacity={0.7}
                      whileHover={{ scale: 1.1, opacity: 0.9 }}
                      onClick={() => setSelectedRegion(region)}
                      style={{ cursor: 'pointer' }}
                    />
                    
                    <motion.circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r={region.value / 15}
                      fill="transparent"
                      stroke={getHeatColor(region.value)}
                      strokeWidth="0.2"
                      opacity={0.5}
                      animate={{
                        r: [region.value / 15, region.value / 10, region.value / 15],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </g>
                ))}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-md p-2 border border-gray-100 text-xs md:text-sm">
                <div className="font-medium mb-1">Popularity Index</div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                  <span>Very High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-purple-300"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
            
            {/* Region details */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              {selectedRegion ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedRegion.name}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedRegion.name}
                      </h3>
                      <p className="text-gray-600">
                        {selectedRegion.festivals} festivals tracked in our database
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                        <span className="font-medium">{selectedRegion.value}</span>
                        <span className="ml-1 text-xs">popularity index</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                      <div className="text-sm text-gray-500">Average Ticket Price</div>
                      <div className="font-semibold text-base md:text-lg">
                        ${Math.floor(200 + (selectedRegion.value * 2))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                      <div className="text-sm text-gray-500">Peak Season</div>
                      <div className="font-semibold text-base md:text-lg">
                        {selectedRegion.coordinates.y < 50 ? 'Jun - Aug' : 'Dec - Feb'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                      <div className="text-sm text-gray-500">Top Genre</div>
                      <div className="font-semibold text-base md:text-lg">
                        {selectedRegion.value > 80 ? 'Electronic' : 
                          selectedRegion.value > 70 ? 'Rock' : 
                          selectedRegion.value > 60 ? 'Pop' : 'Various'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Click on any region to see detailed festival statistics
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Why Popularity Matters</h3>
            <p className="text-gray-600">
              Festival popularity can influence ticket availability, pricing trends, and overall experience. 
              High-popularity regions often have more competitive ticket sales but also feature more extensive 
              infrastructure for festival-goers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
