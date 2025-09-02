import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring the application's status
 * Returns basic health information including uptime and environment
 */
export async function GET(request: NextRequest) {
  const startTime = process.env.NEXT_PUBLIC_SERVER_START_TIME || Date.now().toString();
  const uptime = Date.now() - parseInt(startTime);

  // Basic health data
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: `${Math.floor(uptime / 1000 / 60)} minutes`,
  };

  return NextResponse.json(healthData, { status: 200 });
}
