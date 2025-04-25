"use client";

import React, { useEffect, useState } from "react";
import { farcasterApi } from "../services/farcasterApi";
import { Cast } from "../types/farcaster";

interface FeedColumnProps {
  title: string;
  type?: "home" | "user";
  username?: string;
}

export default function FeedColumn({ title, type = "home", username }: FeedColumnProps) {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchFeed = async () => {
      try {
        let data: Cast[] = [];
        if (type === "user" && username) {
          data = await farcasterApi.getUserFeed(username);
        } else {
          data = await farcasterApi.getHomeFeed();
        }
        setCasts(data);
      } catch (e: any) {
        setError(e.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [type, username]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow flex flex-col min-w-[350px] max-w-[400px] h-full overflow-y-auto border border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-lg sticky top-0 bg-white dark:bg-zinc-900 z-10">{title}</div>
      {loading && <div className="p-4 text-gray-500">Loading...</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-2 p-4">
          {casts.length === 0 ? (
            <div className="text-gray-400">No posts found.</div>
          ) : (
            casts.map((cast) => (
              <div key={cast.id} className="bg-zinc-50 dark:bg-zinc-800 rounded-md p-3 flex flex-col gap-1 border border-zinc-100 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-1">
                  <img src={cast.author.profileImageUrl} alt={cast.author.displayName || cast.author.username} className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{cast.author.displayName || cast.author.username}</span>
                    <span className="text-xs text-gray-500">@{cast.author.username}</span>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">{new Date(cast.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm whitespace-pre-line">{cast.text}</div>
                {cast.embeds && cast.embeds.map((embed, i) => (
                  embed.type === "image" ? (
                    <img key={i} src={embed.url} alt="embed" className="mt-2 rounded max-h-48" />
                  ) : embed.type === "link" && embed.url ? (
                    <a key={i} href={embed.url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline truncate">
                      {embed.title || embed.url}
                    </a>
                  ) : null
                ))}
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>💬 {cast.replyCount}</span>
                  <span>🔁 {cast.recastCount}</span>
                  <span>❤️ {cast.likeCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
