'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Users, Rocket } from 'lucide-react';

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: string;
  description: string;
  features: { name: string; included: boolean }[];
  cta: string;
  highlight: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    icon: <span className="text-4xl">🎫</span>,
    price: 'Free',
    description: 'Perfect for festival explorers',
    features: [
      { name: 'Festival matching quiz', included: true },
      { name: 'Browse 500+ festivals', included: true },
      { name: 'Save up to 5 festivals', included: true },
      { name: 'Share results on social', included: true },
      { name: 'Basic recommendations', included: true },
      { name: 'Unlimited quiz runs', included: false },
      { name: 'Group matching', included: false },
      { name: 'Price tracking', included: false },
      { name: 'Early lineup access', included: false },
      { name: 'Ad-free experience', included: false },
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    icon: <Crown size={32} />,
    price: '$4.99/mo',
    description: 'For serious festival fans',
    features: [
      { name: 'Unlimited quiz runs', included: true },
      { name: 'Save unlimited festivals', included: true },
      { name: 'Group matching (3–10 people)', included: true },
      { name: 'Price tracking alerts', included: true },
      { name: 'Early lineup announcements', included: true },
      { name: 'AI recommendations', included: true },
      { name: 'Ad-free experience', included: true },
      { name: 'Premium festival guides', included: true },
      { name: 'Calendar sync', included: true },
      { name: '24/7 customer support', included: true },
    ],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Festival Pass',
    icon: <Rocket size={32} />,
    price: '$9.99/mo',
    description: 'The ultimate festival pack',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Festival meetup finder', included: true },
      { name: 'Exclusive discount codes (10%–30%)', included: true },
      { name: 'VIP festival perks', included: true },
      { name: 'Travel planning tools', included: true },
      { name: 'Festival friend network', included: true },
      { name: 'Priority support', included: true },
      { name: 'Earn festival rewards points', included: true },
      { name: 'Annual festival pass list', included: true },
      { name: 'Early ticket access', included: true },
    ],
    cta: 'Upgrade Now',
    highlight: false,
  },
];

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 text-center mb-16"
        >
          <h1 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Find your perfect festival at any budget. Start free, upgrade anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center items-center gap-6 bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-full p-2 w-fit mx-auto mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {PRICING_TIERS.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={tier.highlight ? { scale: 1.05 } : undefined}
                onClick={() => setSelectedTier(idx)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all ${
                  tier.highlight
                    ? 'border-2 border-yellow-400 shadow-2xl shadow-yellow-400/50'
                    : 'border border-white/10'
                }`}
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 ${
                    tier.highlight
                      ? 'bg-gradient-to-br from-yellow-500/20 via-pink-500/10 to-purple-500/20'
                      : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'
                  }`}
                />

                {/* Featured Badge */}
                {tier.highlight && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-pink-400 text-black px-6 py-2 rounded-full font-bold text-sm"
                  >
                    ⭐ Most Popular
                  </motion.div>
                )}

                {/* Content */}
                <div className="relative p-8 flex flex-col h-full">
                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div className="mb-4 text-yellow-400">
                      {tier.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-2">{tier.name}</h3>
                    <p className="text-gray-400 text-sm">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                        {tier.price.split('/')[0]}
                      </span>
                      {tier.price.includes('/') && (
                        <span className="text-gray-400">{tier.price.split('/')[1]}</span>
                      )}
                    </div>
                    {billingCycle === 'annual' && tier.price !== 'Free' && (
                      <p className="text-sm text-green-400 font-semibold mt-2">
                        Save $5.98/year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg font-bold mb-8 transition-all ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-500 hover:to-pink-500'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {tier.cta}
                  </motion.button>

                  {/* Features List */}
                  <div className="space-y-3 flex-1">
                    {tier.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        {feature.included ? (
                          <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4"
        >
          <h2 className="text-4xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! Cancel your subscription anytime, no questions asked. Your access continues until the end of your billing period.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 7-day money-back guarantee if you\'re not satisfied with your subscription.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, Google Pay, and Apple Pay.',
              },
              {
                q: 'Is there a student discount?',
                a: 'Yes! Students get 40% off Pro and Festival Pass plans with a valid student email.',
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Absolutely! Change your plan any time, and we\'ll prorate the difference.',
              },
              {
                q: 'Do you offer team/group discounts?',
                a: 'For 5+ group subscriptions, contact sales@festiwise.com for special pricing.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-800/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
              >
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap size={20} className="text-yellow-400" />
                  {faq.q}
                </h4>
                <p className="text-gray-300 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 mt-20"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Ready to Find Your Perfect Festival?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Start with our free quiz today and upgrade anytime as you discover more festivals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all text-lg"
            >
              Take the Quiz for Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
