/**
 * Authentication utilities for Farcaster
 * This is a placeholder implementation that will be replaced with AuthKit
 */

import { User } from '../types/farcaster';

// Mock current user
const MOCK_CURRENT_USER: User = {
  id: 'user1',
  username: 'alice',
  displayName: 'Alice',
  profileImageUrl: 'https://i.pravatar.cc/150?u=alice',
  bio: 'Crypto enthusiast. Builder. Love Web3.',
  followerCount: 2480,
  followingCount: 753,
  isFollowing: true,
  isFollowedBy: false,
};

// Authentication state
let isAuthenticated = false;
let currentUser: User | null = null;

/**
 * Sign in with Farcaster (mock implementation)
 * Will be replaced with AuthKit implementation
 */
export const signInWithFarcaster = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Set authentication state
  isAuthenticated = true;
  currentUser = MOCK_CURRENT_USER;
  
  return currentUser;
};

/**
 * Sign out (mock implementation)
 */
export const signOut = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear authentication state
  isAuthenticated = false;
  currentUser = null;
};

/**
 * Get current authentication status
 */
export const getAuthStatus = (): { isAuthenticated: boolean; currentUser: User | null } => {
  return {
    isAuthenticated,
    currentUser,
  };
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return isAuthenticated;
}; 