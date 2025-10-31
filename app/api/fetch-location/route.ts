import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  // Vercel provides the user's country code in this header
  const country = request.headers.get('x-vercel-ip-country');

  // For local development, you can fallback to a default
  const countryCode = country || 'IN'; // Default to India for localhost

  return NextResponse.json({ country: countryCode });
}