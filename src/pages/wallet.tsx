import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useAccount } from 'wagmi'
import { useStealthBalance } from '@/hooks/use-stealth-balance'
import { StealthBalanceCard } from '@/components/privacy/stealth-balance-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AddressDisplay } from '@/components/ui/copy-button'
import { Wallet, Shield, Activity } from 'lucide-react'

export function WalletPage() {
  const { address, isConnected } = useAccount()
  const { balances, isLoading, scanForBalances, totalUsdValue } = useStealthBalance()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wallet-element', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-arcane-purple/50 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-ghost-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-mist-gray">
            Connect your wallet to view your stealth balances
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-[calc(100vh-5rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="wallet-element">
          <h1 className="font-display text-3xl text-ghost-white mb-2">
            Your Grimoire
          </h1>
          <p className="text-mist-gray">
            Manage your stealth balances and hidden assets
          </p>
        </div>

        {/* Stats */}
        <div className="wallet-element grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card glow="purple">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-arcane-purple/20">
                  <Wallet className="w-5 h-5 text-arcane-purple" />
                </div>
                <div>
                  <p className="text-sm text-mist-gray">Connected</p>
                  {address && <AddressDisplay address={address} chars={4} />}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card glow="green">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-spectral-green/20">
                  <Shield className="w-5 h-5 text-spectral-green" />
                </div>
                <div>
                  <p className="text-sm text-mist-gray">Hidden Value</p>
                  <p className="text-lg font-mono text-ghost-white">
                    ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card glow="cyan">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-ethereal-cyan/20">
                  <Activity className="w-5 h-5 text-ethereal-cyan" />
                </div>
                <div>
                  <p className="text-sm text-mist-gray">Stealth Addresses</p>
                  <p className="text-lg font-mono text-ghost-white">
                    {balances.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stealth Balances */}
        <div className="wallet-element">
          <StealthBalanceCard
            balances={balances}
            isLoading={isLoading}
            onRefresh={scanForBalances}
          />
        </div>

        {/* Recent Activity */}
        <div className="wallet-element">
          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-ghost-white">
                Recent Activity
              </h2>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-mist-gray/30 mx-auto mb-3" />
                <p className="text-mist-gray">No recent transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
