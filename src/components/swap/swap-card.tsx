import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Settings, ArrowDown, Info } from 'lucide-react'
import { TokenInput } from './token-input'
import { TokenSelectorModal, type Token } from './token-selector-modal'
import { RingSelector } from './ring-selector'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useAccount } from 'wagmi'

// Default tokens
const DEFAULT_FROM_TOKEN: Token = {
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  balance: '1.234',
}

const DEFAULT_TO_TOKEN: Token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  balance: '1,250.00',
}

export function SwapCard() {
  const { isConnected } = useAccount()
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_FROM_TOKEN)
  const [toToken, setToToken] = useState<Token>(DEFAULT_TO_TOKEN)
  const [ringSize, setRingSize] = useState(5)
  const [isSwapping, setIsSwapping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [slippage, setSlippage] = useState(0.5)

  // Token selector modal state
  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [selectingFor, setSelectingFor] = useState<'from' | 'to'>('from')

  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Calculate output amount (mock)
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      // Mock conversion rate
      const rate = fromToken.symbol === 'ETH' ? 2450 : 1 / 2450
      const output = parseFloat(fromAmount) * rate
      setToAmount(output.toFixed(toToken.decimals > 6 ? 6 : 2))
    } else {
      setToAmount('')
    }
  }, [fromAmount, fromToken, toToken])

  // Animate glow on swap
  useEffect(() => {
    if (isSwapping && glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.5,
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.out',
      })

      gsap.to(glowRef.current, {
        rotation: 360,
        duration: 2,
        ease: 'none',
        repeat: -1,
      })
    } else if (glowRef.current) {
      gsap.killTweensOf(glowRef.current)
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 1,
        rotation: 0,
        duration: 0.3,
      })
    }
  }, [isSwapping])

  const handleSwap = async () => {
    if (!isConnected) return

    setIsSwapping(true)

    // Simulate swap delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsSwapping(false)
    setFromAmount('')
    setToAmount('')
  }

  const handleFlipTokens = () => {
    // Animation for flip
    if (cardRef.current) {
      const arrow = cardRef.current.querySelector('.swap-arrow')
      if (arrow) {
        gsap.to(arrow, {
          rotation: '+=180',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    // Swap tokens
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    // Swap amounts
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const openTokenSelector = (type: 'from' | 'to') => {
    setSelectingFor(type)
    setTokenModalOpen(true)
  }

  const handleTokenSelect = (token: Token) => {
    if (selectingFor === 'from') {
      // If selecting same token, swap them
      if (token.address === toToken.address) {
        setToToken(fromToken)
      }
      setFromToken(token)
    } else {
      // If selecting same token, swap them
      if (token.address === fromToken.address) {
        setFromToken(toToken)
      }
      setToToken(token)
    }
  }

  const canSwap = isConnected && fromAmount && parseFloat(fromAmount) > 0

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          'relative w-full',
          'rounded-2xl p-[1px]',
          'bg-gradient-to-br from-arcane-purple/50 via-transparent to-spectral-green/50'
        )}
      >
        {/* Animated glow ring */}
        <div
          ref={glowRef}
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0',
            'bg-gradient-conic from-arcane-purple via-spectral-green via-ethereal-cyan to-arcane-purple',
            'blur-xl pointer-events-none'
          )}
        />

        <div className="relative rounded-2xl bg-charcoal/95 backdrop-blur-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-ghost-white">
              Cast Spell
            </h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-white/5',
                showSettings && 'bg-white/5'
              )}
            >
              <Settings className="w-5 h-5 text-mist-gray" />
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-4 rounded-xl bg-obsidian/50 border border-arcane-purple/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-mist-gray">Slippage Tolerance</span>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-sm',
                        'border transition-colors',
                        slippage === value
                          ? 'bg-arcane-purple/20 border-arcane-purple text-arcane-purple'
                          : 'bg-charcoal border-arcane-purple/20 text-mist-gray hover:border-arcane-purple/40'
                      )}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* From Token */}
          <TokenInput
            label="You sacrifice"
            amount={fromAmount}
            onAmountChange={setFromAmount}
            token={fromToken}
            onTokenSelect={() => openTokenSelector('from')}
            balance={fromToken.balance}
            className="mb-2"
          />

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleFlipTokens}
              className={cn(
                'swap-arrow p-3 rounded-xl',
                'bg-obsidian border border-arcane-purple/30',
                'hover:border-arcane-purple/60 hover:scale-110',
                'active:scale-95',
                'transition-all duration-200'
              )}
            >
              <ArrowDown className="w-5 h-5 text-arcane-purple" />
            </button>
          </div>

          {/* To Token */}
          <TokenInput
            label="You receive"
            amount={toAmount}
            onAmountChange={setToAmount}
            token={toToken}
            onTokenSelect={() => openTokenSelector('to')}
            balance={toToken.balance}
            disabled
            className="mt-2 mb-4"
          />

          {/* Ring Selector */}
          <RingSelector
            ringSize={ringSize}
            onRingSizeChange={setRingSize}
            className="mb-6"
          />

          {/* Price Info */}
          {fromAmount && (
            <div className="mb-4 p-3 rounded-xl bg-obsidian/30 border border-arcane-purple/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-mist-gray flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Rate
                </span>
                <span className="text-ghost-white font-mono">
                  1 {fromToken.symbol} = {fromToken.symbol === 'ETH' ? '2,450' : '0.00041'} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-mist-gray">Slippage</span>
                <span className="text-ghost-white font-mono">{slippage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-mist-gray">Privacy Level</span>
                <span className="text-spectral-green font-mono">{ringSize} addresses</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <ShimmerButton
            onClick={handleSwap}
            disabled={!canSwap || isSwapping}
          >
            {!isConnected
              ? 'Connect Wallet'
              : isSwapping
                ? 'Casting...'
                : !fromAmount
                  ? 'Enter Amount'
                  : 'Transmute'}
          </ShimmerButton>
        </div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelectorModal
        isOpen={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        onSelect={handleTokenSelect}
        selectedToken={selectingFor === 'from' ? fromToken : toToken}
      />
    </>
  )
}
