/**
 * Core data models for Farcaster API
 */

export interface User {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}

export interface Cast {
  id: string;
  text: string;
  author: User;
  timestamp: number;
  replyTo?: string;
  recastCount: number;
  likeCount: number;
  replyCount: number;
  hasLiked: boolean;
  hasRecasted: boolean;
  embeds?: Embed[];
  mentions?: User[];
}

export interface Embed {
  type: 'image' | 'link' | 'cast' | 'nft';
  url: string;
  previewImageUrl?: string;
  title?: string;
  description?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Draft {
  id: string;
  text: string;
  embeds?: Embed[];
  createdAt: number;
  updatedAt: number;
  scheduledFor?: Date;
  inReplyTo?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface ColumnConfig {
  id: string;
  type: 'home' | 'user' | 'search' | 'notifications' | 'bookmarks';
  title: string;
  params?: {
    username?: string;
    searchQuery?: string;
  };
  width: number;
  position: number;
  settings: {
    showReplies: boolean;
    showReposts: boolean;
    autoRefresh: boolean;
    refreshInterval?: number;
  };
} 