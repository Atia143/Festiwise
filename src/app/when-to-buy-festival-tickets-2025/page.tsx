import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'When to Buy Festival Tickets 2026 - Best Times & Money-Saving Tips',
  description: 'Learn when to buy festival tickets in 2026! Get insider tips on presales, pricing patterns, and how to save up to 50% on music festival tickets.',
  keywords: 'when to buy festival tickets 2026, festival ticket prices, presale tickets 2026, early bird tickets, festival ticket tips',
  alternates: {
    canonical: 'https://getfestiwise.com/when-to-buy-festival-tickets-2025',
  },
  openGraph: {
    title: 'When to Buy Festival Tickets 2026 - Save Money on Music Festivals',
    description: 'Insider guide to buying festival tickets at the best prices in 2026',
    url: 'https://getfestiwise.com/when-to-buy-festival-tickets-2025',
    type: 'website',
    images: [{ url: 'https://getfestiwise.com/api/og/best?slug=budget&label=Ticket+Guide&count=100', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'When to Buy Festival Tickets 2026 - Save Money on Music Festivals',
    description: 'Insider guide to buying festival tickets at the best prices in 2026',
  },
};

const ticketTimeline = [
  {
    phase: 'Presale/Early Bird',
    timing: '6-12 months before',
    savings: '30-50% off',
    pros: ['Lowest prices', 'Guaranteed entry', 'Payment plans available', 'Best camping spots'],
    cons: ['No lineup announced', 'Non-refundable usually', 'Limited flexibility'],
    bestFor: 'Festival veterans, budget-conscious fans'
  },
  {
    phase: 'General Sale',
    timing: '3-6 months before',
    savings: '15-25% off peak',
    pros: ['Full lineup revealed', 'More payment options', 'Better informed decision'],
    cons: ['Higher prices', 'Risk of selling out', 'Limited camping'],
    bestFor: 'First-time attendees, lineup-dependent fans'
  },
  {
    phase: 'Last Minute',
    timing: '1-4 weeks before',
    savings: '10-30% off (risky)',
    pros: ['Potential deals', 'Weather clarity', 'Final lineup additions'],
    cons: ['May sell out', 'Higher stress', 'Limited accommodations'],
    bestFor: 'Flexible schedules, local attendees'
  },
  {
    phase: 'Day Of/Gate',
    timing: 'Festival day',
    savings: 'Premium pricing',
    pros: ['Guaranteed weather', 'Last-minute decision'],
    cons: ['Highest prices', 'May be sold out', 'No advance planning'],
    bestFor: 'Spontaneous locals only'
  }
];

const festivalCategories = [
  {
    category: 'Major Pop/Rock Festivals',
    examples: 'Coachella, Lollapalooza, Bonnaroo',
    bestBuyTime: '6-8 months before',
    tipIcon: '🎤',
    tips: [
      'Presale usually in December-January',
      'Sell out within hours for popular ones',
      'Payment plans available for expensive tickets',
      'VIP tickets hold value better'
    ],
    pricingPattern: 'Steep early bird discounts, then consistent pricing until sold out'
  },
  {
    category: 'Electronic/EDM Festivals',
    examples: 'Ultra, EDC, Tomorrowland',
    bestBuyTime: '4-6 months before',
    tipIcon: '🎧',
    tips: [
      'Global registration systems common',
      'Loyalty programs offer early access',
      'International festivals require visa planning',
      'Group discounts often available'
    ],
    pricingPattern: 'Tier-based pricing with clear price increases'
  },
  {
    category: 'Indie/Alternative Festivals',
    examples: 'Pitchfork, FYF, Primavera',
    bestBuyTime: '3-4 months before',
    tipIcon: '🎸',
    tips: [
      'Less likely to sell out quickly',
      'Lineup announcements drive sales',
      'Local presales common',
      'Single-day tickets available'
    ],
    pricingPattern: 'Moderate early bird savings, stable pricing'
  },
  {
    category: 'Genre-Specific Festivals',
    examples: 'Country, Jazz, Folk festivals',
    bestBuyTime: '2-4 months before',
    tipIcon: '🎺',
    tips: [
      'Dedicated fan base creates steady demand',
      'Season pass options available',
      'Local community discounts',
      'Weather-dependent pricing'
    ],
    pricingPattern: 'Consistent pricing with small early bird discounts'
  }
];

const moneyTips = [
  {
    title: 'Presale Strategies',
    icon: '⏰',
    tips: [
      'Sign up for artist newsletters for exclusive presales',
      'Follow festivals on social media for flash sales',
      'Join loyalty programs and mailing lists',
      'Set calendar reminders for presale dates',
      'Have payment info ready beforehand'
    ]
  },
  {
    title: 'Budget-Friendly Options',
    icon: '💰',
    tips: [
      'Look for volunteer opportunities (free entry)',
      'Consider single-day passes vs. full weekend',
      'Skip VIP unless camping is included',
      'Buy group tickets for discounts',
      'Check for student/military discounts'
    ]
  },
  {
    title: 'Secondary Market Tips',
    icon: '🔄',
    tips: [
      'Use official resale platforms when possible',
      'Prices often drop day-of on StubHub',
      'Verify tickets through official channels',
      'Meet in person for local exchanges',
      'Avoid deals that seem too good to be true'
    ]
  },
  {
    title: 'Risk Management',
    icon: '🛡️',
    tips: [
      'Buy insurance for expensive international festivals',
      'Read refund policies carefully',
      'Keep receipts and confirmation emails',
      'Use credit cards for purchase protection',
      'Check festival\'s COVID policies'
    ]
  }
];

const monthlyGuide = [
  {
    month: 'January',
    action: 'Presale Season',
    festivals: 'Coachella, Ultra, many summer festivals',
    savings: 'Maximum (30-50% off)',
    tips: 'Set up price alerts, join mailing lists'
  },
  {
    month: 'February',
    action: 'Early Bird Continues',
    festivals: 'Bonnaroo, Electric Forest, European festivals',
    savings: 'High (25-40% off)',
    tips: 'Lineup announcements start rolling out'
  },
  {
    month: 'March',
    action: 'General Sales Begin',
    festivals: 'Spring festivals, early summer events',
    savings: 'Moderate (15-30% off)',
    tips: 'Full lineups revealed, payment plans available'
  },
  {
    month: 'April-May',
    action: 'Regular Pricing',
    festivals: 'Most summer festivals',
    savings: 'Limited (10-20% off)',
    tips: 'Last chance for reasonable prices'
  },
  {
    month: 'June-August',
    action: 'Peak Season',
    festivals: 'Summer festival season',
    savings: 'Minimal (0-15% off)',
    tips: 'Focus on smaller, local festivals'
  },
  {
    month: 'September-December',
    action: 'Planning Next Year',
    festivals: 'Fall festivals, next year presales',
    savings: 'Next year presales begin',
    tips: 'Research and save for next year\'s presales'
  }
];

const ticketFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'When is the best time to buy festival tickets in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'The best time is during the presale or early bird window, typically 6-12 months before the festival. This can save 30-50% compared to standard pricing. For major festivals like Coachella, Glastonbury, and Tomorrowland, presales usually open in December or January. Set calendar reminders and join mailing lists to get presale codes.' } },
    { '@type': 'Question', name: 'How much can I save by buying festival tickets early?', acceptedAnswer: { '@type': 'Answer', text: 'Early bird tickets typically save 30-50% off the peak price. For a $400 festival ticket, that is $120-200 in savings. Tier-based pricing means each batch of tickets is pricier than the last. Some festivals like Tomorrowland sell out completely in presale, so early buying also guarantees entry.' } },
    { '@type': 'Question', name: 'Do major music festivals sell out in advance?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — most popular festivals sell out months in advance. Glastonbury regularly sells out within hours of presale opening. Tomorrowland, Coachella, and Burning Man frequently sell out their general admission tiers in days. Smaller and boutique festivals rarely sell out, offering more flexibility. Always check the festival website for official sale dates.' } },
    { '@type': 'Question', name: 'Is it safe to buy festival tickets on the secondary market?', acceptedAnswer: { '@type': 'Answer', text: 'Use only official resale platforms supported by the festival (DICE, Twickets, official resale partners). Avoid Facebook groups and Craigslist — ticket fraud is common. Verify any ticket through the festival\'s official transfer or resale system. Prices on secondary markets sometimes drop in the final days before an event, but the risk of fake tickets is high.' } },
    { '@type': 'Question', name: 'What is a festival presale ticket?', acceptedAnswer: { '@type': 'Answer', text: 'A presale ticket is sold before the general public sale, usually at a discounted early bird price. Access requires a presale code, which you get by registering on the festival website, signing up to their newsletter, or being a fan club member. Presales typically run 24-72 hours before general sale opens.' } },
  ],
};

const ticketArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'When to Buy Festival Tickets 2026 — Best Times & Money-Saving Tips',
  description: 'Insider guide to buying festival tickets in 2026. Save up to 50% with our complete guide to presales, early bird pricing, and timing strategies.',
  author: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  publisher: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  datePublished: '2025-09-01',
  dateModified: '2026-03-17',
  url: 'https://getfestiwise.com/when-to-buy-festival-tickets-2025',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getfestiwise.com/when-to-buy-festival-tickets-2025' },
};

export default function WhenToBuyFestivalTickets2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ticketFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ticketArticleSchema) }} />
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
            When to Buy Festival Tickets 2026
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto text-center leading-relaxed">
            Master the art of festival ticket buying! Save up to 50% with insider knowledge on timing, 
            presales, and pricing patterns for music festivals worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              🎫 Find Festivals to Buy Tickets For →
            </Link>
          </div>
        </div>
      </section>

      {/* Ticket Buying Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            📅 Festival Ticket Buying Timeline
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Understanding when to buy can save you hundreds of dollars and guarantee your spot at sold-out festivals.
          </p>
          
          <div className="space-y-8">
            {ticketTimeline.map((phase, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">{phase.phase}</h3>
                    <p className="text-gray-600 text-lg">{phase.timing}</p>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-lg">
                      {phase.savings}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-bold text-green-600 mb-3">✅ Pros:</h4>
                    <ul className="space-y-2">
                      {phase.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="text-gray-700 text-sm">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-600 mb-3">❌ Cons:</h4>
                    <ul className="space-y-2">
                      {phase.cons.map((con, conIndex) => (
                        <li key={conIndex} className="text-gray-700 text-sm">• {con}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-600 mb-3">🎯 Best For:</h4>
                    <p className="text-gray-700 text-sm">{phase.bestFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Categories Guide */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎪 Timing by Festival Type
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Different types of festivals have different selling patterns - know what to expect.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {festivalCategories.map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{category.tipIcon}</span>
                  <h3 className="text-xl font-bold text-blue-600">{category.category}</h3>
                </div>
                <p className="text-gray-600 mb-4"><span className="font-semibold">Examples:</span> {category.examples}</p>
                <p className="text-purple-600 font-bold mb-4">Best Buy Time: {category.bestBuyTime}</p>
                
                <h4 className="font-bold text-gray-800 mb-3">Insider Tips:</h4>
                <ul className="space-y-2 mb-4">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-gray-700 text-sm flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-gray-700"><span className="font-semibold">Pricing Pattern:</span> {category.pricingPattern}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money-Saving Tips */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            💡 Money-Saving Strategies
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {moneyTips.map((tipCategory, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <span className="text-4xl">{tipCategory.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{tipCategory.title}</h3>
                </div>
                <ul className="space-y-3">
                  {tipCategory.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-gray-700 text-sm flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Buying Guide */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            📆 Month-by-Month Buying Guide
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyGuide.map((month, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-purple-600 mb-2">{month.month}</h3>
                <h4 className="font-bold text-gray-800 mb-2">{month.action}</h4>
                <p className="text-gray-600 text-sm mb-3"><span className="font-semibold">Focus:</span> {month.festivals}</p>
                <p className="text-green-600 font-semibold text-sm mb-3">{month.savings}</p>
                <p className="text-gray-700 text-sm">{month.tips}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendation CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-12 text-center border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Get Personalized Buying Advice</h2>
          <p className="text-xl text-gray-700 mb-8">
            Want specific recommendations for your favorite genres and budget? Take our quiz to get customized timing advice!
          </p>
          <Link href="/quiz" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg inline-block">
            Get My Custom Festival Calendar 📅
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Score the Best Festival Deals?</h2>
          <p className="text-xl text-white/90 mb-8">
            Find festivals that match your style and budget, then get notifications for presales and early bird deals!
          </p>
          <Link href="/quiz" className="bg-white text-blue-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find My Perfect Festival Deals 🎫
          </Link>
        </div>
      </section>
    </div>
  );
}
