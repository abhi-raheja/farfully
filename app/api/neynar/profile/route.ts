import { NextRequest, NextResponse } from 'next/server';
import { enrichProfileData } from '../../../utils/enrichProfileData';

// Simple in-memory cache for rate limiting
const CACHE_DURATION = 60 * 1000; // 1 minute cache
const profileCache = new Map<string, { data: any, timestamp: number }>();

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute
const requestLog = new Map<string, number[]>();

// API route to fetch Farcaster profile from Neynar
export async function GET(request: NextRequest) {
  try {
    // Get the FID from the query parameters
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Fetching Neynar profile for FID: ${fid}`);
    
    // Check cache first
    const cacheKey = `profile-${fid}`;
    const cachedData = profileCache.get(cacheKey);
    const now = Date.now();
    
    if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
      console.log(`[API] Returning cached profile for FID: ${fid}`);
      return NextResponse.json(cachedData.data);
    }
    
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const requestKey = `${ip}-${fid}`;
    const requestTimes = requestLog.get(requestKey) || [];
    
    // Filter out requests older than the window
    const recentRequests = requestTimes.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    // Check if we've exceeded the rate limit
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      console.log(`[API] Rate limit exceeded for ${requestKey}`);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Update request log
    recentRequests.push(now);
    requestLog.set(requestKey, recentRequests);

    // Get the API key from environment variables
    const apiKey = process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      );
    }
    
    // Log the request details (for debugging)
    console.log(`[API] Fetching Neynar profile for FID: ${fid}`);
    
    // Fetch profile from Neynar API
    // Try both endpoints to maximize chances of success
    const bulkUrl = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
    const singleUrl = `https://api.neynar.com/v2/farcaster/user?fid=${fid}`;
    
    // Try the bulk endpoint first
    console.log(`[API] Trying bulk endpoint: ${bulkUrl}`);
    let response = await fetch(bulkUrl, {
      headers: {
        'accept': 'application/json',
        'api_key': apiKey
      },
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch profile: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Parse the response data
    const data = await response.json();
    console.log(`[API] Response data keys:`, Object.keys(data));

    // Handle different response formats from Neynar API
    let userProfile;
    
    if (data.user) {
      // Single user endpoint format
      console.log('[API] Found user object in response');
      userProfile = data.user;
    } else if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      // Bulk users endpoint format
      console.log('[API] Found users array in response');
      userProfile = data.users[0];
    } else {
      console.error('[API] No user data found in response:', data);
      return NextResponse.json(
        { error: 'User not found in response' },
        { status: 404 }
      );
    }
    
    console.log(`[API] User profile keys:`, Object.keys(userProfile));

    // Add debug information to help diagnose issues
    console.log(`[API] User profile fields:`, Object.keys(userProfile));
    console.log(`[API] Has follower_count:`, userProfile.follower_count !== undefined);
    console.log(`[API] Has following_count:`, userProfile.following_count !== undefined);
    console.log(`[API] Has verified_accounts:`, !!userProfile.verified_accounts);
    
    // Use strict mode to only return real data from Neynar, no sample data
    const strictProfile = enrichProfileData(userProfile, true);
    console.log(`[API] Strict profile fields:`, Object.keys(strictProfile));
    console.log(`[API] Strict has follower_count:`, strictProfile.follower_count !== undefined);
    console.log(`[API] Strict has following_count:`, strictProfile.following_count !== undefined);
    console.log(`[API] Strict has verified_accounts:`, !!strictProfile.verified_accounts);
    
    // Cache the response
    const responseData = { user: strictProfile };
    profileCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });
    console.log(`[API] Cached profile for FID: ${fid}`);
    
    // Return the strict user profile with only real data
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[API] Error fetching Neynar profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
