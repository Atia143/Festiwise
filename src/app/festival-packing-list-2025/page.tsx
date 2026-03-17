import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Festival Packing List 2026 - Complete Checklist for Music Festivals',
  description: 'Ultimate festival packing list 2026! Complete checklist for camping festivals, day events & international travel. Never forget essentials again.',
  keywords: 'festival packing list 2026, music festival checklist, camping festival packing, festival essentials, what to pack for festivals 2026',
  alternates: {
    canonical: 'https://getfestiwise.com/festival-packing-list-2025'
  },
  openGraph: {
    title: 'Festival Packing List 2026 - Complete Checklist',
    description: 'Never forget festival essentials again with our complete 2026 packing guide',
    url: 'https://getfestiwise.com/festival-packing-list-2025',
    type: 'website',
    images: [
      {
        url: 'https://getfestiwise.com/api/og/best?slug=camping&label=Packing+Guide&count=50',
        width: 1200,
        height: 630,
        alt: 'Festival Packing List 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festival Packing List 2026 - Complete Checklist',
    description: 'Never forget festival essentials again with our complete 2026 packing guide'
  },
  other: {
    'article:author': 'FestiWise Team',
    'article:section': 'Festival Guides',
    'og:type': 'article'
  }
};

const packingCategories = [
  {
    category: 'Essentials (Must-Have)',
    icon: '🎯',
    items: [
      'Festival ticket & ID',
      'Cash & cards',
      'Phone & portable charger',
      'Sunscreen (SPF 30+)',
      'Water bottle',
      'Comfortable shoes',
      'Weather-appropriate clothing',
      'Hand sanitizer'
    ]
  },
  {
    category: 'Camping Gear',
    icon: '🏕️',
    items: [
      'Tent (waterproof)',
      'Sleeping bag & pillow',
      'Camping chair',
      'Flashlight/headlamp',
      'Cooler with ice',
      'Camping stove & fuel',
      'Trash bags',
      'Wet wipes'
    ]
  },
  {
    category: 'Comfort & Safety',
    icon: '🛡️',
    items: [
      'First aid kit',
      'Earplugs',
      'Bandana/face covering',
      'Cooling towel',
      'Electrolyte packets',
      'Personal medications',
      'Emergency contact info',
      'Whistle'
    ]
  },
  {
    category: 'Fun & Social',
    icon: '🎉',
    items: [
      'Bluetooth speaker (small)',
      'Glow sticks/LED accessories',
      'Games/cards',
      'Camera/GoPro',
      'Festival flag/totem',
      'Markers for autographs',
      'Trading items',
      'Costume/theme outfit'
    ]
  }
];

const packingByFestivalType = [
  {
    type: 'Multi-Day Camping Festival',
    duration: '3-5 days',
    examples: 'Coachella, Bonnaroo, Glastonbury',
    specialItems: [
      'Extra clothes for each day',
      'Laundry bag',
      'Baby wipes for quick cleaning',
      'Dry shampoo',
      'Non-perishable food',
      'Camping shower supplies'
    ]
  },
  {
    type: 'Single Day City Festival',
    duration: '8-12 hours',
    examples: 'Lollapalooza, Outside Lands',
    specialItems: [
      'Small backpack/fanny pack',
      'Light jacket for evening',
      'Snacks & water',
      'Comfortable walking shoes',
      'Metro card/transport pass'
    ]
  },
  {
    type: 'Electronic Music Festival',
    duration: '1-3 days',
    examples: 'EDC, Ultra, Tomorrowland',
    specialItems: [
      'Earplugs (high-quality)',
      'LED accessories/lights',
      'Comfortable dancing shoes',
      'Energy supplements',
      'Kandi for trading',
      'Recovery drinks'
    ]
  },
  {
    type: 'International Festival',
    duration: '3-7 days',
    examples: 'Tomorrowland, Primavera Sound',
    specialItems: [
      'Passport & travel docs',
      'Universal power adapter',
      'Travel insurance info',
      'Currency exchange',
      'Translation app',
      'Emergency embassy contacts'
    ]
  }
];

const weatherPacking = [
  {
    weather: 'Hot & Sunny',
    icon: '☀️',
    essentials: [
      'High SPF sunscreen',
      'Wide-brim hat',
      'Sunglasses',
      'Light, breathable clothing',
      'Cooling towel',
      'Extra water',
      'Electrolyte drinks',
      'Shade tent/umbrella'
    ]
  },
  {
    weather: 'Rainy',
    icon: '🌧️',
    essentials: [
      'Waterproof jacket',
      'Rain boots/waterproof shoes',
      'Waterproof phone case',
      'Poncho or rain cape',
      'Quick-dry clothing',
      'Plastic bags for gear',
      'Tarp for tent',
      'Extra socks'
    ]
  },
  {
    weather: 'Cold',
    icon: '🥶',
    essentials: [
      'Layered clothing',
      'Warm jacket/coat',
      'Gloves & hat',
      'Thermal underwear',
      'Warm sleeping bag',
      'Hand/foot warmers',
      'Hot drinks/thermos',
      'Waterproof boots'
    ]
  }
];

const packingTips = [
  {
    title: 'Space-Saving Hacks',
    tips: [
      'Roll clothes instead of folding',
      'Use packing cubes or compression bags',
      'Wear heaviest items while traveling',
      'Stuff socks and underwear in shoes',
      'Bring multi-purpose items'
    ]
  },
  {
    title: 'Security Tips',
    tips: [
      'Split cash between multiple locations',
      'Use a money belt or hidden pocket',
      'Take photos of important documents',
      'Label your gear with contact info',
      'Keep backup charger in car/hotel'
    ]
  },
  {
    title: 'Pro Tips',
    tips: [
      'Bring a wagon for easy transport',
      'Pack a "day 1" outfit on top',
      'Freeze water bottles as ice packs',
      'Bring duct tape for emergency repairs',
      'Pack a separate "survival" bag'
    ]
  }
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What should I pack for a music festival in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Festival essentials include your ticket and ID, cash and cards, phone and portable charger, sunscreen (SPF 30+), a refillable water bottle, comfortable shoes, weather-appropriate clothing, and hand sanitizer. For camping festivals also bring a tent, sleeping bag, and headlamp.' } },
    { '@type': 'Question', name: 'What camping gear do I need for a multi-day festival?', acceptedAnswer: { '@type': 'Answer', text: 'For camping festivals bring a waterproof tent, sleeping bag, camping chair, headlamp, cooler with ice, wet wipes, camping stove with fuel, and trash bags. Pack dry shampoo and a laundry bag for 3+ day events like Glastonbury or Bonnaroo.' } },
    { '@type': 'Question', name: 'What should I pack if it rains at a festival?', acceptedAnswer: { '@type': 'Answer', text: 'For rainy festivals pack a waterproof jacket, rain boots, poncho, waterproof phone case, quick-dry clothing, plastic bags to protect electronics and sleeping gear, a tarp for your tent, and at least two extra pairs of dry socks.' } },
    { '@type': 'Question', name: 'How do I pack light for a music festival?', acceptedAnswer: { '@type': 'Answer', text: 'Roll clothes instead of folding to save 30% space, use packing cubes or compression bags, wear your heaviest items on travel day, stuff socks inside shoes, and choose multi-purpose items. Freeze water bottles the night before so they double as ice packs.' } },
    { '@type': 'Question', name: 'What should I pack for an electronic music festival?', acceptedAnswer: { '@type': 'Answer', text: 'For EDM festivals like Tomorrowland, Ultra or EDC, prioritise high-quality earplugs, LED accessories, comfortable dancing shoes, electrolyte packets, recovery drinks, and a cooling towel. Extra phone battery packs are essential for all-night events.' } },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Festival Packing List 2026 — Complete Checklist for Music Festivals',
  description: 'Ultimate festival packing list 2026. Complete checklist for camping festivals, day events and international travel. Never forget essentials again.',
  author: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  publisher: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  datePublished: '2025-09-01',
  dateModified: '2026-03-17',
  url: 'https://getfestiwise.com/festival-packing-list-2025',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getfestiwise.com/festival-packing-list-2025' },
};

export default function FestivalPackingList2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-purple-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
            Festival Packing List 2026
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto text-center leading-relaxed">
            The ultimate festival packing checklist! Never forget essentials again with our comprehensive guide 
            for camping festivals, day events, and international adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              🎯 Find Festivals to Pack For →
            </Link>
          </div>
        </div>
      </section>

      {/* Essential Packing Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎒 Essential Packing Categories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Everything you need organized by priority - from absolute must-haves to fun extras.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {packingCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packing by Festival Type */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎪 Packing by Festival Type
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Different festivals need different gear - customize your packing list for the perfect experience.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {packingByFestivalType.map((festival, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">{festival.type}</h3>
                <div className="mb-6">
                  <p className="text-gray-600 mb-2"><span className="font-semibold">Duration:</span> {festival.duration}</p>
                  <p className="text-gray-600 mb-4"><span className="font-semibold">Examples:</span> {festival.examples}</p>
                </div>
                <h4 className="font-bold text-purple-600 mb-3">Special Items Needed:</h4>
                <ul className="space-y-2">
                  {festival.specialItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700 text-sm">
                      <span className="text-blue-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather-Based Packing */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            🌤️ Weather-Based Packing Guide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {weatherPacking.map((weather, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <span className="text-6xl">{weather.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">{weather.weather}</h3>
                </div>
                <ul className="space-y-3">
                  {weather.essentials.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700 text-sm">
                      <span className="text-green-500 mr-3">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Packing Tips */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            💡 Pro Packing Tips
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packingTips.map((tipCategory, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-2xl font-bold text-green-600 mb-6">{tipCategory.title}</h3>
                <ul className="space-y-4">
                  {tipCategory.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-3 mt-1">💡</span>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Printable Checklist CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-12 text-center border border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">📋 Get Your Printable Checklist</h2>
          <p className="text-xl text-gray-700 mb-8">
            Want a customized packing list for your specific festival type? Take our quiz to get a personalized checklist!
          </p>
          <Link href="/quiz" className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg inline-block">
            Get My Custom Packing List 🎒
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Pack for Your Festival Adventure?</h2>
          <p className="text-xl text-white/90 mb-8">
            Find festivals that match your style and get personalized packing recommendations based on your chosen events!
          </p>
          <Link href="/quiz" className="bg-white text-green-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find My Perfect Festival 🎪
          </Link>
        </div>
      </section>
    </div>
  );
}
