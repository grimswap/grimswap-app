import { RELAYER_URL } from './constants'
import { type PoolKey } from './contracts'

/**
 * Relayer info response
 */
export interface RelayerInfo {
  address: string
  chain: string
  chainId: number
  feeBps: number
  balance: string
}

/**
 * Relay request payload
 */
export interface RelayRequest {
  proof: {
    a: [string, string]
    b: [[string, string], [string, string]]
    c: [string, string]
  }
  publicSignals: string[]
  swapParams: {
    poolKey: {
      currency0: string
      currency1: string
      fee: number
      tickSpacing: number
      hooks: string
    }
    zeroForOne: boolean
    amountSpecified: string
    sqrtPriceLimitX96: string
  }
}

/**
 * Relay response
 */
export interface RelayResponse {
  success: boolean
  txHash?: string
  blockNumber?: string
  gasUsed?: string
  fundingTxHash?: string
  recipientAddress?: string
  error?: string
}

/**
 * Check relayer health
 */
export async function checkRelayerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${RELAYER_URL}/health`)
    const data = await response.json()
    return data.status === 'healthy'
  } catch (error) {
    console.error('Relayer health check failed:', error)
    return false
  }
}

/**
 * Get relayer info (address, fee, balance)
 */
export async function getRelayerInfo(): Promise<RelayerInfo | null> {
  try {
    const response = await fetch(`${RELAYER_URL}/info`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to get relayer info:', error)
    return null
  }
}

/**
 * Submit a private swap through the relayer
 */
export async function submitToRelayer(request: RelayRequest): Promise<RelayResponse> {
  try {
    console.log('Submitting to relayer:', {
      url: `${RELAYER_URL}/relay`,
      publicSignals: request.publicSignals,
      swapParams: request.swapParams,
    })

    const response = await fetch(`${RELAYER_URL}/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      }
    }

    return {
      success: true,
      txHash: data.txHash,
      blockNumber: data.blockNumber,
      gasUsed: data.gasUsed,
      fundingTxHash: data.fundingTxHash,
      recipientAddress: data.recipientAddress,
    }
  } catch (error) {
    console.error('Relayer submission failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

/**
 * Format proof from snarkjs output to relayer format
 */
export function formatProofForRelayer(proof: {
  pi_a: string[]
  pi_b: string[][]
  pi_c: string[]
}): RelayRequest['proof'] {
  return {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][0], proof.pi_b[0][1]],
      [proof.pi_b[1][0], proof.pi_b[1][1]],
    ],
    c: [proof.pi_c[0], proof.pi_c[1]],
  }
}

/**
 * Create swap params for relayer
 */
export function createSwapParams(
  poolKey: PoolKey,
  zeroForOne: boolean,
  amountSpecified: bigint,
  sqrtPriceLimitX96: bigint
): RelayRequest['swapParams'] {
  return {
    poolKey: {
      currency0: poolKey.currency0,
      currency1: poolKey.currency1,
      fee: poolKey.fee,
      tickSpacing: poolKey.tickSpacing,
      hooks: poolKey.hooks,
    },
    zeroForOne,
    amountSpecified: amountSpecified.toString(),
    sqrtPriceLimitX96: sqrtPriceLimitX96.toString(),
  }
}
