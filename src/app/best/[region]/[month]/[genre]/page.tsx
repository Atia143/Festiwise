'use client';

import { notFound } from "next/navigation";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from "@/data/festivals.json";
import Link from "next/link";
import { faqData } from "@/data/faq";
import type { FAQItem } from '@/types/faq';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';


type Params = {
  region: string;
  genre: string;
  month: string;
};

function getRegionName(region: string) {
  const regionMap: Record<string, string> = {
    'worldwide': 'Worldwide',
    'europe': 'Europe',
    'north-america': 'North America',
    'usa': 'USA',
    'asia': 'Asia',
    'south-america': 'South America',
    'africa': 'Africa',
    'oceania': 'Oceania',
    'other': 'Other'
  };
  return regionMap[region] || region.charAt(0).toUpperCase() + region.slice(1);
}

function validateAndNormalizeParams(params: Params) {
  const validRegions = ['worldwide', 'europe', 'north-america', 'usa', 'asia', 'south-america', 'africa', 'oceania', 'other'];
  const normalizedRegion = params.region.toLowerCase();
  
  if (!validRegions.includes(normalizedRegion)) {
    return null;
  }

  return {
    region: normalizedRegion,
    genre: params.genre.toLowerCase(),
    month: params.month.toLowerCase(),
  };
}

export default function BestFestivalsPage({ params }: { params: Promise<Params> }) {
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => {
      setResolvedParams(p);
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading festivals...</p>
        </motion.div>
      </div>
    );
  }

  if (!resolvedParams) {
    return notFound();
  }

  // Validate and normalize parameters
  const normalizedParams = validateAndNormalizeParams(resolvedParams);
  if (!normalizedParams) return notFound();

  const { region, genre, month } = normalizedParams;

  // Festival type definition
  type Festival = {
    id: string;
    name: string;
    country: string;
    city: string;
    months: string[];
    genres: string[];
    estimated_cost_usd: { min: number; max: number };
    audience_size: string;
    duration_days: number;
    family_friendly: boolean;
    camping: boolean;
    glamping?: boolean;
    weather_profile: string[];
    vibe: string[];
    website: string;
    status: string;
    min_age?: number;
    ticket_official_url: string;
  };

  // Helper to map country to region
  function getFestivalRegion(country: string) {
    const europe = [
      "Belgium","France","Germany","UK","Netherlands","Spain","Portugal","Italy","Poland","Czechia","Hungary","Croatia","Serbia","Sweden","Norway","Finland","Denmark","Switzerland","Austria","Ireland"
    ];
    const usa = ["USA", "United States", "United States of America"];
    const asia = ["Japan","China","Israel","South Korea","Thailand","India"];
    
    if (europe.includes(country)) return "europe";
    if (usa.includes(country)) return "usa";
    if (asia.includes(country)) return "asia";
    return "other";
  }

  const filteredFestivals = (data as Festival[]).filter((festival) => {
    const festRegion = getFestivalRegion(festival.country);
    const matchesRegion = festRegion === region || region === 'worldwide';
    const matchesGenre = festival.genres.map(g => g.toLowerCase()).includes(genre);
    const matchesMonth = festival.months.map(m => m.toLowerCase()).includes(month);
    return matchesRegion && matchesGenre && matchesMonth;
  });

  // If no festivals found, return 404
  if (filteredFestivals.length === 0) return notFound();

  // Get relevant FAQs
  const relevantFAQs: FAQItem[] = faqData.filter(faq => {
    const cat = faq.category?.toLowerCase() || '';
    const tags = faq.tags?.map(t => t.toLowerCase()) || [];
    return (
      cat === region || cat === genre || cat === month ||
      tags.includes(region) || tags.includes(genre) || tags.includes(month)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      {/* Hero Section */}
      <motion.section 
        className="relative px-6 py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl animate-bounce-subtle">🏆</span>
              <span className="text-purple-700 font-semibold">Curated Selection</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text-animated">Best {getRegionName(region)}</span>
              <br />
              <span className="text-gray-800">{genre.charAt(0).toUpperCase() + genre.slice(1)} Festivals</span>
              <br />
              <span className="text-purple-600">in {month.charAt(0).toUpperCase() + month.slice(1)}</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the most amazing {genre} festivals happening in {getRegionName(region)} during {month}. 
              Hand-picked for the ultimate experience.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Festivals Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <AnimatePresence>
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
              >
                <Card className="h-full hover-lift overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
                          {festival.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="mr-1">📍</span>
                          {festival.city}, {festival.country}
                        </p>
                      </div>
                      <Badge variant="premium" size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {festival.audience_size}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {festival.genres.slice(0, 3).map(g => (
                        <Badge key={g} variant="default" size="sm" className="bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                          {g}
                        </Badge>
                      ))}
                      {festival.genres.length > 3 && (
                        <Badge variant="default" size="sm" className="bg-gray-100 text-gray-600">
                          +{festival.genres.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500 block">Duration:</span>
                        <div className="font-semibold text-gray-800">{festival.duration_days} day{festival.duration_days !== 1 ? 's' : ''}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Months:</span>
                        <div className="font-semibold text-gray-800">{festival.months.join(', ')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Price Range:</span>
                        <div className="font-semibold text-purple-600">
                          ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Size:</span>
                        <div className="font-semibold text-gray-800 capitalize">
                          {festival.audience_size}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6 text-xs">
                      {festival.family_friendly && (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-lg">👨‍👩‍👧‍👦 Family</span>
                      )}
                      {festival.camping && (
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">⛺ Camping</span>
                      )}
                      {festival.glamping && (
                        <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">✨ Glamping</span>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      
                      <a
                        href={festival.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                          Official Site
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* FAQ Section */}
      {relevantFAQs.length > 0 && (
        <motion.section 
          className="max-w-7xl mx-auto px-6 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about {genre} festivals in {getRegionName(region)}
            </p>
          </div>
          <div className="glass rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="divide-y divide-white/10 space-y-1">
              {relevantFAQs.map((faq) => (
                <div key={faq.id}>
                  <button
                    className="w-full flex items-center justify-between py-4 text-left hover:text-purple-300 transition-colors"
                    onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                    aria-expanded={openFAQ === faq.id}
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFAQ === faq.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFAQ === faq.id && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section 
        className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 py-20 px-6 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Explore More Festivals
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Want to discover more amazing festivals? Browse our complete collection or take our quiz for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/festivals">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🎪 Browse All Festivals
                </Button>
              </Link>
              <Link href="/quiz">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
                >
                  🎯 Take the Quiz
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}