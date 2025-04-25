import { User, Cast, Embed } from '../types/farcaster';
import { neynarFetch } from './neynarClient';

/**
 * Enum definition for feed types (since we can't properly import from Neynar)
 */
enum FeedType {
  Following = 'following',
  ForYou = 'for-you'
}

/**
 * Mock data for development
 */
const MOCK_USERS: User[] = [
  {
    id: 'user1',
    username: 'alice',
    displayName: 'Alice',
    profileImageUrl: 'https://i.pravatar.cc/150?u=alice',
    bio: 'Crypto enthusiast. Builder. Love Web3.',
    followerCount: 2480,
    followingCount: 753,
    isFollowing: true,
    isFollowedBy: false,
  },
  {
    id: 'user2',
    username: 'bob',
    displayName: 'Bob',
    profileImageUrl: 'https://i.pravatar.cc/150?u=bob',
    bio: 'Software engineer. Working on decentralized systems.',
    followerCount: 1254,
    followingCount: 421,
    isFollowing: false,
    isFollowedBy: true,
  },
  {
    id: 'user3',
    username: 'carol',
    displayName: 'Carol',
    profileImageUrl: 'https://i.pravatar.cc/150?u=carol',
    bio: 'Designer and product manager. Focus on UX.',
    followerCount: 3657,
    followingCount: 892,
    isFollowing: true,
    isFollowedBy: true,
  },
];

const MOCK_CASTS: Cast[] = [
  {
    id: 'cast1',
    text: 'Just deployed my new dApp on Optimism! Check it out: optimism-dapp.xyz',
    author: MOCK_USERS[0],
    timestamp: Date.now() - 3600000, // 1 hour ago
    recastCount: 12,
    likeCount: 34,
    replyCount: 5,
    hasLiked: false,
    hasRecasted: true,
    embeds: [
      {
        type: 'link',
        url: 'https://optimism-dapp.xyz',
        previewImageUrl: 'https://picsum.photos/800/400',
        title: 'My Optimism dApp',
        description: 'A decentralized application built on Optimism',
      },
    ],
  },
  {
    id: 'cast2',
    text: 'Working on a new protocol for decentralized social media. Looking for alpha testers!',
    author: MOCK_USERS[1],
    timestamp: Date.now() - 7200000, // 2 hours ago
    recastCount: 8,
    likeCount: 21,
    replyCount: 3,
    hasLiked: true,
    hasRecasted: false,
  },
  {
    id: 'cast3',
    text: 'Just released my NFT collection. Limited edition of 1000 pieces.',
    author: MOCK_USERS[2],
    timestamp: Date.now() - 10800000, // 3 hours ago
    recastCount: 15,
    likeCount: 42,
    replyCount: 7,
    hasLiked: true,
    hasRecasted: true,
    embeds: [
      {
        type: 'image',
        url: 'https://picsum.photos/800/800',
        dimensions: {
          width: 800,
          height: 800,
        },
      },
    ],
  },
  {
    id: 'cast4',
    text: 'Replying to @alice: Nice project! How long did it take to build?',
    author: MOCK_USERS[1],
    timestamp: Date.now() - 3500000, // A bit after cast1
    replyTo: 'cast1',
    recastCount: 0,
    likeCount: 2,
    replyCount: 1,
    hasLiked: false,
    hasRecasted: false,
  },
];

/**
 * Helper function to convert Neynar cast to our internal Cast type
 */
const convertNeynarCast = (neynarCast: any): Cast => {
  const author: User = {
    id: neynarCast.author.fid.toString(),
    username: neynarCast.author.username || '',
    displayName: neynarCast.author.display_name || neynarCast.author.username || '',
    profileImageUrl: neynarCast.author.pfp_url || '',
    bio: neynarCast.author.profile?.bio?.text || '',
    followerCount: neynarCast.author.follower_count || 0,
    followingCount: neynarCast.author.following_count || 0,
    isFollowing: neynarCast.author.viewer_context?.following || false,
    isFollowedBy: neynarCast.author.viewer_context?.followed_by || false,
  };

  const embeds: Embed[] = (neynarCast.embeds || []).map((embed: any) => {
    if (embed.url) {
      return {
        type: 'link',
        url: embed.url,
        previewImageUrl: embed.image_url || '',
        title: embed.title || '',
        description: embed.description || '',
      };
    } else if (embed.image_url) {
      return {
        type: 'image',
        url: embed.image_url,
        dimensions: embed.dimensions || { width: 0, height: 0 },
      };
    } else {
      return {
        type: 'link',
        url: '',
      };
    }
  });

  return {
    id: neynarCast.hash,
    text: neynarCast.text || '',
    author,
    timestamp: new Date(neynarCast.timestamp || Date.now()).getTime(),
    replyTo: neynarCast.parent_hash || undefined,
    recastCount: neynarCast.reactions.recasts.count || 0,
    likeCount: neynarCast.reactions.likes.count || 0,
    replyCount: neynarCast.replies.count || 0,
    hasLiked: neynarCast.reactions.likes.self || false,
    hasRecasted: neynarCast.reactions.recasts.self || false,
    embeds: embeds.length > 0 ? embeds : undefined,
    mentions: neynarCast.mentions ? neynarCast.mentions.map((mention: any) => ({
      id: mention.fid.toString(),
      username: mention.username || '',
      displayName: mention.display_name || mention.username || '',
      profileImageUrl: mention.pfp_url || '',
      followerCount: 0,
      followingCount: 0,
    })) : undefined,
  };
};

