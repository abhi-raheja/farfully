import { useAppStore } from '../store/useAppStore';
import Column from './Column';
import { useState } from 'react';

export default function Board() {
  const columns = useAppStore((state) => state.columns);
  const addColumn = useAppStore((state) => state.addColumn);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  
  // Function to add a new column
  const handleAddColumn = (type: 'feed' | 'profile' | 'notifications' | 'demo') => {
    let title = '';
    let data = {};
    
    switch (type) {
      case 'feed':
        title = 'Home Feed';
        data = { feedType: 'home' };
        break;
      case 'profile':
        title = 'Profile';
        data = { profileType: 'self' };
        break;
      case 'notifications':
        title = 'Notifications';
        data = { notificationType: 'all' };
        break;
      default:
        title = `Demo Column ${Math.floor(Math.random()*1000)}`;
        data = { message: 'This is a placeholder column!' };
    }
    
    addColumn({
      id: `${type}-${Date.now()}`,
      type,
      title,
      data
    });
    
    setShowColumnMenu(false);
  };
  
  return (
    <div className="h-screen bg-gray-950 overflow-hidden flex flex-col">
      {/* Board header with controls */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-white">Your Board</h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Column
          </button>
          
          {/* Column type menu */}
          {showColumnMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-20">
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
      </div>
      
      {/* Columns container */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 h-full">
          {columns.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              <p className="text-xl font-medium mb-2">Your board is empty</p>
              <p className="text-sm mb-6">Add columns to customize your Farcaster experience</p>
              <button 
                onClick={() => setShowColumnMenu(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Your First Column
              </button>
            </div>
          ) : (
            columns.map((col, idx) => (
              <Column key={col.id} column={col} index={idx} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
