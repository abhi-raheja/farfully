'use client';

import { useAuth } from '../hooks/useAuth';
import { SignInButton } from '@farcaster/auth-kit';

export default function LoginButton() {
  const { isAuthenticated, profile, signOut } = useAuth();

  if (isAuthenticated && profile) {
    return (
      <div className="flex items-center gap-2">
        {profile.pfpUrl && (
          <img
            src={profile.pfpUrl}
            alt={profile.displayName || profile.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="font-medium">{profile.displayName || profile.username}</span>
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