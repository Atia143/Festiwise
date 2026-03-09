import type { Festival } from '@/types/festival';

export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  headerGradient: string;
  intro: string;
  expertNote: string;
  filter: (f: Festival) => boolean;
  sort?: (a: Festival, b: Festival) => number;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'most-sustainable',
    title: 'Most Sustainable Festivals',
    subtitle: 'Planet-first events that prove music and responsibility go hand in hand',
    badge: 'Green Choice',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    headerGradient: 'from-emerald-700 via-green-700 to-teal-800',
    intro: 'Sustainability has moved from niche concern to industry-defining priority. The festivals in this collection lead the way they offset their carbon footprints, operate zero-waste policies, power stages with renewable energy, and give back to the communities they inhabit. Attending one of these events is not just a great time; it is a vote for the kind of live music industry we want to build.',
    expertNote: 'We selected these festivals based on verified sustainability credentials - renewable energy use, waste reduction targets, plant-based catering options, and community impact programmes. Attending any of these is a meaningfully better choice.',
    filter: (f) => f.vibe.includes('sustainable') || f.vibe.includes('community'),
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'solo-traveler-best',
    title: 'Best for Solo Travelers',
    subtitle: 'Go alone, leave with lifelong connections',
    badge: 'Solo-Friendly',
    badgeColor: 'bg-blue-100 text-blue-700',
    headerGradient: 'from-blue-700 via-indigo-700 to-purple-800',
    intro: 'Solo festival travel is one of the great freedoms - no compromises, no waiting around, and the very real possibility of meeting your people in a crowd of thousands. The best festivals for solo travelers have strong community vibes, friendly crowd cultures, and enough programming variety that you are never bored between sets. These are the events where strangers become friends by day two.',
    expertNote: 'We prioritised festivals with community and intimate vibes, medium-to-large crowd sizes (enough people to meet someone, small enough to find them again), and a track record of welcoming solo attendees.',
    filter: (f) => f.vibe.includes('community') || f.vibe.includes('intimate') || f.vibe.includes('cultural'),
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'budget-gems',
    title: 'Budget-Friendly Gems',
    subtitle: 'World-class experiences under $500 total',
    badge: 'Best Value',
    badgeColor: 'bg-amber-100 text-amber-700',
    headerGradient: 'from-amber-700 via-orange-700 to-red-800',
    intro: 'Great festival experiences do not require a second mortgage. Some of the most culturally rich, musically adventurous, and genuinely life-changing events in the world are also surprisingly affordable. These hidden gems deliver extraordinary value - often with stronger community feeling, more adventurous lineups, and less corporate polish than their premium counterparts.',
    expertNote: 'Budget-friendly here means total estimated attendance cost under $600 including travel basics. We have verified that these festivals deliver on quality - low ticket price does not mean low experience.',
    filter: (f) => f.estimated_cost_usd.min < 500,
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'luxury-experiences',
    title: 'Ultimate Luxury Festival Experiences',
    subtitle: 'Where world-class music meets five-star living',
    badge: 'Premium',
    badgeColor: 'bg-purple-100 text-purple-700',
    headerGradient: 'from-purple-800 via-purple-700 to-pink-700',
    intro: 'For those who want the transcendent power of live music without compromising on comfort, these festivals redefine what a premium experience looks like. Think private glamping villages with concierge service, gourmet dining curated by Michelin-starred chefs, curated hospitality packages, and the world\'s biggest headliners - all in settings that would be breathtaking even without the music.',
    expertNote: 'These selections combine luxury vibe markers with premium pricing tiers and glamping availability. They represent the pinnacle of the global festival experience for those who prioritise comfort alongside culture.',
    filter: (f) => f.vibe.includes('luxury') || (f.glamping === true && f.estimated_cost_usd.min > 800),
    sort: (a, b) => b.estimated_cost_usd.min - a.estimated_cost_usd.min,
  },
  {
    slug: 'family-adventures',
    title: 'Best Family Festival Adventures',
    subtitle: 'Unforgettable experiences for every generation',
    badge: 'Family Pick',
    badgeColor: 'bg-pink-100 text-pink-700',
    headerGradient: 'from-pink-600 via-rose-700 to-orange-700',
    intro: 'The best family festivals understand something fundamental: children are not just smaller adults to be tolerated between sets. They are a core part of the audience, and the finest family-friendly events design entire programming streams, safe spaces, and experiences specifically for them. These festivals create memories that span generations - where parents rediscover their love of live music and children experience it for the first time.',
    expertNote: 'Every festival here has verified family-friendly designation with dedicated children\'s areas, age-appropriate programming, and a welcoming atmosphere for all ages. We have prioritised events with particularly strong track records for family attendance.',
    filter: (f) => f.family_friendly === true,
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'underground-legends',
    title: 'Underground Legends',
    subtitle: 'The festivals the algorithm will never recommend',
    badge: 'Cult Status',
    badgeColor: 'bg-gray-100 text-gray-700',
    headerGradient: 'from-gray-900 via-slate-800 to-zinc-900',
    intro: 'These are the festivals that true music obsessives talk about in hushed tones - events that have shaped genres, launched careers, and built communities so loyal they border on cult. They resist the mainstream not because they are obscure, but because they stand for something specific: musical integrity, genuine community, and the belief that the best experiences happen when you abandon compromise.',
    expertNote: 'Underground here means more than just genre - it means a festival philosophy that prioritises artistic credibility and community over commercial appeal. These events have shaped the culture.',
    filter: (f) => f.vibe.includes('underground') || f.vibe.includes('alternative'),
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'beach-summer-vibes',
    title: 'Beach & Summer Vibes',
    subtitle: 'Sun, sand, and the soundtrack of summer',
    badge: 'Summer Essentials',
    badgeColor: 'bg-sky-100 text-sky-700',
    headerGradient: 'from-sky-600 via-blue-600 to-cyan-700',
    intro: 'There is something uniquely magical about a festival with the ocean as its backdrop - music that hits differently when there is salt in the air and the horizon is nothing but blue. These beach and summer festivals combine exceptional programming with locations that are destinations in themselves. They are the rare events where the setting is as memorable as the lineup.',
    expertNote: 'We selected festivals with beach or summer vibe designations and warm weather profiles, in locations with coastal or resort access. These are the ones worth booking flights for the location alone.',
    filter: (f) => f.vibe.includes('beach') || (f.weather_profile.includes('warm') && f.vibe.includes('party')),
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'electronic-meccas',
    title: 'Electronic Music Meccas',
    subtitle: 'The definitive global destinations for dance music',
    badge: 'Electronic Authority',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    headerGradient: 'from-indigo-800 via-purple-800 to-blue-900',
    intro: 'Electronic music festivals are not just concerts - they are pilgrimages. The events in this collection have defined the genre\'s global map: cities transformed into dancefloors, abandoned warehouses into cathedrals, and open fields into temporary cities of believers. Whether you are chasing the underground techno of Berlin, the beach house of Ibiza, or the stadium EDM of Miami, these are the events that matter.',
    expertNote: 'This collection spans the full spectrum of electronic music culture - from intimate techno clubs to 200,000-capacity EDM spectacles. Unified by their role in defining what electronic music festival culture means globally.',
    filter: (f) => f.genres.some(g => ['electronic', 'techno', 'house', 'trance', 'edm', 'dubstep'].includes(g)),
    sort: (a, b) => b.audience_size.localeCompare(a.audience_size),
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find(c => c.slug === slug);
}

export function getCollectionFestivals(collection: Collection, festivals: Festival[]): Festival[] {
  const filtered = festivals.filter(f => f.status === 'active' && collection.filter(f));
  if (collection.sort) return filtered.sort(collection.sort);
  return filtered;
}