/**
 * Main Farcaster API client class
 * This implementation uses both mock data and real Neynar API
 */
class FarcasterApi {
  private useNeynar: boolean;
  
  constructor() {
    this.useNeynar = process.env.NEXT_PUBLIC_USE_NEYNAR === 'true';
    console.log('[FarcasterApi] NEXT_PUBLIC_USE_NEYNAR:', process.env.NEXT_PUBLIC_USE_NEYNAR, 'useNeynar:', this.useNeynar);
  }
  
  // Simulate API delay for mock data
  private async delay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Feed-related methods
  async getHomeFeed(): Promise<Cast[]> {
    if (this.useNeynar) {
      try {
        // Use Neynar REST API
        const response = await neynarFetch('/feed', {
          feed_type: 'following',
          limit: 25,
        });
        return response.casts.map(convertNeynarCast);
      } catch (error) {
        console.error('[FarcasterApi] Error fetching home feed from Neynar:', error);
        await this.delay();
        return [...MOCK_CASTS]; // Fallback to mock data
      }
    } else {
      await this.delay();
      return [...MOCK_CASTS];
    }
  }
  
  async getUserFeed(username: string): Promise<Cast[]> {
    if (this.useNeynar) {
      try {
        // First get the FID by username
        const user = await this.getUserProfile(username);
        if (!user) return [];
        
        // Using castsByFid to fetch user casts
        const fid = Number(user.id);
        // Mock implementation as this is complex to implement with the current SDK
        await this.delay();
        return MOCK_CASTS.filter(cast => cast.author.id === user.id);
      } catch (error) {
        console.error(`Error fetching user feed for ${username}:`, error);
        
        // Fallback to mock data
        await this.delay();
        const user = MOCK_USERS.find(u => u.username === username);
        if (!user) return [];
        
        return MOCK_CASTS.filter(cast => cast.author.id === user.id);
      }
    } else {
      await this.delay();
      const user = MOCK_USERS.find(u => u.username === username);
      if (!user) return [];
      
      return MOCK_CASTS.filter(cast => cast.author.id === user.id);
    }
  }
  
  // Cast-related methods
  async getCast(id: string): Promise<Cast | null> {
    if (this.useNeynar) {
      try {
        // Mock implementation as lookUpCast isn't available
        await this.delay();
        return MOCK_CASTS.find(cast => cast.id === id) || null;
      } catch (error) {
        console.error(`Error fetching cast ${id}:`, error);
        
        // Fallback to mock data
        await this.delay();
        return MOCK_CASTS.find(cast => cast.id === id) || null;
      }
    } else {
      await this.delay();
      return MOCK_CASTS.find(cast => cast.id === id) || null;
    }
  }
  
  async createCast(text: string, options: { replyTo?: string, embeds?: Embed[] }): Promise<Cast> {
    if (this.useNeynar) {
      try {
        // NOTE: Actual cast creation requires signer key integration
        // This is a placeholder that shows the API structure
        console.warn('Real cast creation requires signer key integration');
        
        // Fallback to mock implementation for now
        await this.delay();
        
        // Mock the current user (first user in our mock data)
        const currentUser = MOCK_USERS[0];
        
        const newCast: Cast = {
          id: `cast${Date.now()}`,
          text,
          author: currentUser,
          timestamp: Date.now(),
          replyTo: options.replyTo,
          recastCount: 0,
          likeCount: 0,
          replyCount: 0,
          hasLiked: false,
          hasRecasted: false,
          embeds: options.embeds,
        };
        
        MOCK_CASTS.unshift(newCast);
        return newCast;
      } catch (error) {
        console.error('Error creating cast:', error);
        throw error;
      }
    } else {
      await this.delay();
      
      // Mock the current user (first user in our mock data)
      const currentUser = MOCK_USERS[0];
      
      const newCast: Cast = {
        id: `cast${Date.now()}`,
        text,
        author: currentUser,
        timestamp: Date.now(),
        replyTo: options.replyTo,
        recastCount: 0,
        likeCount: 0,
        replyCount: 0,
        hasLiked: false,
        hasRecasted: false,
        embeds: options.embeds,
      };
      
      MOCK_CASTS.unshift(newCast);
      return newCast;
    }
  }
  
