export async function fetchNeynarProfile(fid: number, apiKey: string) {
  try {
    // Log request details
    // Try using the single user endpoint instead of bulk
    const url = `https://api.neynar.com/v2/farcaster/user?fid=${fid}&viewer_fid=${fid}`;
    console.log('[fetchNeynarProfile] Fetching from URL:', url);
    console.log('[fetchNeynarProfile] Using API key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING');
    
    // Use the exact headers that worked in our curl test
    const headers = {
      'accept': 'application/json',
      'api_key': apiKey
    };
    console.log('[fetchNeynarProfile] Request headers:', headers);
    
    // Make the request with exact same parameters as curl
    const res = await fetch(url, { headers });
    
    // Log response status
    console.log('[fetchNeynarProfile] Response status:', res.status, res.statusText);
    
    // Check if response is OK
    if (!res.ok) {
      // Try to get error details from response
      const errorText = await res.text();
      console.error('[fetchNeynarProfile] Error response:', errorText);
      throw new Error(`Neynar API error: ${res.status} - ${errorText}`);
    }
    
    // Parse JSON response
    const data = await res.json();
    console.log('[fetchNeynarProfile] Full response data:', data);
    
    // Validate response structure - single user endpoint returns data.user instead of data.users array
    if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      // Bulk endpoint response
      console.log('[fetchNeynarProfile] Returning user object from bulk endpoint:', data.users[0]);
      return data.users[0];
    } else if (data.user) {
      // Single user endpoint response
      console.log('[fetchNeynarProfile] Returning user object from single endpoint:', data.user);
      return data.user;
    } else {
      console.error('[fetchNeynarProfile] Invalid response structure:', data);
      throw new Error('No user found for FID');
    }
  } catch (error) {
    console.error('[fetchNeynarProfile] Fetch error:', error);
    throw error;
  }
}
