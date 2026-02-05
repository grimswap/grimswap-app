import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Plus } from 'lucide-react'
import { ETH, USDC, type Token } from '@/lib/tokens'

const supportedTokens: (Token | { comingSoon: true })[] = [ETH, USDC, { comingSoon: true }]

interface TokenCardProps {
  token?: Token
  comingSoon?: boolean
}

function TokenCard({ token, comingSoon }: TokenCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (comingSoon) {
    return (
      <div
        className="token-card flex flex-col items-center justify-center p-6 rounded-2xl min-w-[160px] transition-all duration-300"
        style={{
          background: 'rgba(42, 20, 40, 0.4)',
          border: '1px dashed rgba(164, 35, 139, 0.3)',
        }}
      >
        <div
          className="w-14 h-14 rounded-full mb-4 flex items-center justify-center"
          style={{
            background: 'rgba(164, 35, 139, 0.1)',
            border: '1px solid rgba(164, 35, 139, 0.2)',
          }}
        >
          <Plus className="w-6 h-6 text-gray-500" />
        </div>
        <span className="font-display text-base text-gray-400">More</span>
        <span className="text-xs text-gray-500">Coming Soon</span>
      </div>
    )
  }

  if (!token) return null

  const tokenColor = token.color || '#A4238B'

  return (
    <div
      className="token-card flex flex-col items-center p-6 rounded-2xl min-w-[160px] transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(42, 20, 40, 0.6)',
        border: `1px solid ${isHovered ? tokenColor + '66' : 'rgba(164, 35, 139, 0.2)'}`,
        boxShadow: isHovered ? `0 0 25px ${tokenColor}44` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Token icon */}
      <div className="relative mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 overflow-hidden bg-charcoal"
          style={{
            border: `2px solid ${tokenColor}`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {token.logoURI ? (
            <img src={token.logoURI} alt={token.symbol} className="w-14 h-14 object-contain" />
          ) : (
            <span className="font-display text-lg font-bold" style={{ color: tokenColor }}>
              {token.symbol.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Token info */}
      <span className="font-display text-lg text-white mb-1">{token.symbol}</span>
      <span className="text-sm text-gray-400">{token.name}</span>

      {/* Native badge */}
      {token.isNative && (
        <span
          className="mt-2 px-2 py-0.5 rounded-full text-xs"
          style={{
            background: 'rgba(0, 237, 218, 0.2)',
            color: '#00EDDA',
          }}
        >
          Native
        </span>
      )}
    </div>
  )
}

export function TokenGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.token-card',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-3">
            Supported <span className="text-gradient-cyan">Tokens</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Trade these tokens privately on Unichain Sepolia
          </p>
        </div>

        {/* Token grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {supportedTokens.map((item) => (
            <TokenCard
              key={'comingSoon' in item ? 'coming-soon' : item.symbol}
              token={'comingSoon' in item ? undefined : item}
              comingSoon={'comingSoon' in item}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