  async likeCast(id: string): Promise<void> {
    if (this.useNeynar) {
      try {
        // NOTE: Actual like requires signer key integration
        console.warn('Real like requires signer key integration');
        
        // Fallback to mock implementation
        await this.delay();
        const cast = MOCK_CASTS.find(c => c.id === id);
        if (cast) {
          cast.hasLiked = true;
          cast.likeCount++;
        }
      } catch (error) {
        console.error(`Error liking cast ${id}:`, error);
        throw error;
      }
    } else {
      await this.delay();
      const cast = MOCK_CASTS.find(c => c.id === id);
      if (cast) {
        cast.hasLiked = true;
        cast.likeCount++;
      }
    }
  }
  
  async unlikeCast(id: string): Promise<void> {
    if (this.useNeynar) {
      try {
        // NOTE: Actual unlike requires signer key integration
        console.warn('Real unlike requires signer key integration');
        
        // Fallback to mock implementation
        await this.delay();
        const cast = MOCK_CASTS.find(c => c.id === id);
        if (cast) {
          cast.hasLiked = false;
          cast.likeCount = Math.max(0, cast.likeCount - 1);
        }
      } catch (error) {
        console.error(`Error unliking cast ${id}:`, error);
        throw error;
      }
    } else {
      await this.delay();
      const cast = MOCK_CASTS.find(c => c.id === id);
      if (cast) {
        cast.hasLiked = false;
        cast.likeCount = Math.max(0, cast.likeCount - 1);
      }
    }
  }
  
  // User-related methods
  async searchUsers(query: string): Promise<User[]> {
    if (this.useNeynar && query.trim()) {
      try {
        // Mock implementation as searchUser has different response format
        await this.delay();
        return MOCK_USERS.filter(user => 
          user.username.includes(query) || 
          user.displayName.includes(query) ||
          (user.bio && user.bio.includes(query))
        );
      } catch (error) {
        console.error(`Error searching users for "${query}":`, error);
        
        // Fallback to mock data
        await this.delay();
        return MOCK_USERS.filter(user => 
          user.username.includes(query) || 
          user.displayName.includes(query) ||
          (user.bio && user.bio.includes(query))
        );
      }
    } else {
      await this.delay();
      return MOCK_USERS.filter(user => 
        user.username.includes(query) || 
        user.displayName.includes(query) ||
        (user.bio && user.bio.includes(query))
      );
    }
  }
  
  async getUserProfile(username: string): Promise<User | null> {
    if (this.useNeynar) {
      try {
        // Use correct method signature for lookupUserByUsername
        const response = await neynarClient.lookupUserByUsername({
          username
        });
        
        // Access user data correctly based on the response structure
        if (!response.user) return null;
        const user = response.user;
        
        return {
          id: user.fid.toString(),
          username: user.username || '',
          displayName: user.display_name || user.username || '',
          profileImageUrl: user.pfp_url || '',
          bio: user.profile?.bio?.text || '',
          followerCount: user.follower_count || 0,
          followingCount: user.following_count || 0,
          isFollowing: user.viewer_context?.following || false,
          isFollowedBy: user.viewer_context?.followed_by || false,
        };
      } catch (error) {
        console.error(`Error fetching user profile for ${username}:`, error);
        
        // Fallback to mock data
        await this.delay();
        return MOCK_USERS.find(user => user.username === username) || null;
      }
    } else {
      await this.delay();
      return MOCK_USERS.find(user => user.username === username) || null;
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    if (this.useNeynar) {
      try {
        // NOTE: This requires authentication integration
        console.warn('Real current user requires authentication integration');
        
        // Fallback to mock data
        await this.delay();
        return MOCK_USERS[0];
      } catch (error) {
        console.error('Error fetching current user:', error);
        
        // Fallback to mock data
        await this.delay();
        return MOCK_USERS[0];
      }
    } else {
      await this.delay();
      return MOCK_USERS[0];
    }
  }
}

// Export a singleton instance
export const farcasterApi = new FarcasterApi(); 