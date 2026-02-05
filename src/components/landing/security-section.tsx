import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Github, Lock, Shield, Beaker } from 'lucide-react'
import { cn } from '@/lib/utils'

const trustIndicators = [
  {
    icon: Github,
    title: 'Open Source',
    description: 'Code auditable on GitHub. Verify the smart contracts yourself.',
    color: 'purple',
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'You control your keys. We never have access to your funds.',
    color: 'green',
  },
  {
    icon: Shield,
    title: 'ZK-Verified',
    description: 'All proofs verified on-chain by the Groth16 verifier contract.',
    color: 'cyan',
  },
  {
    icon: Beaker,
    title: 'Testnet Phase',
    description: 'Currently deployed on Unichain Sepolia for testing and development.',
    color: 'yellow',
  },
]

const colorStyles = {
  purple: {
    icon: 'text-arcane-purple',
    bg: 'bg-arcane-purple/20',
    border: 'border-arcane-purple/30',
    glow: 'group-hover:shadow-glow-purple',
  },
  green: {
    icon: 'text-spectral-green',
    bg: 'bg-spectral-green/20',
    border: 'border-spectral-green/30',
    glow: 'group-hover:shadow-glow-green',
  },
  cyan: {
    icon: 'text-ethereal-cyan',
    bg: 'bg-ethereal-cyan/20',
    border: 'border-ethereal-cyan/30',
    glow: 'group-hover:shadow-glow-cyan',
  },
  yellow: {
    icon: 'text-yellow-400',
    bg: 'bg-yellow-400/20',
    border: 'border-yellow-400/30',
    glow: 'group-hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]',
  },
}

export function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.trust-badge', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl text-ghost-white mb-4">
            Security & Trust
          </h2>
          <p className="text-mist-gray max-w-2xl mx-auto">
            Built with security-first principles. Your privacy and funds are protected by
            cryptographic proofs.
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustIndicators.map((badge) => {
            const Icon = badge.icon
            const styles = colorStyles[badge.color as keyof typeof colorStyles]

            return (
              <div
                key={badge.title}
                className={cn(
                  'trust-badge group relative p-6 rounded-2xl',
                  'bg-charcoal/50 backdrop-blur-xl',
                  'border border-arcane-purple/10',
                  'hover:border-arcane-purple/20',
                  'transition-all duration-300'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl mb-4',
                    styles.bg,
                    'border',
                    styles.border,
                    'flex items-center justify-center',
                    styles.glow,
                    'transition-all duration-300'
                  )}
                >
                  <Icon className={cn('w-7 h-7', styles.icon)} />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg text-ghost-white mb-2">{badge.title}</h3>
                <p className="text-sm text-mist-gray leading-relaxed">{badge.description}</p>
              </div>
            )
          })}
        </div>

        {/* GitHub CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/grimswap"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
              'bg-charcoal/50 border border-arcane-purple/20',
              'text-ghost-white font-medium',
              'hover:border-arcane-purple/40 hover:bg-charcoal/70',
              'transition-all duration-200'
            )}
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
