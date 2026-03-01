'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RealtimeSocialProof() {
  useEffect(() => {
    // Initialize empty - we're moving away from fake activity ticker
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      {/* Credible Social Proof Stats */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Real People, Real Festival Matches</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">1,000+</div>
            <div className="text-xs text-gray-600 mt-1">Matches Made This Month</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">9/10</div>
            <div className="text-xs text-gray-600 mt-1">Find Their Perfect Festival</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">100+</div>
            <div className="text-xs text-gray-600 mt-1">Verified Festivals in Network</div>
          </div>
        </div>
      </div>

      {/* Trust Messaging */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-center text-sm text-gray-700">
          ✓ <strong>No Spam.</strong> We don't sell your data. 
          ✓ <strong>No Affiliation.</strong> Direct links to official pages. 
          ✓ <strong>100% Free.</strong> Always.
        </p>
      </div>
    </motion.div>
  );
}
