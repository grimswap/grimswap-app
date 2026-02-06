import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Plus } from 'lucide-react'
import { ETH, USDC, type Token } from '@/lib/tokens'

const supportedTokens: (Token | { comingSoon: true })[] = [USDC, ETH, { comingSoon: true }]

interface TokenItemProps {
  token?: Token
  comingSoon?: boolean
  showDivider?: boolean
}

function TokenItem({ token, comingSoon, showDivider = true }: TokenItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (comingSoon) {
    return (
      <div className="token-item flex items-center gap-5 px-8 py-6 relative">
        {/* Divider */}
        {showDivider && (
          <div
            className="absolute left-0 top-4 bottom-4 w-px"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(164, 35, 139, 0.3) 50%, transparent 100%)',
            }}
          />
        )}

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(164, 35, 139, 0.1)',
            border: '2px dashed rgba(164, 35, 139, 0.3)',
          }}
        >
          <Plus className="w-6 h-6 text-gray-500" />
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span
            className="text-lg text-gray-400 mb-0.5"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            More
          </span>
          <span
            className="text-sm text-gray-500"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Coming Soon
          </span>
        </div>
      </div>
    )
  }

  if (!token) return null

  return (
    <div
      className="token-item flex items-center gap-5 px-8 py-6 relative cursor-pointer transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Divider */}
      {showDivider && (
        <div
          className="absolute left-0 top-4 bottom-4 w-px"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(164, 35, 139, 0.3) 50%, transparent 100%)',
          }}
        />
      )}

      {/* Token Icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-200"
        style={{
          background: '#121214',
          border: `2px solid ${isHovered ? '#00EDDA' : token.color || '#A4238B'}`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {token.logoURI ? (
          <img src={token.logoURI} alt={token.symbol} className="w-10 h-10 object-contain" />
        ) : (
          <span
            className="text-xl font-medium"
            style={{ color: token.color || '#A4238B' }}
          >
            {token.symbol.charAt(0)}
          </span>
        )}
      </div>

      {/* Token Info */}
      <div className="flex flex-col">
        <span
          className="text-lg text-white mb-0.5"
          style={{ fontFamily: "'Crimson Text', serif" }}
        >
          {token.name}
        </span>
        <span
          className="text-sm text-gray-400"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {token.symbol}
        </span>
      </div>
    </div>
  )
}

export function TokenGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tokens-container',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        '.token-item',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          delay: 0.3,
          ease: 'power2.out',
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
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 lg:px-16"
      style={{ background: '#121214' }}
    >
      <div className="max-w-[1000px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-4xl lg:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            <span className="text-white">Supported </span>
            <span className="text-[#00EDDA]">Tokens</span>
          </h2>
          <p
            className="text-gray-400 text-base"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Trade these tokens privately on Unichain Sepolia
          </p>
        </div>

        {/* Tokens Container - Pill with gradient border */}
        <div
          className="tokens-container rounded-full p-[2px] mx-auto"
          style={{
            background: 'linear-gradient(135deg, #A4238B 0%, #6B21A8 50%, #00EDDA 100%)',
            width: 'fit-content',
          }}
        >
          <div
            className="rounded-full flex flex-col sm:flex-row items-stretch"
            style={{ background: '#121214' }}
          >
            {supportedTokens.map((item, index) => (
              <TokenItem
                key={'comingSoon' in item ? 'coming-soon' : item.symbol}
                token={'comingSoon' in item ? undefined : item}
                comingSoon={'comingSoon' in item}
                showDivider={index !== 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
