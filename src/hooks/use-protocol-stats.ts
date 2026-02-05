import { useState, useEffect, useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import { useStateView } from './use-state-view'
import { grimPoolConfig, DEFAULT_POOL_KEY } from '@/lib/contracts'
import { UNICHAIN_SEPOLIA } from '@/lib/constants'

export interface ProtocolStats {
  poolLiquidity: string
  depositCount: number
  ethPrice: number
  network: string
}

/**
 * Hook to fetch and aggregate live protocol statistics
 * Used for the landing page stats section
 */
export function useProtocolStats() {
  const [stats, setStats] = useState<ProtocolStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const publicClient = usePublicClient()

  // Get pool state for liquidity and price
  const { poolState, currentPrice, isLoading: poolLoading, error: poolError } = useStateView(DEFAULT_POOL_KEY)

  // Fetch deposit count from GrimPool
  const fetchDepositCount = useCallback(async (): Promise<number> => {
    if (!publicClient) return 0

    try {
      const count = await publicClient.readContract({
        ...grimPoolConfig,
        functionName: 'getDepositCount',
        args: [],
      })
      return Number(count)
    } catch (err) {
      console.error('Failed to get deposit count:', err)
      return 0
    }
  }, [publicClient])

  // Aggregate all stats
  const fetchStats = useCallback(async () => {
    if (poolLoading) return

    try {
      setIsLoading(true)
      setError(null)

      const depositCount = await fetchDepositCount()

      // Format liquidity - convert from raw value
      let poolLiquidity = '0'
      if (poolState?.liquidity) {
        // Liquidity is a complex value in Uniswap v4, display as raw for now
        const liquidityNum = Number(poolState.liquidity)
        if (liquidityNum > 1e18) {
          poolLiquidity = (liquidityNum / 1e18).toFixed(2) + 'e18'
        } else if (liquidityNum > 1e9) {
          poolLiquidity = (liquidityNum / 1e9).toFixed(2) + 'B'
        } else if (liquidityNum > 1e6) {
          poolLiquidity = (liquidityNum / 1e6).toFixed(2) + 'M'
        } else {
          poolLiquidity = liquidityNum.toLocaleString()
        }
      }

      setStats({
        poolLiquidity,
        depositCount,
        ethPrice: currentPrice || 0,
        network: UNICHAIN_SEPOLIA.name,
      })
    } catch (err) {
      console.error('Failed to fetch protocol stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setIsLoading(false)
    }
  }, [poolState, currentPrice, poolLoading, fetchDepositCount])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Combine errors
  const combinedError = error || poolError

  return {
    stats,
    isLoading: isLoading || poolLoading,
    error: combinedError,
    refetch: fetchStats,
  }
}
