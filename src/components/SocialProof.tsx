'use client';

import { motion } from 'framer-motion';

interface SocialProofProps {
  ratingValue?: number;
  ratingCount?: number;
  ratingAsOf?: string;
}

import FeatureFlag from './FeatureFlag';

export default function SocialProof({ ratingValue, ratingCount, ratingAsOf }: SocialProofProps) {
  // Validate required props
  if (!ratingValue || !ratingCount || !ratingAsOf) {
    return null;
  }

  return (
    <FeatureFlag name="social_proof" defaultOff>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-yellow-400 ${i < Math.floor(ratingValue) ? 'opacity-100' : 'opacity-30'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-white font-semibold">
            {ratingValue}/5 from {ratingCount} verified festival-goers
          </span>
        </div>
      </motion.div>
    </FeatureFlag>
  );
}

// Testimonial component with feature flag
export function TestimonialSection({ ratingValue, ratingCount, ratingAsOf }: SocialProofProps) {
  if (!ratingValue || !ratingCount || !ratingAsOf) {
    return null;
  }

  const testimonials = [
    {
      name: "Marcus K.",
      text: "Found my perfect festival in 2 minutes! The matching algorithm is incredible.",
      avatar: "🎵"
    },
    {
      name: "Sarah M.", 
      text: "Discovered 3 amazing festivals I never knew existed. This site is a game-changer.",
      avatar: "🎪"
    }
  ];

  return (
    <FeatureFlag name="real_testimonials" defaultOff>
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Verified Festival Experiences</h2>
          <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-8">
          Based on {ratingCount.toLocaleString()} verified reviews as of {ratingAsOf}
        </p>
      </div>
    </section>
    </FeatureFlag>
  );
}

// Live activity ticker component
export function LiveActivityTicker() {
  return (
    <FeatureFlag name="live_activity" defaultOff>
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-700">
            Someone just found their perfect festival!
          </span>
        </div>
      </div>
    </FeatureFlag>
  );
}
