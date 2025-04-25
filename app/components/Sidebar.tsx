import { useAppStore } from '../store/useAppStore';
import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ onAddColumn }: { onAddColumn: () => void }) {
  const user = useAppStore((state) => state.user);
  const [showProfile, setShowProfile] = useState(false);
  const { signOut } = useAuth();
  return (
    <>
      <aside className="flex flex-col w-64 h-screen bg-gray-950 text-white border-r border-gray-800 p-4">
        {/* Profile section */}
        <button
          className="flex items-center gap-3 mb-8 w-full text-left focus:outline-none hover:bg-gray-900 rounded-lg p-2 transition-colors"
          onClick={() => setShowProfile(true)}
        >
          {(user?.pfpUrl || user?.pfp_url) && (
            <img 
              src={user.pfpUrl || user.pfp_url} 
              alt={user.displayName || user.display_name || user.username} 
              className="w-12 h-12 rounded-full border border-gray-700" 
            />
          )}
          <div>
            <div className="font-bold text-lg">{user?.displayName || user?.display_name || user?.username}</div>
            <div className="text-xs text-gray-400">@{user?.username}</div>
          </div>
        </button>
      {/* Actions */}
      <button
        onClick={onAddColumn}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 mb-6 transition-colors"
      >
        + Add column
      </button>
      {/* Decks (mock) */}
      <div className="flex-1">
        <div className="uppercase text-xs text-gray-400 mb-2">Decks</div>
        <div className="bg-gray-900 rounded-lg px-3 py-2 mb-2 flex items-center justify-between">
          <span className="font-medium">Personal</span>
          <span className="text-yellow-400">★</span>
        </div>
        {/* Add more decks here in the future */}
      </div>
      <button
        onClick={signOut}
        className="mt-auto w-full bg-gray-800 hover:bg-red-600 text-white font-semibold rounded-lg py-2 transition-colors mb-2"
      >
        Logout
      </button>
    </aside>
    <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
