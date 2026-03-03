'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Region = {
  name: string;
  value: number; // 0-100 scale
  festivals: number;
  coordinates: {
    x: number;
    y: number;
  };
};

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

function getHeatColor(value: number) {
  if (value >= 90) return '#7e22ce';
  if (value >= 80) return '#9333ea';
  if (value >= 70) return '#a855f7';
  if (value >= 60) return '#c084fc';
  if (value >= 50) return '#d8b4fe';
  if (value >= 40) return '#e9d5ff';
  return '#f3e8ff';
}

export default function PopularityHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Festival Popularity Map</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Discover where the world&apos;s most popular festivals are happening
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="relative">
              {/* World map */}
              <svg
                viewBox="0 0 100 80"
                className="w-full h-auto max-h-[50vh] md:max-h-[60vh]"
                style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.1))' }}
                preserveAspectRatio="xMidYMid meet"
                aria-label="World map showing festival popularity by region"
                role="img"
              >
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

                {/* Heat spots */}
                {regions.map((region) => (
                  <g key={region.name}>
                    <motion.circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r={region.value / 20 + 1.5}
                      fill={getHeatColor(region.value)}
                      opacity={selectedRegion?.name === region.name ? 1 : 0.7}
                      whileTap={{ scale: 1.15 }}
                      whileHover={{ scale: 1.1, opacity: 0.9 }}
                      onClick={() => setSelectedRegion(region)}
                      style={{ cursor: 'pointer' }}
                      aria-label={`${region.name}: ${region.value} popularity index, ${region.festivals} festivals`}
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
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 border border-gray-100 shadow-sm">
                <div className="text-xs font-semibold text-gray-700 mb-1.5">Popularity</div>
                {[
                  { color: 'bg-purple-700', label: 'Very High' },
                  { color: 'bg-purple-500', label: 'High' },
                  { color: 'bg-purple-300', label: 'Medium' },
                  { color: 'bg-purple-100', label: 'Low' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 mb-1 last:mb-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Region details */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              {selectedRegion ? (
                <motion.div
                  key={selectedRegion.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {selectedRegion.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {selectedRegion.festivals} festivals in our database
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 self-start sm:self-auto">
                      <span className="font-bold text-sm">{selectedRegion.value}</span>
                      <span className="text-xs text-purple-500">/ 100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: 'Avg. Ticket',
                        value: `$${Math.floor(200 + selectedRegion.value * 2)}`,
                      },
                      {
                        label: 'Peak Season',
                        value: selectedRegion.coordinates.y < 50 ? 'Jun – Aug' : 'Dec – Feb',
                      },
                      {
                        label: 'Top Genre',
                        value:
                          selectedRegion.value > 80
                            ? 'Electronic'
                            : selectedRegion.value > 70
                            ? 'Rock'
                            : selectedRegion.value > 60
                            ? 'Pop'
                            : 'Various',
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-gray-50 rounded-2xl p-3 sm:p-4 text-center"
                      >
                        <div className="text-xs text-gray-400 mb-1">{label}</div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  Tap any region to see festival statistics
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 sm:p-6 border border-purple-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              Why Popularity Matters
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Festival popularity influences ticket availability, pricing trends, and overall
              experience. High-popularity regions often have more competitive ticket sales but also
              feature more extensive infrastructure for festival-goers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
