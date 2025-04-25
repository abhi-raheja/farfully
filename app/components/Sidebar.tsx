import { useAppStore } from '../store/useAppStore';
import React, { useState } from 'react';
import ProfileModal from './ProfileModal';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ onAddColumn }: { onAddColumn: () => void }) {
  const user = useAppStore((state) => state.user);
  const [showProfile, setShowProfile] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const { signOut } = useAuth();
  const addColumn = useAppStore((state) => state.addColumn);

  const handleAddColumn = (type: 'feed' | 'profile' | 'notifications' | 'channels' | 'search' | 'directMessages' | 'trending' | 'bookmarks' | 'demo') => {
    let title = '';
    let data = {};

    switch (type) {
      case 'feed':
        title = 'Home Feed';
        data = { feedType: 'home' };
        break;
      case 'profile':
        title = 'My Profile';
        data = { profileType: 'self', fid: user?.fid };
        break;
      case 'notifications':
        title = 'Notifications';
        data = { notificationType: 'all' };
        break;
      case 'channels':
        title = 'Channels';
        data = { channelType: 'subscribed' };
        break;
      case 'search':
        title = 'Search';
        data = { searchType: 'recent' };
        break;
      case 'directMessages':
        title = 'Direct Messages';
        data = { messageType: 'all' };
        break;
      case 'trending':
        title = 'Trending';
        data = { trendingType: 'global' };
        break;
      case 'bookmarks':
        title = 'Bookmarks';
        data = { bookmarkType: 'saved' };
        break;
      default:
        title = `Demo Column ${Math.floor(Math.random() * 1000)}`;
        data = { message: 'This is a placeholder column!' };
    }

    addColumn({
      id: `${type}-${Date.now()}`,
      type,
      title,
      data,
    });

    setShowColumnMenu(false);
  };

  return (
    <>
      <aside className="flex flex-col w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white border-r border-gray-800 p-5">
        {/* Logo */}
        <div className="mb-8 flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Farfully</span>
        </div>

        {/* Profile section */}
        <button
          className="flex items-center gap-3 mb-8 w-full text-left focus:outline-none hover:bg-gray-800/50 rounded-xl p-3 transition-all duration-200 border border-gray-800/50"
          onClick={() => setShowProfile(true)}
        >
          {(user?.pfpUrl || user?.pfp_url) && (
            <div className="relative">
              <img
                src={user.pfpUrl || user.pfp_url}
                alt={user.displayName || user.display_name || user.username}
                className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover shadow-md"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></div>
            </div>
          )}
          <div>
            <div className="font-bold text-lg">{user?.displayName || user?.display_name || user?.username}</div>
            <div className="text-xs text-gray-400">@{user?.username}</div>
          </div>
        </button>

        {/* Add Column Button */}
        <div className="relative mb-8">
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl py-2.5 transition-all duration-200 shadow-md shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Column
          </button>

          {/* Column type menu */}
          {showColumnMenu && (
            <div className="absolute left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-20">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => handleAddColumn('feed')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-blue-500"
                  >
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Feed</div>
                      <div className="text-xs text-gray-400">View your home feed</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('profile')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-purple-500"
                  >
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Profile</div>
                      <div className="text-xs text-gray-400">View user profiles</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('notifications')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-red-500"
                  >
                    <div className="bg-red-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-xs text-gray-400">View your notifications</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('channels')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-green-500"
                  >
                    <div className="bg-green-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Channels</div>
                      <div className="text-xs text-gray-400">Browse channel content</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('search')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-yellow-500"
                  >
                    <div className="bg-yellow-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Search</div>
                      <div className="text-xs text-gray-400">Find casts and users</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('directMessages')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-indigo-500"
                  >
                    <div className="bg-indigo-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Direct Messages</div>
                      <div className="text-xs text-gray-400">Private conversations</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('trending')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-pink-500"
                  >
                    <div className="bg-pink-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Trending</div>
                      <div className="text-xs text-gray-400">Popular casts and topics</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('bookmarks')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-teal-500"
                  >
                    <div className="bg-teal-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Bookmarks</div>
                      <div className="text-xs text-gray-400">Saved casts</div>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAddColumn('demo')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-3 border-l-4 border-gray-500"
                  >
                    <div className="bg-gray-500 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Demo Column</div>
                      <div className="text-xs text-gray-400">Add a placeholder column</div>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Navigation</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.69-.1-1.02A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Boards
              </a>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="border-t border-gray-800 pt-4 flex flex-col gap-2">
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-gray-400 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V8z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
