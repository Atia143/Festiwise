'use client';

import { notFound } from "next/navigation";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import data from "@/data/festivals.json";
import Link from "next/link";
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';

type Params = {
  region: string;
};

interface PageProps {
  params: Promise<Params>;
}

function getRegionName(region: string) {
  const regionMap: Record<string, string> = {
    'worldwide': 'Worldwide',
    'europe': 'Europe',
    'north-america': 'North America',
    'usa': 'USA',
    'asia': 'Asia',
    'africa': 'Africa',
    'oceania': 'Oceania',
    'south-america': 'South America'
  };
  return regionMap[region] || region;
}

function getRegionForCountry(country: string): string {
  const europe = ["Netherlands", "Germany", "Belgium", "France", "UK", "Spain", "Portugal", "Italy", "Austria", "Switzerland", "Croatia", "Czech Republic", "Hungary", "Romania", "Poland", "Serbia", "Slovenia", "Denmark", "Sweden", "Norway", "Finland", "Latvia", "Estonia", "Lithuania"];
  const asia = ["Japan", "China", "Israel", "India", "South Korea", "Thailand", "Singapore"];
  const usa = ["USA", "United States", "United States of America"];
  const northAmerica = ["Canada", "Mexico"];
  const southAmerica = ["Brazil", "Argentina", "Chile", "Colombia", "Peru"];
  const africa = ["South Africa", "Morocco", "Egypt"];
  const oceania = ["Australia", "New Zealand"];

  if (europe.includes(country)) return "europe";
  if (usa.includes(country)) return "usa";
  if (asia.includes(country)) return "asia";
  if (northAmerica.includes(country)) return "north-america";
  if (southAmerica.includes(country)) return "south-america";
  if (africa.includes(country)) return "africa";
  if (oceania.includes(country)) return "oceania";
  return "worldwide";
}

export default function RegionPage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(setResolvedParams).finally(() => setLoading(false));
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading festivals...</p>
        </div>
      </div>
    );
  }

  if (!resolvedParams) {
    notFound();
  }

  const { region } = resolvedParams;
  
  // Validate region
  const validRegions = ['worldwide', 'europe', 'north-america', 'usa', 'asia', 'africa', 'oceania', 'south-america'];
  
  if (!validRegions.includes(region.toLowerCase())) {
    notFound();
  }

  const regionName = getRegionName(region);

  // Filter festivals by region
  const filteredFestivals = data.filter(festival => {
    const festivalRegion = getRegionForCountry(festival.country);
    return region === 'worldwide' || festivalRegion === region;
  });

  // Get unique months from filtered festivals
  const months = Array.from(new Set(
    filteredFestivals.flatMap(festival => festival.months)
  )).sort((a, b) => {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Festivals in {regionName}
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Discover the best music festivals across {regionName}
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>→</span>
            <Link href="/festivals" className="hover:text-purple-600 transition-colors">Festivals</Link>
            <span>→</span>
            <span className="text-purple-600 font-medium">{regionName}</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">{filteredFestivals.length}</div>
              <div className="text-gray-600">Total Festivals</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{months.length}</div>
              <div className="text-gray-600">Active Months</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{new Set(filteredFestivals.map(f => f.country)).size}</div>
              <div className="text-gray-600">Countries</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Month Links */}
        {months.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse by Month
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {months.map((month) => {
                const monthFestivals = filteredFestivals.filter(f => f.months.includes(month));
                return (
                  <Link
                    key={month}
                    href={`/best/${region}/${month.toLowerCase()}`}
                    className="group"
                  >
                    <Card className="h-full bg-white hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-gray-200 hover:border-purple-300">
                      <CardContent className="p-6 text-center">
                        <div className="text-2xl mb-3">📅</div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {month}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {monthFestivals.length} festivals
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <SimpleNewsletterForm />
        </motion.div>

        {/* Popular Festivals */}
        {filteredFestivals.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Festivals in {regionName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFestivals.slice(0, 6).map((festival, index) => (
                <motion.div
                  key={festival.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                >
                  <Card className="h-full bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 border-gray-200 hover:border-purple-300">
                    <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-t-lg">
                      <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                          {festival.audience_size}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{festival.name}</h3>
                        <p className="text-white/90">{festival.city}, {festival.country}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {festival.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="default" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>📅 {festival.months.join(', ')}</div>
                          <div>⏱️ {festival.duration_days} days</div>
                          <div>💰 ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}</div>
                        </div>
                        <Link href={`/festival/${festival.id}`}>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/festivals">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  View All Festivals
                </Button>
              </Link>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
