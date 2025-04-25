/**
 * Authentication hook for Farcaster
 */

'use client';

import { useProfile } from '@farcaster/auth-kit';

export const useAuth = useProfile;