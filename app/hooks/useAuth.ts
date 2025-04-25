'use client';

import { useEffect, useRef } from 'react';
import { useProfile } from '../components/FarcasterAuthKit';
import { usePersistentAuth, StoredProfile } from './usePersistentAuth';
import { useAppStore } from '../store/useAppStore';
import { fetchNeynarProfile } from '../utils/fetchNeynarProfile';
import { fetchServerProfile } from '../utils/fetchServerProfile';
import { fetchMcpProfile } from '../utils/fetchMcpProfile';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

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
  
  // Ref to track if we're currently fetching the profile
  const isFetchingProfile = useRef(false);
  // Ref to track if we've already fetched the rich profile
  const hasRichProfile = useRef(false);

  useEffect(() => {
    // Only proceed if authenticated and profile is valid
    let profileToStore = null;
    if (fcIsAuthenticated && fcProfile && typeof fcProfile.fid === 'number') {
      profileToStore = fcProfile;
    } else if (cookieIsAuthenticated && cookieProfile && typeof cookieProfile.fid === 'number') {
      profileToStore = cookieProfile;
    }
    if (!profileToStore) return;

    // Try to fetch the full Neynar profile if FID is available
    const fetchFullProfile = async () => {
      // Check if we're already fetching or have a rich profile
      if (isFetchingProfile.current) {
        console.log('[useAuth] Already fetching profile, skipping');
        return;
      }
      
      // Check if we already have a rich profile with follower/following counts
      if (hasRichProfile.current && zustandUser && 
          zustandUser.follower_count !== undefined && 
          zustandUser.following_count !== undefined) {
        console.log('[useAuth] Already have rich profile, skipping fetch');
        return;
      }
      
      // Set fetching flag
      isFetchingProfile.current = true;
      
      if (profileToStore.fid) {
        console.log('[useAuth] Fetching rich profile for FID:', profileToStore.fid);
        
        // Try the MCP server first (most reliable method)
        try {
          console.log('[useAuth] Trying MCP server fetch...');
          const richProfile = await fetchMcpProfile(profileToStore.fid);
          console.log('[useAuth] MCP fetch successful!');
          console.log('[useAuth] Rich profile data keys:', Object.keys(richProfile));
          console.log('[useAuth] Has follower_count:', richProfile.follower_count !== undefined);
          console.log('[useAuth] Has following_count:', richProfile.following_count !== undefined);
          console.log('[useAuth] Has verified_accounts:', !!richProfile.verified_accounts);
          
          // Store the rich profile in Zustand
          setUser(richProfile);
          // Mark that we have a rich profile
          hasRichProfile.current = true;
          // Reset fetching flag
          isFetchingProfile.current = false;
          return; // Exit early if successful
        } catch (mcpError) {
          console.warn('[useAuth] MCP fetch failed:', mcpError);
          // Continue to fallback methods
        }
        
        // Make direct fetch to our server-side API route as fallback
        try {
          console.log('[useAuth] Falling back to server API route...');
          const response = await fetch(`/api/neynar/profile?fid=${profileToStore.fid}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache, no-store'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              console.log('[useAuth] Server API fetch successful!');
              console.log('[useAuth] Rich profile data keys:', Object.keys(data.user));
              setUser(data.user);
              hasRichProfile.current = true;
              isFetchingProfile.current = false;
              return; // Exit early if successful
            } else {
              console.warn('[useAuth] Server API response missing user data:', data);
            }
          } else {
            console.warn('[useAuth] Server API fetch failed:', response.status, response.statusText);
          }
        } catch (serverError) {
          console.warn('[useAuth] Server API fetch error:', serverError);
        }
        
        // Try the utility functions as additional fallbacks
        try {
          console.log('[useAuth] Trying fetchServerProfile utility...');
          const richProfile = await fetchServerProfile(profileToStore.fid);
          console.log('[useAuth] fetchServerProfile successful!');
          setUser(richProfile);
          hasRichProfile.current = true;
          isFetchingProfile.current = false;
          return; // Exit early if successful
        } catch (serverError) {
          console.warn('[useAuth] fetchServerProfile failed:', serverError);
        }

        // Try client-side fetch as a last resort
        if (NEYNAR_API_KEY) {
          try {
            console.log('[useAuth] Last resort: client-side fetch...');
            const richProfile = await fetchNeynarProfile(profileToStore.fid, NEYNAR_API_KEY);
            console.log('[useAuth] Client-side fetch successful!');
            setUser(richProfile);
            hasRichProfile.current = true;
            isFetchingProfile.current = false;
            return; // Exit early if successful
          } catch (e) {
            console.warn('[useAuth] Client-side fetch failed:', e);
          }
        }

        // If all fetch attempts failed, use the basic profile
        console.log('[useAuth] All fetch attempts failed, using basic profile');
        setUser(profileToStore);
      } else {
        console.log('[useAuth] No FID available, using basic profile');
        setUser(profileToStore);
      }
      
      // Always reset the fetching flag at the end
      isFetchingProfile.current = false;
    };

    // Always attempt to fetch the rich Neynar profile after authentication
    fetchFullProfile();

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
