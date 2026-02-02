import { type Address } from 'viem'

// Unichain Sepolia (Chain ID: 1301)
export const UNICHAIN_SEPOLIA = {
  id: 1301,
  name: 'Unichain Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://sepolia.unichain.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://unichain-sepolia.blockscout.com',
    },
  },
} as const

// Deployed Contract Addresses (Unichain Sepolia)
export const CONTRACTS = {
  grimHook: '0x6bE22745E46FEd1d39Ebb4b65E5Bb0A2f8000000' as Address,
  stealthRegistry: '0xA05346B6ab484C1dE7cCE548368aE0Eb29c7e001' as Address,
  announcer: '0x8a9F4E7db81Fb5A3c0c68Faa32C1e36C403dB002' as Address,
  ringVerifier: '0xC32e5B8Ca19D9c7b3Da8F547F8EdEE1E23BB0003' as Address,
} as const

// Ring sizes for privacy
export const RING_SIZES = [3, 5, 7, 11] as const

// Default slippage tolerance (0.5%)
export const DEFAULT_SLIPPAGE = 0.5

// Transaction deadlines
export const DEFAULT_DEADLINE_MINUTES = 20
