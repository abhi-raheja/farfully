'use client';

import { useProfile } from '../components/FarcasterAuthKit';

// A simple wrapper around useProfile to provide authentication functionality
export function useAuth() {
  const { isAuthenticated, profile } = useProfile();

  // Function to sign out (you can implement this when needed)
  const signOut = () => {
    // This would need to be implemented based on Farcaster's auth system
    // For now, we can just reload the page which will clear the auth state
    window.location.reload();
  };

  return {
    isAuthenticated,
    profile,
    signOut
  };
}
