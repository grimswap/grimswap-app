import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplets, Plus, TrendingUp, Lock } from 'lucide-react'

// Mock pools data
const MOCK_POOLS = [
  {
    id: '1',
    token0: 'ETH',
    token1: 'USDC',
    tvl: '$2.4M',
    apr: '12.5%',
    volume24h: '$450K',
    hasPrivacy: true,
  },
  {
    id: '2',
    token0: 'WBTC',
    token1: 'ETH',
    tvl: '$1.8M',
    apr: '8.2%',
    volume24h: '$280K',
    hasPrivacy: true,
  },
  {
    id: '3',
    token0: 'DAI',
    token1: 'USDC',
    tvl: '$950K',
    apr: '4.1%',
    volume24h: '$120K',
    hasPrivacy: false,
  },
]

export function PoolsPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pool-element', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-[calc(100vh-5rem)] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pool-element flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ghost-white mb-2">
              Liquidity Pools
            </h1>
            <p className="text-mist-gray">
              Provide liquidity and earn fees with privacy protection
            </p>
          </div>
          <Button variant="primary" className="sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Position
          </Button>
        </div>

        {/* Stats */}
        <div className="pool-element grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card glow="purple">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-mist-gray mb-1">Total Value Locked</p>
              <p className="text-2xl font-mono text-ghost-white">$5.15M</p>
            </CardContent>
          </Card>
          <Card glow="green">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-mist-gray mb-1">24h Volume</p>
              <p className="text-2xl font-mono text-ghost-white">$850K</p>
            </CardContent>
          </Card>
          <Card glow="cyan">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-mist-gray mb-1">Privacy Pools</p>
              <p className="text-2xl font-mono text-ghost-white">2</p>
            </CardContent>
          </Card>
        </div>

        {/* Pool List */}
        <div className="pool-element space-y-4">
          <h2 className="font-display text-xl text-ghost-white">All Pools</h2>

          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-6 gap-4 px-4 py-2 text-sm text-mist-gray">
            <div className="col-span-2">Pool</div>
            <div>TVL</div>
            <div>APR</div>
            <div>24h Volume</div>
            <div></div>
          </div>

          {/* Pool Rows */}
          {MOCK_POOLS.map((pool) => (
            <Card key={pool.id} glow="none" className="hover:border-arcane-purple/30 transition-all">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 items-center">
                  {/* Pool Name */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-arcane-purple to-ethereal-cyan flex items-center justify-center z-10">
                        <span className="text-[10px] font-bold text-ghost-white">
                          {pool.token0.slice(0, 2)}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-spectral-green to-ethereal-cyan flex items-center justify-center">
                        <span className="text-[10px] font-bold text-ghost-white">
                          {pool.token1.slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ghost-white">
                          {pool.token0}/{pool.token1}
                        </span>
                        {pool.hasPrivacy && (
                          <Lock className="w-3 h-3 text-spectral-green" />
                        )}
                      </div>
                      <span className="text-xs text-mist-gray">
                        {pool.hasPrivacy ? 'Privacy Enabled' : 'Standard Pool'}
                      </span>
                    </div>
                  </div>

                  {/* TVL */}
                  <div>
                    <span className="sm:hidden text-xs text-mist-gray block">TVL</span>
                    <span className="font-mono text-ghost-white">{pool.tvl}</span>
                  </div>

                  {/* APR */}
                  <div>
                    <span className="sm:hidden text-xs text-mist-gray block">APR</span>
                    <span className="font-mono text-spectral-green flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {pool.apr}
                    </span>
                  </div>

                  {/* Volume */}
                  <div>
                    <span className="sm:hidden text-xs text-mist-gray block">24h</span>
                    <span className="font-mono text-ghost-white">{pool.volume24h}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <Button variant="secondary" size="sm">
                      <Droplets className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
