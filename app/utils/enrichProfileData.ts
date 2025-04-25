import { sampleProfileData } from './sampleProfileData';

/**
 * Enriches a basic user profile with rich data from the sample profile
 * This ensures all UI fields have data to display, even if the API doesn't return rich data
 * @param userProfile The user profile to enrich
 * @param strictMode If true, only use real data, don't add sample data
 */
export function enrichProfileData(userProfile: any, strictMode = false) {
  // Don't modify if it's already a rich profile
  if (
    userProfile.follower_count !== undefined &&
    userProfile.following_count !== undefined &&
    userProfile.verified_accounts
  ) {
    console.log('[enrichProfileData] Profile already has rich data, not enriching');
    return userProfile;
  }

  // If strictMode is true, just return the original profile without enrichment
  if (strictMode) {
    console.log('[enrichProfileData] Strict mode enabled, not enriching profile');
    return userProfile;
  }

  console.log('[enrichProfileData] Enriching basic profile with sample data');
  
  // Create a new object with the user's basic data
  const enriched = { ...userProfile };
  
  // Add follower and following counts if missing
  if (enriched.follower_count === undefined) {
    enriched.follower_count = sampleProfileData.follower_count;
  }
  
  if (enriched.following_count === undefined) {
    enriched.following_count = sampleProfileData.following_count;
  }
  
  // Add verified accounts if missing
  if (!enriched.verified_accounts) {
    enriched.verified_accounts = sampleProfileData.verified_accounts;
  }
  
  // Add verified addresses if missing
  if (!enriched.verified_addresses) {
    enriched.verified_addresses = sampleProfileData.verified_addresses;
  }
  
  // Add location if missing
  if (!enriched.location && !enriched.profile?.location) {
    // Check if location exists in sample data (it might be in profile.location instead)
    if ('location' in sampleProfileData) {
      enriched.location = (sampleProfileData as any).location;
    } else if (sampleProfileData.profile?.location) {
      enriched.profile = enriched.profile || {};
      enriched.profile.location = sampleProfileData.profile.location;
    }
  }
  
  // Add bio if missing
  if (!enriched.bio && !enriched.profile?.bio) {
    enriched.profile = enriched.profile || {};
    enriched.profile.bio = sampleProfileData.profile.bio;
  }
  
  console.log('[enrichProfileData] Enriched profile:', enriched);
  return enriched;
}
