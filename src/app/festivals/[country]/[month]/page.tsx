import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import rawFestivals from '@/data/festivals.json';
import FestivalGrid from '@/components/FestivalGrid';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import FestivalListingSchema from '@/components/SEO/FestivalListingSchema';

interface Festival {
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
}

const festivals = rawFestivals as Festival[];

// Generate static paths for all country/month combinations
export async function generateStaticParams() {
  const combinations: { country: string; month: string }[] = [];
  
  festivals.forEach(festival => {
    const country = festival.country.toLowerCase().replace(/\s+/g, '-');
    festival.months.forEach(month => {
      const monthSlug = month.toLowerCase();
      if (!combinations.some(c => c.country === country && c.month === monthSlug)) {
        combinations.push({ country, month: monthSlug });
      }
    });
  });
  
  return combinations;
}

// Generate dynamic metadata for each country/month combination
export async function generateMetadata({ params }: { params: Promise<{ country: string; month: string }> }): Promise<Metadata> {
  const { country, month } = await params;
  const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const monthName = month.replace(/\b\w/g, l => l.toUpperCase());
  
  const filteredFestivals = festivals.filter(f => 
    f.country.toLowerCase().replace(/\s+/g, '-') === country &&
    f.months.some(m => m.toLowerCase() === month)
  );

  if (filteredFestivals.length === 0) {
    return {
      title: 'No Festivals Found',
      description: `No festivals found for ${monthName} in ${countryName}.`
    };
  }

  const topGenres = [...new Set(filteredFestivals.flatMap(f => f.genres))].slice(0, 3);
  const minPrice = Math.min(...filteredFestivals.map(f => f.estimated_cost_usd.min));

  return {
    title: `${filteredFestivals.length} Music Festivals in ${countryName} - ${monthName} ${new Date().getFullYear()}`,
    description: `Discover ${filteredFestivals.length} incredible music festivals happening in ${countryName} during ${monthName}. ${topGenres.join(', ')} events starting from $${minPrice}. Get tickets, dates & complete festival guide.`,
    keywords: [
      `${countryName} festivals ${monthName}`,
      `${monthName} ${countryName} music festivals`,
      ...topGenres.map(g => `${g} festivals ${countryName} ${monthName}`),
      `${monthName} ${new Date().getFullYear()} festivals ${countryName}`
    ],
    openGraph: {
      title: `${filteredFestivals.length} ${monthName} Music Festivals in ${countryName} | ${new Date().getFullYear()}`,
      description: `${filteredFestivals.length} festivals in ${countryName} this ${monthName}. ${topGenres.join(', ')} events from $${minPrice}+`,
      images: [{
        url: `/api/og/country/${country}/month/${month}`,
        width: 1200,
        height: 630,
        alt: `${monthName} Music Festivals in ${countryName}`
      }]
    },
    alternates: {
      canonical: `https://getfestiwise.com/festivals/${country}/${month}`
    }
  };
}

export default async function CountryMonthFestivalsPage({ params }: { params: Promise<{ country: string; month: string }> }) {
  const { country, month } = await params;
  const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const monthName = month.replace(/\b\w/g, l => l.toUpperCase());
  
  const filteredFestivals = festivals.filter(f => 
    f.country.toLowerCase().replace(/\s+/g, '-') === country &&
    f.months.some(m => m.toLowerCase() === month)
  );

  if (filteredFestivals.length === 0) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Festivals', href: '/festivals' },
    { label: countryName, href: `/festivals/${country}` },
    { label: monthName, href: `/festivals/${country}/${month}` }
  ];

  return (
    <>
      <FestivalListingSchema 
        festivals={filteredFestivals}
        pageTitle={`${monthName} Music Festivals in ${countryName}`}
        pageDescription={`Complete guide to ${filteredFestivals.length} music festivals in ${countryName} during ${monthName}`}
        pageUrl={`https://getfestiwise.com/festivals/${country}/${month}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Breadcrumbs items={breadcrumbs} />
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {monthName} Festivals in {countryName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {filteredFestivals.length} incredible festivals happening in {countryName} during {monthName} {new Date().getFullYear()}.
            </p>
          </div>

          <FestivalGrid festivals={filteredFestivals} />
        </div>
      </div>
    </>
  );
}
