import { NextResponse } from 'next/server';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// Simple in-memory rate limiter: max 5 submissions per minute per IP
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateMap = new Map<string, { count: number; windowStart: number }>();

async function forwardWithRetry(input: RequestInfo, init?: RequestInit, retries = 2) {
  let attempt = 0;
  let lastErr: any = null;
  while (attempt <= retries) {
    try {
      const res = await fetch(input, init);
      // Retry on 5xx server errors
      if (res.status >= 500 && attempt < retries) {
        attempt++;
        const backoff = 200 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, backoff));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      attempt++;
      const backoff = 200 * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
  throw lastErr;
}

export async function POST(req: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json({ success: false, message: 'Server misconfiguration: missing form access key' }, { status: 500 });
  }

  try {
    // Basic rate limiting per IP
    const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown');
    const now = Date.now();
    const record = rateMap.get(ip) || { count: 0, windowStart: now };
    if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
      // Reset window
      record.count = 0;
      record.windowStart = now;
    }
    record.count += 1;
    rateMap.set(ip, record);
    if (record.count > RATE_LIMIT_MAX) {
      return NextResponse.json({ success: false, message: 'Too many submissions. Please try again later.' }, { status: 429 });
    }

    const contentType = req.headers.get('content-type') || '';

    // Basic server-side validation for common fields
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const email = formData.get('email')?.toString() || '';
      const message = formData.get('message')?.toString() || formData.get('message')?.toString() || '';
      if (!email && !message) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
      }

      formData.append('access_key', accessKey);

      const forwardRes = await forwardWithRetry(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        body: formData,
      });

      const text = await forwardRes.text();
      try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: forwardRes.status });
      } catch (e) {
        return new Response(text, { status: forwardRes.status });
      }
    } else {
      const json = await req.json().catch(() => ({}));
      const email = json.email || json.Email || '';
      const message = json.message || json.Message || '';
      if (!email && !message) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
      }

      const payload = { ...json, access_key: accessKey };

      const forwardRes = await forwardWithRetry(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await forwardRes.text();
      try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: forwardRes.status });
      } catch (e) {
        return new Response(text, { status: forwardRes.status });
      }
    }
  } catch (err) {
    console.error('Form proxy error:', err);
    return NextResponse.json({ success: false, message: 'Form submission failed' }, { status: 502 });
  }
}
