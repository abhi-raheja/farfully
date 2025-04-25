'use client';

import { useAuth } from '../hooks/useAuth';
import { SignInButton } from '@farcaster/auth-kit';

export default function LoginButton() {
  // Our improved useAuth hook now handles both live and stored profiles
  // Use type assertion to help TypeScript understand the return type
  const { isAuthenticated, profile, signOut } = useAuth() as {
    isAuthenticated: boolean;
    profile: any;
    signOut: () => void;
  };

  // Show authenticated UI if we have a profile
  if (isAuthenticated && profile) {
    // Debug the profile structure
    console.log('Auth profile for button:', profile);
    return (
      <div className="flex items-center gap-2">
        {profile?.pfpUrl && (
          <img
            src={profile.pfpUrl}
            alt={profile.displayName || profile.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="font-medium">{profile?.displayName || profile?.username}</span>
        <button
          onClick={signOut}
          className="rounded-full bg-red-100 text-red-600 px-3 py-1 text-sm font-medium hover:bg-red-200 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return <SignInButton />;
}