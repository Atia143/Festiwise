import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for tracking
// Note: This will reset on server restart - for production use Redis or a database
let visitors = {
  total: 0,
  lastHour: 0,
  uniqueIPs: new Set<string>(),
  pages: {} as Record<string, number>,
  referrers: {} as Record<string, number>,
  lastCleared: Date.now()
};

/**
 * Endpoint for capturing and retrieving basic analytics data
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Increment total visitors
    visitors.total++;
    
    // Track unique IPs
    visitors.uniqueIPs.add(ip);
    
    // Track pages
    if (data.page) {
      visitors.pages[data.page] = (visitors.pages[data.page] || 0) + 1;
    }
    
    // Track referrers
    if (data.referrer) {
      const referrerDomain = new URL(data.referrer).hostname;
      visitors.referrers[referrerDomain] = (visitors.referrers[referrerDomain] || 0) + 1;
    }

    // Reset hourly counts if needed
    const oneHourAgo = Date.now() - 3600000;
    if (visitors.lastCleared < oneHourAgo) {
      visitors.lastHour = 0;
      visitors.lastCleared = Date.now();
    }
    
    visitors.lastHour++;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Only allow access with the correct token
  const token = request.nextUrl.searchParams.get('token');
  const validToken = process.env.ADMIN_ANALYTICS_TOKEN || 'festiwise-dev-token';
  
  if (token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Return current stats
  return NextResponse.json({
    total: visitors.total,
    lastHour: visitors.lastHour,
    uniqueVisitors: visitors.uniqueIPs.size,
    topPages: Object.entries(visitors.pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    topReferrers: Object.entries(visitors.referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    lastUpdated: new Date().toISOString()
  }, { status: 200 });
}
