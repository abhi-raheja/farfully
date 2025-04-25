"use client";

import Image from "next/image";
import LoginButton from './components/LoginButton';
import { FarcasterAuthKitProvider } from './components/FarcasterAuthKit';
import { useAuth } from './hooks/useAuth';
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import { useAppStore } from './store/useAppStore';
import ProfileModal from './components/ProfileModal';
import { useState, useEffect } from 'react';

function HomeContent() {
  // Our improved useAuth hook now handles both live and stored profiles
  const { isAuthenticated, profile } = useAuth();
  const addColumn = useAppStore((state) => state.addColumn);
  const columns = useAppStore((state) => state.columns);
  const user = useAppStore((state) => state.user);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Initialize columns when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.fid && columns.length === 0) {
      // Add default columns for a new user
      addColumn({
        id: `feed-${Date.now()}`,
        type: 'feed',
        title: 'Home Feed',
        data: { feedType: 'home' }
      });
      
      addColumn({
        id: `profile-${Date.now()}`,
        type: 'profile',
        title: 'My Profile',
        data: { fid: user.fid }
      });
    }
  }, [isAuthenticated, user, addColumn, columns.length]);

  // Only show the board UI if authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Farfully</h2>
          <p className="text-gray-400 mb-6">Sign in to start using your TweetDeck-style board.</p>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar onAddColumn={() => {
        addColumn({
          id: `demo-${Date.now()}`,
          type: 'demo',
          title: `Demo Column ${Math.floor(Math.random()*1000)}`,
          data: { message: 'Another placeholder column!' }
        });
      }} />
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Board />
      </div>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-800">
            <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration errors
  }

  return (
    <FarcasterAuthKitProvider>
      <HomeContent />
    </FarcasterAuthKitProvider>
  );
}
