'use client';

import { motion } from 'framer-motion';
import { Festival } from '@/utils/match';

interface ResultCardProps {
  festival: Festival;
  normalizedScore: number;
  compatibility: number;
  reasons: string[];
  matchDetails: {
    genreMatch: number;
    budgetMatch: number;
    dateMatch: number;
    locationMatch: number;
    vibeMatch: number;
    amenitiesMatch: number;
  };
}

export function ResultCard({ festival, normalizedScore, compatibility, reasons, matchDetails }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold">{festival.name}</h3>
          <p className="text-white/90">
            {festival.city}, {festival.country}
          </p>
        </div>
      </div>

      {/* Match Scores */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500">Match Score</div>
            <div className="text-2xl font-bold text-gray-900">{normalizedScore}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Compatibility</div>
            <div className="text-2xl font-bold text-gray-900">{compatibility}%</div>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-3 mb-6">
          {Object.entries(matchDetails).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className="w-24 text-sm text-gray-500">
                {key.replace('Match', '').charAt(0).toUpperCase() + key.replace('Match', '').slice(1)}
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-12 text-right text-sm text-gray-500">
                {Math.round(value * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* Match Reasons */}
        <div className="space-y-2">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 flex items-start gap-2"
            >
              <svg
                className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <a
            href={festival.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            Visit Website
          </a>
          <button
            className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            onClick={() => {
              // TODO: Implement save/share functionality
            }}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
