'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import OptimizedImg from './OptimizedImg';

const howItWorks = {
  title: "How It Works",
  subtitle: "Find your perfect festival match in 3 simple steps",
  steps: [
    {
      number: 1,
      title: "Tell us your vibe",
      description: "Share your music taste, budget, and travel preferences in our 2-minute quiz",
      gradient: "from-purple-400 to-blue-400",
    },
    {
      number: 2,
      title: "Get ranked matches", 
      description: "We match by genre affinity, budget range, and travel-time tolerance to find your perfect festivals",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      number: 3,
      title: "Book with confidence",
      description: "We only link to official ticket pages. No extra fees. Get direct access plus travel tips for your festival",
      gradient: "from-green-400 to-purple-400",
    }
  ]
};

const festivals = [
  {
    name: "Tomorrowland",
    location: "Boom, Belgium",
    date: "July 2025",
    genres: ["EDM", "House", "Techno"],
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Glastonbury",
    location: "Somerset, UK",
    date: "June 2025",
    genres: ["Rock", "Alternative", "Pop"],
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Coachella",
    location: "California, USA",
    date: "April 2025",
    genres: ["Pop", "Rock", "Hip-Hop", "Electronic"],
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Ultra Music Festival",
    location: "Miami, USA",
    date: "March 2025",
    genres: ["EDM", "House", "Dubstep"],
    image: "https://images.unsplash.com/photo-1486556396467-d83d2b23514b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Burning Man",
    location: "Nevada, USA",
    date: "Aug–Sep 2025",
    genres: ["Electronic", "Experimental", "Art"],
    image: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  },
  {
    name: "Primavera Sound",
    location: "Barcelona, Spain",
    date: "June 2025",
    genres: ["Indie", "Alternative", "Electronic"],
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
  },
];

export default function FestivalShowcaseSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{howItWorks.title}</h2>
            <p className="text-xl text-gray-600">{howItWorks.subtitle}</p>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-12 md:gap-8">
            {howItWorks.steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-1 flex flex-col items-center"
              >
                <span
                  className={`
                    mb-6 w-16 h-16 flex items-center justify-center text-2xl font-bold text-white
                    bg-gradient-to-br ${step.gradient} rounded-full shadow-xl 
                  `}
                >
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-base">{step.description}</p>
              </motion.div>
            ))}
          </div>
          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Link href="/quiz">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-full shadow-lg text-lg transition-all duration-300">
                Find My Festival (2 min)
              </button>
            </Link>
            <Link href="/festivals">
              <button className="px-8 py-3 bg-gradient-to-r from-white to-white text-purple-600 font-bold rounded-full shadow-none text-lg underline underline-offset-2 hover:text-purple-800 transition-all duration-300">
                Browse All Festivals &rarr;
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Festival Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Festivals</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover some of the world's most iconic music festivals spanning various genres and locations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {festivals.map((festival, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow border border-gray-100"
            >
              <div className="h-52 sm:h-60 overflow-hidden relative">
                <OptimizedImg
                  src={festival.image}
                  alt={festival.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 text-white">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="font-semibold bg-gradient-to-r from-purple-600 to-blue-500 rounded px-2 py-1 text-xs sm:text-sm shadow"
                  >
                    {festival.date}
                  </motion.p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-purple-900 group-hover:text-blue-600 transition-colors">{festival.name}</h3>
                <p className="text-gray-600 mb-2">{festival.location}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {festival.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold rounded-full shadow-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/festivals">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-full shadow-xl transform transition-transform hover:scale-105 text-lg tracking-wide">
              View All Festivals
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}