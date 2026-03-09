import { NextRequest, NextResponse } from 'next/server';
import festivalsData from '@/data/festivals.json';

interface FestivalRecord {
  id: string;
  ticket_official_url: string;
}

// Affiliate ID registry — add IDs here as you join each program.
// Keys are UTM-compatible network identifiers.
// Example: ticketmaster: 'YOUR_TM_AFFILIATE_ID'
const AFFILIATE_IDS: Record<string, string> = {
  // ticketmaster: '',
  // dice: '',
  // skiddle: '',
  // ra: '',
};

function buildAffiliateUrl(base: URL, festivalSlug: string): URL {
  // Standard UTM params (always applied — works for Google Analytics + any affiliate network)
  base.searchParams.set('utm_source', 'festiwise');
  base.searchParams.set('utm_medium', 'affiliate');
  base.searchParams.set('utm_campaign', 'tickets');
  base.searchParams.set('utm_content', festivalSlug);
  base.searchParams.set('ref', 'festiwise');

  // Network-specific affiliate params
  const host = base.hostname;

  if (host.includes('ticketmaster') && AFFILIATE_IDS.ticketmaster) {
    base.searchParams.set('aff', AFFILIATE_IDS.ticketmaster);
  } else if (host.includes('dice.fm') && AFFILIATE_IDS.dice) {
    base.searchParams.set('partner', AFFILIATE_IDS.dice);
  } else if (host.includes('skiddle.com') && AFFILIATE_IDS.skiddle) {
    base.searchParams.set('affil', AFFILIATE_IDS.skiddle);
  } else if (host.includes('ra.co') && AFFILIATE_IDS.ra) {
    base.searchParams.set('r', AFFILIATE_IDS.ra);
  }

  return base;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ festival: string }> }
) {
  const { festival: festivalSlug } = await params;
  const festival = (festivalsData as FestivalRecord[]).find(f => f.id === festivalSlug);

  if (!festival?.ticket_official_url) {
    return NextResponse.redirect(new URL('/festivals', request.url));
  }

  try {
    const dest = buildAffiliateUrl(new URL(festival.ticket_official_url), festivalSlug);
    return NextResponse.redirect(dest.toString(), { status: 302 });
  } catch {
    return NextResponse.redirect(new URL('/festivals', request.url));
  }
}
