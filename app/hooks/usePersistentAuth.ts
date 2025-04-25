'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Type for the stored profile
export interface StoredProfile {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

// Cookie names
const AUTH_COOKIE = 'farfully-auth';
const PROFILE_COOKIE = 'farfully-profile';

console.log('[usePersistentAuth] Loaded hook');

// Hook to handle persistent authentication state
export function usePersistentAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from cookies on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      // Check for auth cookie
      const authCookie = Cookies.get(AUTH_COOKIE);
      if (authCookie === 'true') {
        setIsAuthenticated(true);
        console.log('[usePersistentAuth] Auth cookie found, user is authenticated.');
        // Try to get profile data
        const profileCookie = Cookies.get(PROFILE_COOKIE);
        if (profileCookie) {
          const profileData = JSON.parse(profileCookie);
          setProfile(profileData);
          console.log('[usePersistentAuth] Restored profile from cookies:', profileData);
        } else {
          console.log('[usePersistentAuth] No profile cookie found.');
        }
      } else {
        console.log('[usePersistentAuth] No auth cookie found, user is not authenticated.');
      }
    } catch (error) {
      console.error('Error loading auth from cookies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save authentication state to cookies
  const saveAuth = (authenticated: boolean, profileData: StoredProfile | null) => {
    if (typeof window === 'undefined') return;

    try {
      if (authenticated && profileData) {
        // Set cookies with 7-day expiration
        Cookies.set(AUTH_COOKIE, 'true', { expires: 7 });
        Cookies.set(PROFILE_COOKIE, JSON.stringify(profileData), { expires: 7 });
        console.log('[usePersistentAuth] Saved auth to cookies:', profileData);
        // Update state
        setIsAuthenticated(true);
        setProfile(profileData);
      } else {
        // Clear cookies
        Cookies.remove(AUTH_COOKIE);
        Cookies.remove(PROFILE_COOKIE);
        console.log('[usePersistentAuth] Cleared auth cookies.');
        // Update state
        setIsAuthenticated(false);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error saving auth to cookies:', error);
    }
  };

  // Clear authentication state
  const clearAuth = () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Remove cookies
      Cookies.remove(AUTH_COOKIE);
      Cookies.remove(PROFILE_COOKIE);
      console.log('[usePersistentAuth] Cleared auth cookies via clearAuth.');
      // Update state
      setIsAuthenticated(false);
      setProfile(null);
    } catch (error) {
      console.error('Error clearing auth cookies:', error);
    }
  };

  return {
    isAuthenticated,
    profile,
    isLoading,
    saveAuth,
    clearAuth
  };
}
