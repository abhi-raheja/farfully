'use client';

import React, { useEffect, useState } from 'react';
import { AuthKitProvider, useProfile, useAuthKit, SignInButton } from '@farcaster/auth-kit';

// Configure Auth Kit with persistence enabled
const config = {
  // Domain that will be verified by the user's wallet when authenticating with Warpcast
  domain: process.env.NEXT_PUBLIC_FARCASTER_AUTH_DOMAIN || 'farfully.example.com',
  // URL to your app
  siweUri: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  // Enable persistent authentication with relay
  relay: 'https://relay.farcaster.xyz',
  // Version of the SIWE message
  version: 'v1',
};

// Wrapper component that provides AuthKit
export function FarcasterAuthKitProvider({ children }: { children: React.ReactNode }) {
  console.log('[FarcasterAuthKitProvider] Mounted');
  // Flag to track if we're in browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  // Only render AuthKit on the client
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  if (!isBrowser) {
    return <>{children}</>;
  }
  
  // You could also add more logging here if you have access to AuthKit's context or state
  return (
    <AuthKitProvider config={config}>
      {children}
    </AuthKitProvider>
  );
}

// Export useProfile as our authentication hook
export { useProfile };

export default function FarcasterAuthButton() {
  const { isAuthenticated, profile } = useProfile();

  // No loading state from useProfile, we can handle this differently if needed

  if (isAuthenticated && profile) {
    return (
      <div className="flex items-center gap-2">
        <img
          src={profile.pfpUrl || ''}
          alt={profile.displayName || profile.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{profile.displayName || profile.username}</span>
      </div>
    );
  }

  return (
    <SignInButton />
  );
} 