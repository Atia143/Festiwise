import { FAQItem } from '@/types/faq';

export const faqData: FAQItem[] = [
  {
    id: "general-1",
    category: "Festival Basics",
    question: "How do you pick the festivals?",
    answer: "We curate festivals based on genre, region, and month, using publicly available data from official festival sources. Our selection process considers factors including historical attendance, cultural significance, and geographic diversity.",
    tags: ["selection", "curation", "quick"],
    lastUpdated: new Date("2025-08-01"),
    helpfulCount: 0,
    relatedQuestions: [],
    relatedGuides: [
      {
        title: "Take Our Festival Quiz",
        url: "/quiz"
      }
    ]
  },
  {
    id: "matching-1",
    category: "Festival Basics",
    question: "How does the festival matching work?",
    answer: "Our matching algorithm analyzes your music preferences, budget constraints, travel flexibility, and other factors to find festivals that best match your criteria. We use weighted scoring to prioritize the aspects that matter most to you.",
    tags: ["algorithm", "matching", "preferences", "quick"],
    lastUpdated: new Date("2025-08-01"),
    helpfulCount: 0,
    relatedQuestions: [],
    relatedGuides: [
      {
        title: "Festival Matching Guide",
        url: "/quiz"
      }
    ]
  },
  {
    id: "planning-1",
    category: "Festival Basics",
    question: "When should I start planning for a festival?",
    answer: "We recommend planning 6-8 months ahead for major festivals. This gives you time to secure tickets (which often sell out quickly), arrange transportation, book accommodation, and plan your budget.",
    tags: ["planning", "timing", "preparation", "quick"],
    lastUpdated: new Date("2025-08-01"),
    helpfulCount: 0,
    relatedQuestions: ["budget-1"],
    relatedGuides: [
      {
        title: "Try Our Quiz",
        url: "/quiz"
      }
    ]
  },
  {
    id: "general-2",
    category: "Festival Basics",
    question: "What makes FestiWise different from other festival finders?",
    answer: "FestiWise focuses on quality over quantity. We curate only world-class festivals (100 vs thousands), provide intelligent matching based on your preferences, and offer practical planning tools. Our 2-minute quiz considers factors like music taste, budget, travel preferences, and experience level.",
    tags: ["unique", "features", "comparison"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["matching-1"],
    relatedGuides: []
  },
  {
    id: "general-3",
    category: "Festival Basics",
    question: "How accurate are the festival dates and prices?",
    answer: "We update festival information regularly from official sources. However, dates and prices can change, so we always recommend checking the official festival website before booking. We include links to official ticket pages for verification.",
    tags: ["accuracy", "dates", "prices", "verification"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: [],
    relatedGuides: []
  },
  {
    id: "international-1",
    category: "International Travel",
    question: "Do you include festivals outside the US?",
    answer: "Yes! We feature festivals from 30+ countries including Belgium (Tomorrowland), UK (Glastonbury), Spain (Primavera Sound), Germany (Rock am Ring), Australia (Splendour in the Grass), Japan (Fuji Rock), and many more. Our platform specializes in helping you discover festivals worldwide.",
    tags: ["international", "countries", "global"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["travel-1"],
    relatedGuides: []
  },
  {
    id: "travel-1",
    category: "International Travel",
    question: "How do I plan for international festivals?",
    answer: "For international festivals, consider: visa requirements, passport validity (6+ months), travel insurance, currency exchange, accommodation booking early, understanding local customs, and checking vaccination requirements. Plan 3-4 months ahead for international events.",
    tags: ["international", "travel", "planning", "visa"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["planning-1"],
    relatedGuides: []
  },
  {
    id: "budget-1",
    category: "Budget & Costs",
    question: "What's typically included in festival costs?",
    answer: "Festival costs usually include ticket price, but you should budget for: accommodation (camping/hotels), food and drinks, transportation, travel insurance, gear (if camping), and spending money. Total costs can range from $300 (local camping festivals) to $3000+ (international luxury experiences).",
    tags: ["budget", "costs", "planning"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["budget-2"],
    relatedGuides: []
  },
  {
    id: "budget-2",
    category: "Budget & Costs",
    question: "How can I attend festivals on a tight budget?",
    answer: "Budget tips: Look for early bird tickets, consider volunteering for free entry, choose camping over hotels, bring your own food/drinks where allowed, travel in groups to split costs, look for local festivals to reduce travel expenses, and consider festivals in Eastern Europe for lower costs.",
    tags: ["budget", "savings", "tips", "cheap"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["budget-1"],
    relatedGuides: []
  },
  {
    id: "tickets-1",
    category: "Tickets & Booking",
    question: "When is the best time to buy festival tickets?",
    answer: "Best times to buy: Early bird sales (30-50% savings), general release (when lineup is announced), or last-minute deals (risky but possible 10-30% savings). Avoid resale markets unless official exchange. Major festivals like Tomorrowland sell out in minutes.",
    tags: ["tickets", "timing", "early bird", "sales"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["tickets-2"],
    relatedGuides: []
  },
  {
    id: "tickets-2",
    category: "Tickets & Booking",
    question: "Are festival tickets refundable?",
    answer: "Most festival tickets are non-refundable, but policies vary. Some festivals offer: official resale platforms, transfer options, or insurance add-ons. Always read terms before buying. Travel insurance may cover some losses if you can't attend due to illness or emergencies.",
    tags: ["refunds", "policy", "insurance", "transfers"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["tickets-1"],
    relatedGuides: []
  },
  {
    id: "safety-1",
    category: "Safety & Health",
    question: "How do I stay safe at festivals?",
    answer: "Safety tips: Stay hydrated, use sunscreen, pace yourself with alcohol, stick with friends, keep valuables secure, know emergency contacts, have a meeting point plan, respect local laws, and trust your instincts. Many festivals have medical tents and security for emergencies.",
    tags: ["safety", "health", "security", "tips"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["safety-2"],
    relatedGuides: []
  },
  {
    id: "safety-2",
    category: "Safety & Health",
    question: "What should I do if something goes wrong at a festival?",
    answer: "If problems arise: Contact festival security/medical staff immediately, keep emergency numbers handy, have travel insurance contact info, notify your group, stay calm and follow staff instructions. Most festivals have 24/7 security and medical facilities on-site.",
    tags: ["emergency", "problems", "security", "medical"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["safety-1"],
    relatedGuides: []
  },
  {
    id: "first-time-1",
    category: "First-Time Attendees",
    question: "What should I know for my first festival?",
    answer: "First-timer tips: Start with smaller, local festivals; pack essentials (sunscreen, water bottle, portable charger); arrive early to get oriented; make friends with neighbors; pace yourself; download the festival app; have a backup plan for everything; and most importantly - be open to new experiences!",
    tags: ["first time", "beginners", "tips", "advice"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["packing-1"],
    relatedGuides: []
  },
  {
    id: "packing-1",
    category: "Packing & Gear",
    question: "What are the festival packing essentials?",
    answer: "Essential items: Weather-appropriate clothes, comfortable shoes, sunscreen, hat, reusable water bottle, portable charger, cash, copies of ID/tickets, basic first aid kit, and ear protection. For camping: tent, sleeping bag, pillow, camping chair, and headlamp.",
    tags: ["packing", "essentials", "gear", "camping"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["first-time-1"],
    relatedGuides: []
  },
  {
    id: "music-1",
    category: "Music & Artists",
    question: "How do I discover new music at festivals?",
    answer: "Music discovery tips: Arrive early to catch opening acts, explore smaller stages, check artist recommendations on festival apps, ask other attendees about their favorites, and be open to genres you don't usually listen to. Festivals are perfect for musical exploration!",
    tags: ["music", "discovery", "artists", "exploration"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: [],
    relatedGuides: []
  },
  {
    id: "groups-1",
    category: "Groups & Solo Travel",
    question: "Is it safe to attend festivals alone?",
    answer: "Solo festival attendance can be very rewarding! Tips for solo travelers: Stay in designated camping areas, join festival Facebook groups to meet people, tell someone your plans, trust your instincts, participate in group activities, and remember that festival communities are generally very welcoming.",
    tags: ["solo", "alone", "safety", "community"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["safety-1"],
    relatedGuides: []
  },
  {
    id: "weather-1",
    category: "Weather & Seasons",
    question: "How do I prepare for different weather conditions?",
    answer: "Weather prep: Check forecasts but pack for all conditions. Bring layers, waterproof gear, and sun protection. Summer festivals: focus on sun/heat protection. Winter/spring: pack warm clothes and waterproofs. Always have contingency plans for extreme weather cancellations.",
    tags: ["weather", "seasons", "preparation", "gear"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: ["packing-1"],
    relatedGuides: []
  },
  {
    id: "special-1",
    category: "Special Considerations",
    question: "Are festivals accessible for people with disabilities?",
    answer: "Many festivals offer accessibility services including: wheelchair accessible areas, accessible camping, BSL interpreters, accessible toilets, dedicated viewing areas, and assistance dogs. Contact festivals directly about specific needs - most are very accommodating and helpful.",
    tags: ["accessibility", "disabilities", "special needs", "inclusion"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: [],
    relatedGuides: []
  },
  {
    id: "special-2",
    category: "Special Considerations",
    question: "Can I bring children to music festivals?",
    answer: "Some festivals are family-friendly with dedicated kids' areas, while others are 18+. Family festivals often feature: kids' activities, baby changing facilities, family camping areas, and earlier curfews. Always check age restrictions and facilities before booking with children.",
    tags: ["family", "children", "kids", "age restrictions"],
    lastUpdated: new Date("2025-09-01"),
    helpfulCount: 0,
    relatedQuestions: [],
    relatedGuides: []
  },
  {
    id: "budget-3",
    category: "Festival Basics",
    question: "What costs should I consider beyond tickets?",
    answer: "Consider transportation (flights/gas), accommodation (camping gear/hotel), food and drinks, merchandise, and emergency funds. We recommend budgeting an additional 50-100% of the ticket price for these expenses.",
    tags: ["budget", "costs", "planning", "quick"],
    lastUpdated: new Date("2025-08-01"),
    helpfulCount: 0,
    relatedQuestions: ["planning-1"],
    relatedGuides: [
      {
        title: "Start Planning with Our Quiz",
        url: "/quiz"
      }
    ]
  }
];

export function getFAQsByCategory(category?: string) {
  if (!category) return faqData;
  return faqData.filter(faq => faq.category.toLowerCase() === category.toLowerCase());
}

export function getFAQsByTags(tags: string[]) {
  return faqData.filter(faq => 
    faq.tags?.some(tag => 
      tags.includes(tag.toLowerCase())
    )
  );
}
