"use client";

import React, { useEffect, useState } from "react";
import { neynarFetch } from "../services/neynarClient";

interface UserProfile {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: { bio: { text: string } };
  follower_count: number;
  following_count: number;
}

export default function UserProfileColumn({ fid }: { fid: number }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    neynarFetch('/user/bulk', { fids: fid })
      .then((data) => {
        if (data.users && data.users.length > 0) {
          setProfile(data.users[0]);
        } else {
          setError('User not found.');
        }
      })
      .catch((e) => {
        setError(e.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [fid]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow flex flex-col min-w-[350px] max-w-[400px] h-full overflow-y-auto border border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-lg sticky top-0 bg-white dark:bg-zinc-900 z-10">
        Profile
      </div>
      {loading && <div className="p-4 text-gray-500">Loading...</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}
      {!loading && !error && profile && (
        <div className="flex flex-col items-center gap-4 p-6">
          <img
            src={profile.pfp_url}
            alt={profile.display_name || profile.username}
            className="w-24 h-24 rounded-full border-4 border-purple-200"
          />
          <div className="text-xl font-bold">{profile.display_name || profile.username}</div>
          <div className="text-gray-500">@{profile.username}</div>
          <div className="text-center text-gray-700 dark:text-gray-300 mb-2">{profile.profile?.bio?.text}</div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span><b>{profile.follower_count}</b> Followers</span>
            <span><b>{profile.following_count}</b> Following</span>
          </div>
          <a
            href={`https://warpcast.com/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-purple-600 underline"
          >
            View on Warpcast
          </a>
        </div>
      )}
    </div>
  );
}
