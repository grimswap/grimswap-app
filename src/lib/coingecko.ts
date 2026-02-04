import { type Address } from 'viem'

const API_URL = 'https://api.coingecko.com/api/v3'
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || ''

// Rate limits: 10,000 calls/month (333/day, ~5/min)
const CACHE_TTL = 60000 // 60 seconds
const RETRY_DELAY = 2000 // 2 seconds

// Token ID mapping (CoinGecko ID -> Token Address)
export const TOKEN_ID_MAP: Record<string, string> = {
  // Ethereum mainnet tokens (for reference)
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'weth', // WETH
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai', // DAI
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC

  // Native ETH (zero address)
  '0x0000000000000000000000000000000000000000': 'ethereum', // ETH

  // Unichain Sepolia USDC (use mainnet USDC price as reference)
  '0x31d0220469e10c4e71834a79b1f276d740d3768f': 'usd-coin', // USDC

  // Unichain Sepolia Test Tokens (no CoinGecko IDs - testnet only)
  // Map to ETH for price reference
  '0x48ba64b5312afdfe4fc96d8f03010a0a86e17963': 'weth', // Token A (PTA)
  '0x96ac37889dfdcd4da0c898a5c9fb9d17ced60b1b': 'weth', // Token B (PTB)
}

// Token ID reverse mapping (Address -> CoinGecko ID)
const ADDRESS_TO_ID: Record<string, string> = Object.entries(TOKEN_ID_MAP).reduce(
  (acc, [address, id]) => {
    acc[address.toLowerCase()] = id
    return acc
  },
  {} as Record<string, string>
)

export interface TokenPrice {
  usd: number
  usd_24h_change: number
  last_updated: number
}

interface CachedPrice extends TokenPrice {
  expiresAt: number
}

// In-memory cache
const priceCache = new Map<string, CachedPrice>()

/**
 * Get token price from cache if available and not expired
 */
function getCachedPrice(tokenAddress: string): TokenPrice | null {
  const cached = priceCache.get(tokenAddress.toLowerCase())
  if (!cached) return null

  if (Date.now() > cached.expiresAt) {
    priceCache.delete(tokenAddress.toLowerCase())
    return null
  }

  return {
    usd: cached.usd,
    usd_24h_change: cached.usd_24h_change,
    last_updated: cached.last_updated,
  }
}

/**
 * Cache token price
 */
function setCachedPrice(tokenAddress: string, price: TokenPrice): void {
  priceCache.set(tokenAddress.toLowerCase(), {
    ...price,
    expiresAt: Date.now() + CACHE_TTL,
  })
}

/**
 * Get CoinGecko token ID from address
 */
export function getTokenId(tokenAddress: Address): string | null {
  return ADDRESS_TO_ID[tokenAddress.toLowerCase()] || null
}

/**
 * Fetch token price from CoinGecko API
 */
export async function getTokenPrice(
  tokenAddress: Address
): Promise<TokenPrice | null> {
  // Check cache first
  const cached = getCachedPrice(tokenAddress)
  if (cached) return cached

  // Get CoinGecko ID
  const coinId = getTokenId(tokenAddress)
  if (!coinId) {
    console.warn(`No CoinGecko ID mapping for token: ${tokenAddress}`)
    return null
  }

  try {
    const url = `${API_URL}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
    const headers: HeadersInit = {}

    if (API_KEY) {
      headers['x-cg-demo-api-key'] = API_KEY
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited - wait and retry once
        console.warn('CoinGecko rate limit hit, retrying...')
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))

        const retryResponse = await fetch(url, { headers })
        if (!retryResponse.ok) {
          throw new Error(`CoinGecko API error: ${retryResponse.status}`)
        }
        return parseResponse(await retryResponse.json(), coinId, tokenAddress)
      }
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    return parseResponse(await response.json(), coinId, tokenAddress)
  } catch (error) {
    console.error('Failed to fetch token price:', error)
    return null
  }
}

/**
 * Parse CoinGecko API response
 */
function parseResponse(
  data: any,
  coinId: string,
  tokenAddress: Address
): TokenPrice | null {
  const priceData = data[coinId]
  if (!priceData) return null

  const price: TokenPrice = {
    usd: priceData.usd || 0,
    usd_24h_change: priceData.usd_24h_change || 0,
    last_updated: Date.now(),
  }

  // Cache the result
  setCachedPrice(tokenAddress, price)

  return price
}

/**
 * Fetch multiple token prices in a single batch request
 */
export async function getTokenPrices(
  tokenAddresses: Address[]
): Promise<Map<Address, TokenPrice>> {
  const results = new Map<Address, TokenPrice>()
  const tokensToFetch: Array<{ address: Address; id: string }> = []

  // Check cache for each token
  for (const address of tokenAddresses) {
    const cached = getCachedPrice(address)
    if (cached) {
      results.set(address, cached)
    } else {
      const coinId = getTokenId(address)
      if (coinId) {
        tokensToFetch.push({ address, id: coinId })
      }
    }
  }

  // Fetch uncached tokens
  if (tokensToFetch.length > 0) {
    const ids = tokensToFetch.map((t) => t.id).join(',')
    const url = `${API_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    const headers: HeadersInit = {}

    if (API_KEY) {
      headers['x-cg-demo-api-key'] = API_KEY
    }

    try {
      const response = await fetch(url, { headers })
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data = await response.json()

      for (const { address, id } of tokensToFetch) {
        const priceData = data[id]
        if (priceData) {
          const price: TokenPrice = {
            usd: priceData.usd || 0,
            usd_24h_change: priceData.usd_24h_change || 0,
            last_updated: Date.now(),
          }
          setCachedPrice(address, price)
          results.set(address, price)
        }
      }
    } catch (error) {
      console.error('Failed to fetch token prices:', error)
    }
  }

  return results
}

/**
 * Format USD price for display
 */
export function formatUsdPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`
  } else {
    return `$${price.toFixed(6)}`
  }
}

/**
 * Format 24h price change for display
 */
export function formatPriceChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

/**
 * Calculate USD value of token amount
 */
export function calculateUsdValue(
  tokenAmount: bigint,
  tokenDecimals: number,
  priceUsd: number
): number {
  const amount = Number(tokenAmount) / Math.pow(10, tokenDecimals)
  return amount * priceUsd
}

/**
 * Register custom token mapping (for test tokens)
 */
export function registerTokenMapping(tokenAddress: Address, coinGeckoId: string): void {
  TOKEN_ID_MAP[tokenAddress.toLowerCase()] = coinGeckoId
  ADDRESS_TO_ID[tokenAddress.toLowerCase()] = coinGeckoId
}

/**
 * Clear price cache
 */
export function clearPriceCache(): void {
  priceCache.clear()
}
