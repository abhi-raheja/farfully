import { useAppStore } from '../store/useAppStore';
import { Column as ColumnType } from '../store/useAppStore';
import { useState } from 'react';

interface ColumnProps {
  column: ColumnType;
  index: number;
}

export default function Column({ column, index }: ColumnProps) {
  const removeColumn = useAppStore((state) => state.removeColumn);
  const moveColumn = useAppStore((state) => state.moveColumn);
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle column refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading for demo purposes
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Get column header color based on type
  const getColumnColor = () => {
    switch (column.type) {
      case 'feed':
        return 'bg-gradient-to-r from-blue-600 to-blue-500';
      case 'profile':
        return 'bg-gradient-to-r from-purple-600 to-purple-500';
      case 'notifications':
        return 'bg-gradient-to-r from-red-600 to-red-500';
      case 'channels':
        return 'bg-gradient-to-r from-green-600 to-green-500';
      case 'search':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-500';
      case 'directMessages':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-500';
      case 'trending':
        return 'bg-gradient-to-r from-pink-600 to-pink-500';
      case 'bookmarks':
        return 'bg-gradient-to-r from-teal-600 to-teal-500';
      default:
        return 'bg-gradient-to-r from-gray-700 to-gray-600';
    }
  };

  // Get column icon based on type
  const getColumnIcon = () => {
    switch (column.type) {
      case 'feed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      case 'profile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'notifications':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'channels':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
          </svg>
        );
      case 'search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        );
      case 'directMessages':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );
      case 'trending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        );
      case 'bookmarks':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg min-w-[320px] max-w-[320px] h-[calc(100vh-120px)] shadow-lg border border-gray-700 overflow-hidden">
      {/* Column header */}
      <div className={`p-4 flex justify-between items-center ${getColumnColor()}`}>
        <div className="flex items-center gap-2">
          <div className="bg-white bg-opacity-20 p-1.5 rounded-md">
            {getColumnIcon()}
          </div>
          <h2 className="text-white font-semibold">{column.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="text-white opacity-70 hover:opacity-100 p-1.5 rounded-md hover:bg-black hover:bg-opacity-20"
            title="Refresh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Options button */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-white opacity-70 hover:opacity-100 p-1.5 rounded-md hover:bg-black hover:bg-opacity-20"
              title="Column options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {/* Options dropdown */}
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-20">
                <ul className="py-1">
                  {index > 0 && (
                    <li>
                      <button 
                        onClick={() => {
                          moveColumn(index, index - 1);
                          setShowOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Move left
                      </button>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={() => {
                        moveColumn(index, index + 1);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Move right
                    </button>
                  </li>
                  <li className="border-t border-gray-700">
                    <button 
                      onClick={() => {
                        removeColumn(column.id);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove column
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Column content */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-2">
        {/* Placeholder content - will be replaced with actual content */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-300">User Name</div>
                    <div className="text-xs text-gray-500">@username</div>
                    <div className="text-xs text-gray-500">· 2h</div>
                  </div>
                  <p className="text-gray-400 mt-1 text-sm">
                    This is a placeholder for {column.type} content. It will be replaced with real data in the future.
                  </p>
                  <div className="flex items-center gap-6 mt-3">
                    <button className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>42</span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                      <span>12</span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
