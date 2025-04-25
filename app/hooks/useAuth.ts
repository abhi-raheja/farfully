'use client';

import { useEffect } from 'react';
import { useProfile } from '../components/FarcasterAuthKit';
import { usePersistentAuth, StoredProfile } from './usePersistentAuth';

// Define the return type for useAuth
export type AuthState = {
  isAuthenticated: boolean;
  profile: StoredProfile | null;
  signOut: () => void;
};

// Combined authentication hook that uses both Farcaster and cookie-based persistence
export function useAuth(): AuthState {
  // Get authentication state from Farcaster
  const { isAuthenticated: fcIsAuthenticated, profile: fcProfile } = useProfile();
  
  // Get persistent auth state from cookies
  const { 
    isAuthenticated: cookieIsAuthenticated, 
    profile: cookieProfile,
    saveAuth,
    clearAuth
  } = usePersistentAuth();
  
  // Update cookies when Farcaster auth changes
  useEffect(() => {
    if (!fcIsAuthenticated || !fcProfile) return;
    // Only save to cookies if the Farcaster profile is different from the cookie profile
    const profileToStore = {
      fid: fcProfile.fid,
      username: fcProfile.username,
      displayName: fcProfile.displayName,
      pfpUrl: fcProfile.pfpUrl
    };
    const profilesAreEqual = cookieProfile &&
      cookieProfile.fid === profileToStore.fid &&
      cookieProfile.username === profileToStore.username &&
      cookieProfile.displayName === profileToStore.displayName &&
      cookieProfile.pfpUrl === profileToStore.pfpUrl;
    if (!profilesAreEqual) {
      console.log('[useAuth] Farcaster authenticated, saving profile to cookies:', fcProfile);
      saveAuth(true, profileToStore);
    }
  }, [fcIsAuthenticated, fcProfile, saveAuth, cookieProfile]);
  
  // Function to sign out
  const signOut = () => {
    console.log('[useAuth] Signing out, clearing cookies and Farcaster state.');
    // Clear cookies
    clearAuth();
    // Also clear any Farcaster auth state from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farcaster-auth-state');
    }
    // Reload the page
    window.location.reload();
  };
  
  // Determine effective authentication state
  // Use Farcaster auth if available, otherwise use cookie auth
  const isAuthenticated = fcIsAuthenticated || cookieIsAuthenticated;
  // Only use a valid profile object if authenticated, otherwise null
  let profile: StoredProfile | null = null;
  if (isAuthenticated) {
    profile = fcProfile && Object.keys(fcProfile).length > 0 ? fcProfile : (cookieProfile && Object.keys(cookieProfile).length > 0 ? cookieProfile : null);
  }
  console.log('[useAuth] Returning state:', { isAuthenticated, profile });
  return {
    isAuthenticated,
    profile,
    signOut
  };
}
