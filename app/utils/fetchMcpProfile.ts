/**
 * Fetch Farcaster profile data using the Neynar MCP server
 * This approach avoids rate limits and CORS issues
 */
export async function fetchMcpProfile(fid: number) {
  try {
    console.log(`[fetchMcpProfile] Fetching profile for FID: ${fid}`);
    
    // Call the MCP server to get user data
    const response = await fetch(`http://localhost:3333/api/v2/farcaster/user?fid=${fid}&viewer_fid=${fid}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MCP server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[fetchMcpProfile] Response data keys:`, Object.keys(data));
    
    // Handle different response formats
    let userProfile;
    
    if (data.user) {
      // Single user endpoint format
      console.log('[fetchMcpProfile] Found user object in response');
      userProfile = data.user;
    } else if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      // Bulk users endpoint format
      console.log('[fetchMcpProfile] Found users array in response');
      userProfile = data.users[0];
    } else {
      console.error('[fetchMcpProfile] No user data found in response:', data);
      throw new Error('User not found in response');
    }
    
    console.log(`[fetchMcpProfile] User profile keys:`, Object.keys(userProfile));
    console.log(`[fetchMcpProfile] Has follower_count:`, userProfile.follower_count !== undefined);
    console.log(`[fetchMcpProfile] Has following_count:`, userProfile.following_count !== undefined);
    console.log(`[fetchMcpProfile] Has verified_accounts:`, !!userProfile.verified_accounts);
    
    return userProfile;
  } catch (error) {
    console.error('[fetchMcpProfile] Error:', error);
    throw error;
  }
}
