/**
 * Sample rich Farcaster profile data for testing the UI
 * This matches the structure returned by the Neynar API
 */
export const sampleProfileData = {
  object: "user",
  fid: 2878,
  username: "abhir",
  display_name: "Abhi Raheja",
  pfp_url: "https://i.seadn.io/gae/ZDw1swEi8Yqvo2Vm1NYJSWXaFT6o1LLQYZyZuO8aUVqzQ6qLPrH0K3O8SDDenVmK6_2Uutoa50vcJZLb59TipSCEslIeEg5QciSVzZY?w=500&auto=format",
  custody_address: "0x87fb250d6a7b2d613d8a7879a4ec12b67718278a",
  profile: {
    bio: {
      text: "The center cannot hold"
    },
    location: {
      latitude: 45.5,
      longitude: -73.57,
      address: {
        city: "Montreal",
        state: "Quebec",
        state_code: "qc",
        country: "Canada",
        country_code: "ca"
      }
    }
  },
  follower_count: 410,
  following_count: 260,
  verifications: [
    "0xdf440c14103af0e3f4293bfdd8b21754e02d1bad",
    "0x4c090f4fa62941f80314827dd11d4c61867f8b38"
  ],
  verified_addresses: {
    eth_addresses: [
      "0xdf440c14103af0e3f4293bfdd8b21754e02d1bad",
      "0x4c090f4fa62941f80314827dd11d4c61867f8b38"
    ],
    sol_addresses: [],
    primary: {
      eth_address: "0x4c090f4fa62941f80314827dd11d4c61867f8b38",
      sol_address: null
    }
  },
  verified_accounts: [
    {
      platform: "x",
      username: "abhihereandnow"
    }
  ],
  power_badge: false
};

/**
 * Function to get sample profile data with the option to override specific fields
 */
export function getSampleProfile(overrides: Record<string, any> = {}) {
  return {
    ...sampleProfileData,
    ...overrides
  };
}
