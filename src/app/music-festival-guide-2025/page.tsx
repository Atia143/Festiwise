import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ultimate Music Festival Guide 2025 - Expert Tips & Complete Planning Guide',
  description: 'Complete music festival guide 2025! Expert tips on tickets, packing, safety, budgeting & more. Your ultimate resource for festival success.',
  keywords: 'music festival guide 2025, festival planning guide, how to prepare for music festival, festival tips, music festival advice',
  openGraph: {
    title: 'Ultimate Music Festival Guide 2025 - Expert Tips & Planning',
    description: 'Everything you need to know for an epic festival experience',
    url: 'https://getfestiwise.com/music-festival-guide-2025',
  },
};

const guideCategories = [
  {
    icon: '🎫',
    title: 'Tickets & Planning',
    topics: ['When to buy tickets', 'Payment plans', 'Resale tips', 'Group bookings', 'VIP vs GA']
  },
  {
    icon: '🎒',
    title: 'Packing Essentials',
    topics: ['What to pack', 'Camping gear', 'Weather prep', 'Security tips', 'Prohibited items']
  },
  {
    icon: '💰',
    title: 'Budget Planning',
    topics: ['Hidden costs', 'Food budgets', 'Travel savings', 'Accommodation tips', 'Money management']
  },
  {
    icon: '🛡️',
    title: 'Safety & Health',
    topics: ['Staying safe', 'Health prep', 'Emergency plans', 'Weather safety', 'Crowd navigation']
  },
  {
    icon: '🏕️',
    title: 'Accommodation',
    topics: ['Camping tips', 'Hotel booking', 'Glamping options', 'Nearby stays', 'Last-minute options']
  },
  {
    icon: '🎵',
    title: 'Festival Experience',
    topics: ['Set planning', 'Meeting artists', 'Photo tips', 'Making friends', 'Recovery tips']
  }
];

const expertTips = [
  {
    category: 'First-Timer',
    tips: [
      'Start with smaller, single-day festivals to test your stamina',
      'Arrive early to get familiar with the layout and facilities',
      'Make a loose schedule but stay flexible for discoveries',
      'Bring cash - many vendors don\'t accept cards'
    ]
  },
  {
    category: 'Veteran',
    tips: [
      'Scout lesser-known artists on smaller stages for hidden gems',
      'Book accommodation 6+ months early for popular festivals',
      'Create backup plans for bad weather or lineup changes',
      'Consider volunteering for free tickets and backstage access'
    ]
  },
  {
    category: 'Budget-Conscious',
    tips: [
      'Look for festivals with free camping included in ticket price',
      'Buy early bird tickets for 30-50% savings',
      'Bring your own food and water (where allowed)',
      'Share accommodation costs by going with friends'
    ]
  }
];

const festivalTypes = [
  {
    type: 'Multi-Day Camping Festivals',
    examples: ['Coachella', 'Glastonbury', 'Bonnaroo'],
    bestFor: 'Full immersion experience',
    budgetRange: '$300-1500',
    tips: 'Pack like you\'re going on a 4-day camping trip'
  },
  {
    type: 'City Music Festivals',
    examples: ['Lollapalooza', 'Outside Lands', 'ACL'],
    bestFor: 'Urban convenience with festival fun',
    budgetRange: '$200-800',
    tips: 'Book hotels early, use public transport'
  },
  {
    type: 'Electronic Music Festivals',
    examples: ['Tomorrowland', 'EDC', 'Ultra'],
    bestFor: 'Dance music lovers and party atmosphere',
    budgetRange: '$250-1200',
    tips: 'Prepare for late nights and high energy'
  },
  {
    type: 'Boutique Festivals',
    examples: ['Lightning in a Bottle', 'Shambhala'],
    bestFor: 'Intimate experiences and art focus',
    budgetRange: '$150-600',
    tips: 'Focus on the full experience, not just music'
  }
];

export default function MusicFestivalGuide2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
            Ultimate Music Festival Guide 2025
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto text-center leading-relaxed">
            Everything you need to know for an epic festival experience! From first-timer tips to veteran secrets, 
            we\'ve got your complete festival planning covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              🎯 Find Your Perfect Festival →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            📚 Complete Festival Planning Guide
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="text-gray-600 text-sm flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Types Guide */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎪 Types of Music Festivals
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Understanding different festival types helps you choose the perfect experience for your style and budget.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {festivalTypes.map((festival, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">{festival.type}</h3>
                <div className="space-y-3 mb-6">
                  <p><span className="font-semibold text-purple-600">Examples:</span> {festival.examples.join(', ')}</p>
                  <p><span className="font-semibold text-blue-600">Best For:</span> {festival.bestFor}</p>
                  <p><span className="font-semibold text-green-600">Budget Range:</span> {festival.budgetRange}</p>
                  <p><span className="font-semibold text-orange-600">Pro Tip:</span> {festival.tips}</p>
                </div>
                <Link href="/quiz" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Find This Type →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Tips by Experience Level */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            💡 Expert Tips by Experience Level
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {expertTips.map((tipCategory, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-purple-600 mb-6">{tipCategory.category}</h3>
                <ul className="space-y-4">
                  {tipCategory.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-gray-700">
                      <span className="text-purple-500 mr-3 mt-1">🎯</span>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Essential Planning Timeline */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            📅 Festival Planning Timeline
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">6M</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">6 Months Before</h3>
                <p className="text-gray-600">Research festivals, join mailing lists for presale codes, start saving money</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3M</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">3 Months Before</h3>
                <p className="text-gray-600">Buy tickets, book accommodation, plan travel, request time off work</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1M</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1 Month Before</h3>
                <p className="text-gray-600">Create packing list, check weather forecast, download festival app</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1W</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1 Week Before</h3>
                <p className="text-gray-600">Pack everything, charge all devices, print tickets, prepare emergency contacts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Plan Your Festival Adventure?</h2>
          <p className="text-xl text-white/90 mb-8">
            Use our smart quiz to find festivals that match your style, budget, and preferences. Get personalized recommendations in 2 minutes!
          </p>
          <Link href="/quiz" className="bg-white text-blue-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find My Perfect Festival 🎪
          </Link>
        </div>
      </section>
    </div>
  );
}
