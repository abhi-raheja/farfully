const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
const BASE_URL = 'https://api.neynar.com/v2/farcaster';

if (!apiKey) {
  console.warn('NEXT_PUBLIC_NEYNAR_API_KEY is not defined in environment variables');
}

// Generic fetch wrapper for Neynar REST API
export async function neynarFetch(path: string, params: Record<string, any> = {}) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });
  const res = await fetch(url.toString(), {
    headers: {
      'accept': 'application/json',
      'x-api-key': apiKey || '',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Neynar API error: ${res.status}`);
  return res.json();
}