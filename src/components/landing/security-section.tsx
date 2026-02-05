import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Github, Lock, Shield, Beaker } from 'lucide-react'

const trustIndicators = [
  {
    icon: Github,
    title: 'Open Source',
    description: 'Code auditable on GitHub. Verify the smart contracts yourself.',
    color: 'pink' as const,
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'You control your keys. We never have access to your funds.',
    color: 'cyan' as const,
  },
  {
    icon: Shield,
    title: 'ZK-Verified',
    description: 'All proofs verified on-chain by the Groth16 verifier contract.',
    color: 'pink' as const,
  },
  {
    icon: Beaker,
    title: 'Testnet Phase',
    description: 'Currently deployed on Unichain Sepolia for testing and development.',
    color: 'cyan' as const,
  },
]

const badgeColors = {
  pink: {
    iconColor: '#A4238B',
    iconBg: 'rgba(164, 35, 139, 0.2)',
    iconBorder: 'rgba(164, 35, 139, 0.4)',
    hoverBorder: 'rgba(164, 35, 139, 0.5)',
    hoverGlow: 'rgba(164, 35, 139, 0.3)',
  },
  cyan: {
    iconColor: '#00EDDA',
    iconBg: 'rgba(0, 237, 218, 0.2)',
    iconBorder: 'rgba(0, 237, 218, 0.4)',
    hoverBorder: 'rgba(0, 237, 218, 0.5)',
    hoverGlow: 'rgba(0, 237, 218, 0.3)',
  },
}

interface BadgeCardProps {
  badge: typeof trustIndicators[0]
}

function BadgeCard({ badge }: BadgeCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = badge.icon
  const colors = badgeColors[badge.color]

  return (
    <div
      className="trust-badge p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(42, 20, 40, 0.6)',
        border: `1px solid ${isHovered ? colors.hoverBorder : 'rgba(164, 35, 139, 0.2)'}`,
        boxShadow: isHovered ? `0 0 25px ${colors.hoverGlow}` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
        style={{
          background: colors.iconBg,
          border: `1px solid ${colors.iconBorder}`,
        }}
      >
        <Icon className="w-7 h-7" style={{ color: colors.iconColor }} />
      </div>

      {/* Content */}
      <h3 className="font-display text-lg text-white mb-2">{badge.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{badge.description}</p>
    </div>
  )
}

export function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.trust-badge',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
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
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
            Security & <span className="text-gradient-cyan">Trust</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built with security-first principles. Your privacy and funds are protected by cryptographic proofs.
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustIndicators.map((badge) => (
            <BadgeCard key={badge.title} badge={badge} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/grimswap"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200"
            style={{
              background: 'rgba(42, 20, 40, 0.6)',
              border: '1px solid rgba(164, 35, 139, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 237, 218, 0.4)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 237, 218, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(164, 35, 139, 0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <Github className="w-5 h-5 text-white" />
            <span className="text-white font-medium">View on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  )
}
