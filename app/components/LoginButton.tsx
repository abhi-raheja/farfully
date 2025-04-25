'use client';

import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/useAppStore';
import { SignInButton } from '@farcaster/auth-kit';

export default function LoginButton() {
  // Our improved useAuth hook now handles both live and stored profiles
  // Use type assertion to help TypeScript understand the return type
  const { isAuthenticated, signOut } = useAuth();
  const user = useAppStore((state) => state.user);

  console.log('Auth profile for button:', user);
  if (isAuthenticated && user) {
    // Debug the profile structure
    console.log('Auth profile for button:', user);
    return (
      <div className="flex items-center gap-2">
        {user?.pfpUrl && (
          <img
            src={user.pfpUrl}
            alt={user.displayName || user.username}
            className="w-8 h-8 rounded-full border border-gray-600"
          />
        )}
        <span className="font-semibold text-sm">
          {user?.displayName || user?.username}
        </span>
        <button
          onClick={() => {
            console.log('Logout button clicked');
            signOut();
          }}
          className="rounded-full bg-red-100 text-red-600 px-3 py-1 text-sm font-medium hover:bg-red-200 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return <SignInButton />;
}