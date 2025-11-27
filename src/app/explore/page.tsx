'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FestivalCalendar from '@/components/FestivalCalendar';
import PopularityHeatmap from '@/components/PopularityHeatmap';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white -mt-20 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Discover the World's Most Remarkable Festivals
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Explore our interactive tools to find the perfect festival experience
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <Link href="/quiz" className="block w-full sm:w-auto">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Take the Festival Quiz
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Festival Calendar Section */}
      <section id="festival-calendar" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Global Festival Calendar</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                Plan your year with our interactive visualization of festival seasons worldwide
              </p>
            </div>
            
            <FestivalCalendar />
            
            <div className="mt-8 md:mt-12 max-w-3xl mx-auto text-center">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2">Strategic Festival Planning</h3>
                  <p className="text-gray-700 mb-4">
                    Plan your festival experiences strategically throughout the year. Consider attending 
                    festivals during both peak and off-peak seasons for a diverse range of experiences 
                    and pricing options.
                  </p>
                  <Link href="/festivals" className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center">
                    Browse All Festivals
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global Heatmap Section */}
      <section id="global-heatmap" className="py-12 md:py-16 bg-gradient-to-r from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Festival Popularity Map</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                Explore festival hotspots around the world and discover emerging scenes
              </p>
            </div>
            
            <PopularityHeatmap />
            
            <div className="mt-8 md:mt-12 max-w-3xl mx-auto text-center">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2">Expand Your Horizons</h3>
                  <p className="text-gray-700 mb-4">
                    Consider exploring emerging festival scenes where you might find unique, authentic 
                    experiences at better value compared to mainstream destinations.
                  </p>
                  <Link href="/my-recommendations" className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center">
                    Get Personalized Recommendations
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Find Your Perfect Festival?</h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Take our quick quiz and get personalized festival recommendations in minutes.
            </p>
            <div className="flex justify-center">
              <Link href="/quiz" className="block w-full sm:w-auto">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Find My Perfect Festival →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
