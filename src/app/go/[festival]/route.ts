import { NextRequest, NextResponse } from 'next/server';
import festivalsData from '@/data/festivals.json';

interface FestivalRecord {
  id: string;
  ticket_official_url: string;
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
    const dest = new URL(festival.ticket_official_url);
    dest.searchParams.set('utm_source', 'festiwise');
    dest.searchParams.set('utm_medium', 'marketplace');
    dest.searchParams.set('utm_campaign', 'tickets');
    dest.searchParams.set('utm_content', festivalSlug);
    return NextResponse.redirect(dest.toString(), { status: 302 });
  } catch {
    return NextResponse.redirect(new URL('/festivals', request.url));
  }
}
