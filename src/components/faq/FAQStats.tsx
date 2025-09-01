import React from 'react';

interface FAQStatsProps {
  lastUpdated: Date;
  helpfulCount: number;
}

const FAQStats: React.FC<FAQStatsProps> = ({ lastUpdated, helpfulCount }) => {
  return (
    <div className="mt-4 text-sm text-gray-500 flex items-center gap-4">
      <span>Last updated: {lastUpdated.toLocaleDateString()}</span>
      <span>•</span>
      <span>{helpfulCount} people found this helpful</span>
    </div>
  );
};

export default FAQStats;
