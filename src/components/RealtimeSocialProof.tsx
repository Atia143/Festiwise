'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '100+', label: 'Festivals curated', sub: 'Across 30+ countries' },
  { value: '2 min', label: 'Average quiz time', sub: 'From start to results' },
  { value: 'Free', label: 'Always free', sub: 'No account required' },
];

export default function RealtimeSocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-4 py-5 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-0.5">{stat.value}</div>
            <div className="text-xs font-semibold text-gray-800">{stat.label}</div>
            <div className="text-xs text-gray-400 mt-0.5 hidden sm:block">{stat.sub}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/60 flex items-center justify-center gap-6 flex-wrap text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          No spam — ever
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          We don&apos;t sell your data
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          Direct links to official sources
        </span>
      </div>
    </motion.div>
  );
}
