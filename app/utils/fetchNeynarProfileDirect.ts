import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function fetchNeynarProfileDirect(fid: number, apiKey: string) {
  try {
    console.log('[fetchNeynarProfileDirect] Starting direct curl fetch for FID:', fid);
    
    // Use the exact curl command that worked in our test
    const curlCommand = `curl -H "accept: application/json" -H "api_key: ${apiKey}" "https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}"`;
    
    console.log('[fetchNeynarProfileDirect] Executing curl command');
    const { stdout, stderr } = await execPromise(curlCommand);
    
    if (stderr) {
      console.error('[fetchNeynarProfileDirect] Curl error:', stderr);
    }
    
    console.log('[fetchNeynarProfileDirect] Curl response received, length:', stdout.length);
    
    // Parse the JSON response
    const data = JSON.parse(stdout);
    console.log('[fetchNeynarProfileDirect] Parsed response data:', data);
    
    // Extract the user object
    if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      console.log('[fetchNeynarProfileDirect] Returning user object:', data.users[0]);
      return data.users[0];
    } else {
      console.error('[fetchNeynarProfileDirect] No user found in response:', data);
      throw new Error('No user found in response');
    }
  } catch (error) {
    console.error('[fetchNeynarProfileDirect] Error:', error);
    throw error;
  }
}
