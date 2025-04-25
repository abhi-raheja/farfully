"use client";

import Image from "next/image";
import LoginButton from './components/LoginButton';
import FeedColumn from './components/FeedColumn';
import UserProfileColumn from './components/UserProfileColumn';
import { FarcasterAuthKitProvider } from './components/FarcasterAuthKit';
import { useAuth } from './hooks/useAuth';

function HomeContent() {
  const { isAuthenticated, profile } = useAuth();
  
  // Debug the profile object to understand its structure
  console.log('Profile from useAuth:', profile);
  
  // Extract FID from profile if available
  // The profile structure might vary based on the auth provider
  const userFid = profile ? (profile as any).fid : undefined;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Farfully</h1>
          <LoginButton />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex justify-center mb-12">
          {isAuthenticated && userFid ? (
            <UserProfileColumn fid={userFid} />
          ) : (
            <div className="flex items-center justify-center h-64 text-lg text-gray-500 border rounded-lg bg-white dark:bg-zinc-900 w-full max-w-md shadow">
              Log in to view your profile.
            </div>
          )}
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Farcaster TweetDeck + Typefully</h2>
          <p className="text-xl text-gray-600 mb-12">
            A powerful client for Farcaster that combines TweetDeck-like views with post scheduling.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Multi-column View</h3>
              <p className="text-gray-600">
                Customize your Farcaster experience with multiple columns. View your home feed, notifications, and user profiles all at once.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Post Scheduling</h3>
              <p className="text-gray-600">
                Write and schedule your casts for later. Perfect for planning content and maintaining a consistent presence.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-gray-600">
                Stay up to date with live updates to your feeds. Never miss an important cast again.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Enhanced Composing</h3>
              <p className="text-gray-600">
                Enjoy a rich editing experience with support for media attachments, thread creation, and more.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2023 Farfully. A TweetDeck-like client for Farcaster.</p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <FarcasterAuthKitProvider>
      <HomeContent />
    </FarcasterAuthKitProvider>
  );
}
