import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ETH, USDC, type Token } from '@/lib/tokens'

const supportedTokens: (Token | { comingSoon: true })[] = [
  ETH,
  USDC,
  { comingSoon: true },
]

interface TokenCardProps {
  token?: Token
  comingSoon?: boolean
}

function TokenCard({ token, comingSoon }: TokenCardProps) {
  if (comingSoon) {
    return (
      <div
        className={cn(
          'token-card flex flex-col items-center justify-center p-6',
          'rounded-2xl min-w-[160px]',
          'bg-charcoal/30 border border-dashed border-arcane-purple/20',
          'hover:border-arcane-purple/40',
          'transition-all duration-300'
        )}
      >
        <div
          className={cn(
            'w-14 h-14 rounded-full mb-4',
            'bg-shadow-gray/50 border border-arcane-purple/10',
            'flex items-center justify-center'
          )}
        >
          <Plus className="w-6 h-6 text-mist-gray" />
        </div>
        <span className="font-display text-base text-mist-gray">More</span>
        <span className="text-xs text-mist-gray/60">Coming Soon</span>
      </div>
    )
  }

  if (!token) return null

  return (
    <div
      className={cn(
        'token-card group flex flex-col items-center p-6',
        'rounded-2xl min-w-[160px]',
        'bg-charcoal/50 backdrop-blur-xl',
        'border border-arcane-purple/10',
        'hover:border-arcane-purple/30',
        'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
        'transition-all duration-300'
      )}
    >
      {/* Token icon with color indicator */}
      <div className="relative mb-4">
        <div
          className={cn(
            'w-14 h-14 rounded-full',
            'bg-shadow-gray/50 border-2',
            'flex items-center justify-center',
            'group-hover:scale-105',
            'transition-transform duration-300'
          )}
          style={{ borderColor: token.color || '#8B5CF6' }}
        >
          {/* Token symbol as fallback icon */}
          <span
            className="font-display text-lg font-bold"
            style={{ color: token.color || '#8B5CF6' }}
          >
            {token.symbol.charAt(0)}
          </span>
        </div>
        {/* Color glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-0 group-hover:opacity-50',
            'blur-xl transition-opacity duration-300'
          )}
          style={{ backgroundColor: token.color || '#8B5CF6' }}
        />
      </div>

      {/* Token info */}
      <span className="font-display text-lg text-ghost-white mb-1">{token.symbol}</span>
      <span className="text-sm text-mist-gray">{token.name}</span>

      {/* Native badge */}
      {token.isNative && (
        <span
          className={cn(
            'mt-2 px-2 py-0.5 rounded-full text-xs',
            'bg-spectral-green/20 text-spectral-green'
          )}
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
      gsap.from('.token-card', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl text-ghost-white mb-3">
            Supported Tokens
          </h2>
          <p className="text-mist-gray text-sm">
            Trade these tokens privately on Unichain Sepolia
          </p>
        </div>

        {/* Token grid - scrollable on mobile, centered grid on desktop */}
        <div className="relative">
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            <div className="flex gap-4">
              {supportedTokens.map((item) => (
                <TokenCard
                  key={'comingSoon' in item ? 'coming-soon' : item.symbol}
                  token={'comingSoon' in item ? undefined : item}
                  comingSoon={'comingSoon' in item}
                />
              ))}
            </div>
          </div>

          {/* Desktop: centered grid */}
          <div className="hidden md:flex justify-center gap-6">
            {supportedTokens.map((item) => (
              <TokenCard
                key={'comingSoon' in item ? 'coming-soon' : item.symbol}
                token={'comingSoon' in item ? undefined : item}
                comingSoon={'comingSoon' in item}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
