import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/quiz/share
 * Track when a user shares their quiz results
 * Returns a unique share ID and tracking data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { festivalId, matchScore, platform, userGenre, userBudget } = body;

    // Validate required fields
    if (!festivalId || typeof matchScore !== 'number' || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate share ID for tracking (Node built-in, no package needed)
    const shareId = crypto.randomUUID().replace(/-/g, '').substring(0, 8);
    const timestamp = new Date().toISOString();

    const response = NextResponse.json({
      success: true,
      shareId,
      referralUrl: `/quiz?ref=${shareId}`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      analytics: {
        festivalName: festivalId,
        matchScore,
        platform,
        userGenre: userGenre || 'unknown',
        userBudget: userBudget || 'unknown',
        sharedAt: timestamp,
      },
    });

    // Add tracking GA event
    response.headers.set(
      'X-Share-Event',
      `share_${platform}_${festivalId}_${matchScore}`
    );

    return response;
  } catch (error) {
    console.error('Error tracking share:', error);
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/quiz/share/:shareId
 * Track when someone clicks a referral link
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('id');

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID required' },
        { status: 400 }
      );
    }

    // In a real implementation, would look up from database
    // and increment click counter
    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
      shareId,
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
