import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sampleProfileData } from '../utils/sampleProfileData';
import { enrichProfileData } from '../utils/enrichProfileData';

export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAppStore((state) => state.user);
  // Add state for debug mode toggle
  const [useDebugData, setUseDebugData] = useState(false);
  
  if (!open || !user) return null;

  // Determine which data to use - real user data or sample data
  // If using real data, don't enrich it with sample data (strict mode = true)
  const displayData = useDebugData 
    ? sampleProfileData 
    : enrichProfileData(user as any, true); // Use strict mode to only show real data
  
  // Log the data being used
  console.log('[ProfileModal] Using debug mode:', useDebugData);
  console.log('[ProfileModal] Display data:', displayData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative text-white">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close profile"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-4">
          <img
            src={displayData.pfpUrl || displayData.pfp_url}
            alt={displayData.displayName || displayData.display_name || displayData.username}
            className="w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
          />
          <div className="text-2xl font-bold">{displayData.displayName || displayData.display_name || displayData.username}</div>
          <div className="text-gray-400 text-sm">@{displayData.username}</div>
          <div className="text-xs text-gray-500 mb-2">FID: {displayData.fid}</div>

          {/* Bio (support both camelCase and snake_case) */}
          {(displayData.bio || displayData.profile?.bio?.text)
            ? (<div className="text-center text-gray-300 mt-2 mb-2">{displayData.bio || displayData.profile?.bio?.text}</div>)
            : (<div className="text-center text-gray-600 mt-2 mb-2">No bio found</div>)}

          {/* Followers/Following (support both camelCase and snake_case) */}
          <div className="flex gap-6 mt-2 mb-2">
            {typeof displayData.follower_count === 'number'
              ? (<div><span className="font-bold">{displayData.follower_count}</span><span className="text-gray-400 text-xs ml-1">Followers</span></div>)
              : (<div className="text-gray-600 text-xs">No follower count</div>)}
            {typeof displayData.following_count === 'number'
              ? (<div><span className="font-bold">{displayData.following_count}</span><span className="text-gray-400 text-xs ml-1">Following</span></div>)
              : (<div className="text-gray-600 text-xs">No following count</div>)}
          </div>

          {/* Linked Accounts (support both camelCase and snake_case) */}
          {(displayData.verified_accounts && Array.isArray(displayData.verified_accounts) && displayData.verified_accounts.length > 0)
            ? (<div className="mt-2">
                <div className="font-semibold text-sm text-gray-400 mb-1">Linked Accounts</div>
                {displayData.verified_accounts.map((acc: any, i: number) => (
                  <div key={i} className="text-gray-200 text-sm">
                    {acc.platform === 'x'
                      ? (<><span className="font-bold">X (Twitter):</span> @{acc.username}</>)
                      : (<><span className="font-bold">{acc.platform}:</span> {acc.username}</>)}
                  </div>
                ))}
              </div>)
            : (<div className="text-gray-600 text-xs">No linked accounts</div>)}

          {/* Location (support both camelCase and snake_case) */}
          {(displayData.location?.address?.city || displayData.profile?.location?.address?.city)
            ? (<div className="mt-2 text-gray-400 text-xs">
                <span className="font-semibold">Location:</span> {displayData.location?.address?.city || displayData.profile?.location?.address?.city}, {displayData.location?.address?.state_code?.toUpperCase() || displayData.profile?.location?.address?.state_code?.toUpperCase()}, {displayData.location?.address?.country || displayData.profile?.location?.address?.country}
              </div>)
            : (<div className="text-gray-600 text-xs">No location found</div>)}

          {/* Verified ETH Addresses (support both camelCase and snake_case) */}
          {(displayData.verified_addresses?.eth_addresses && Array.isArray(displayData.verified_addresses.eth_addresses) && displayData.verified_addresses.eth_addresses.length > 0)
            ? (<div className="mt-2">
                <div className="font-semibold text-sm text-gray-400 mb-1">Verified ETH Addresses</div>
                {displayData.verified_addresses.eth_addresses.map((addr: string, i: number) => (
                  <div key={i} className="text-gray-200 text-xs">{addr}</div>
                ))}
              </div>)
            : (<div className="text-gray-600 text-xs">No verified ETH addresses</div>)}
          
          {/* Debug buttons removed now that everything is working correctly */}
        </div>
      </div>
    </div>
  );
}
