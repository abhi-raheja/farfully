/**
 * Utility function to fetch Farcaster profile data from our server-side API route
 * This avoids client-side API key exposure and browser restrictions
 */
export async function fetchServerProfile(fid: number) {
  try {
    console.log('[fetchServerProfile] Fetching profile for FID:', fid);
    
    // Call our server-side API route
    const response = await fetch(`/api/neynar/profile?fid=${fid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure we're making a fresh request
      cache: 'no-store'
    });
    
    console.log('[fetchServerProfile] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchServerProfile] Error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[fetchServerProfile] Received data:', data);
    
    if (!data.user) {
      throw new Error('No user data in response');
    }
    
    return data.user;
  } catch (error) {
    console.error('[fetchServerProfile] Fetch error:', error);
    throw error;
  }
}
