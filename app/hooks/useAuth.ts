'use client';

import { useEffect } from 'react';
import { useProfile } from '../components/FarcasterAuthKit';
import { usePersistentAuth, StoredProfile } from './usePersistentAuth';
import { useAppStore } from '../store/useAppStore';

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
  const setUser = useAppStore((state) => state.setUser);

  const zustandUser = useAppStore((state) => state.user);

  useEffect(() => {
    // Only proceed if authenticated and profile is valid
    let profileToStore = null;
    if (fcIsAuthenticated && fcProfile && typeof fcProfile.fid === 'number') {
      profileToStore = {
        fid: fcProfile.fid,
        username: fcProfile.username || '',
        displayName: fcProfile.displayName || '',
        pfpUrl: fcProfile.pfpUrl
      };
    } else if (cookieIsAuthenticated && cookieProfile && typeof cookieProfile.fid === 'number') {
      profileToStore = {
        fid: cookieProfile.fid,
        username: cookieProfile.username || '',
        displayName: cookieProfile.displayName || '',
        pfpUrl: cookieProfile.pfpUrl
      };
    }
    if (!profileToStore) return;
    // Only update Zustand if authenticated and user actually changed
    if ((fcIsAuthenticated || cookieIsAuthenticated) && profileToStore && JSON.stringify(zustandUser) !== JSON.stringify(profileToStore)) {
      setUser(profileToStore);
    }
    // Only save to cookies if Farcaster profile is new
    if (fcIsAuthenticated && fcProfile) {
      const profilesAreEqual = cookieProfile &&
        cookieProfile.fid === fcProfile.fid &&
        cookieProfile.username === fcProfile.username &&
        cookieProfile.displayName === fcProfile.displayName &&
        cookieProfile.pfpUrl === fcProfile.pfpUrl;
      if (!profilesAreEqual) {
        console.log('[useAuth] Farcaster authenticated, saving profile to cookies:', fcProfile);
        saveAuth(true, profileToStore);
      }
    }
  }, [fcIsAuthenticated, fcProfile, cookieIsAuthenticated, cookieProfile, saveAuth, setUser, zustandUser]);

  // Function to sign out
  const signOut = () => {
    console.log('[useAuth] signOut called');
    // Clear cookies
    clearAuth();
    console.log('[useAuth] clearAuth called');
    // Clear Zustand user state
    setUser(null);
    console.log('[useAuth] setUser(null) called');
    // Also clear any Farcaster auth state from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farcaster-auth-state');
      console.log('[useAuth] localStorage cleared');
    }
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
