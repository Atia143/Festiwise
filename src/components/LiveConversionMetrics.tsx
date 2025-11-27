'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConversionMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

/**
 * Live conversion metrics footer
 * Shows real-time engagement data to build FOMO
 */
export default function LiveConversionMetrics() {
  const [metrics, setMetrics] = useState<ConversionMetric[]>([
    {
      label: 'Matches Made',
      value: '2,847',
      trend: 'up',
      icon: '✨'
    },
    {
      label: 'Happy Users',
      value: '98%',
      trend: 'stable',
      icon: '😊'
    },
    {
      label: 'Avg Quiz Time',
      value: '2m 15s',
      trend: 'down',
      icon: '⚡'
    },
    {
      label: 'Quiz Completion',
      value: '87%',
      trend: 'up',
      icon: '🎯'
    }
  ]);

  useEffect(() => {
    // Simulate metric updates every 10 seconds
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => {
          if (metric.trend === 'up' && typeof metric.value === 'string') {
            const num = parseInt(metric.value);
            if (!isNaN(num)) {
              return {
                ...metric,
                value: Math.min(num + Math.floor(Math.random() * 50), 9999)
              };
            }
          }
          return metric;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl mb-1">{metric.icon}</div>
              <div className="text-sm text-white/70">{metric.label}</div>
              <motion.div
                key={metric.value}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="font-bold text-lg md:text-xl text-white"
              >
                {metric.value}
              </motion.div>
              <div className="text-xs text-white/60 mt-1">
                {metric.trend === 'up' && '↗ Increasing'}
                {metric.trend === 'down' && '↘ Decreasing'}
                {metric.trend === 'stable' && '→ Stable'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
