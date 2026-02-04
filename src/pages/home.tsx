import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Shield, Eye, Zap, Lock } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Zero-Knowledge Proofs',
    description: 'ZK-SNARK technology hides you among all depositors. Prove you deposited without revealing which one.',
  },
  {
    icon: Eye,
    title: 'Stealth Addresses',
    description: 'One-time addresses for every swap. No one can link your transactions together.',
  },
  {
    icon: Zap,
    title: 'Uniswap v4 Hooks',
    description: 'Built on the latest Uniswap technology for efficient, trustless swaps.',
  },
  {
    icon: Lock,
    title: 'Relayer Network',
    description: 'Relayers submit your transaction, hiding even your gas payment for complete privacy.',
  },
]

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from('.hero-element', {
        y: 60,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Features animation
      gsap.from('.feature-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef}>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4">
        {/* Animated background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[600px] h-[600px] rounded-full',
              'bg-arcane-purple/20 blur-[100px]',
              'animate-glow-pulse'
            )}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="hero-element font-display text-5xl sm:text-6xl md:text-7xl text-ghost-white mb-6">
            The Dark Arts
            <br />
            <span className="text-gradient-arcane">of DeFi</span>
          </h1>

          <p className="hero-element text-lg sm:text-xl text-mist-gray max-w-2xl mx-auto mb-8">
            Privacy-preserving token swaps powered by ZK-SNARK proofs and stealth addresses.
            Trade invisibly on Uniswap v4.
          </p>

          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/swap">
              <ShimmerButton className="w-full sm:w-auto">
                Enter the Grimoire
              </ShimmerButton>
            </Link>
            <a
              href="https://github.com/grimswap"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'px-8 py-4 rounded-xl',
                'bg-charcoal/50 border border-arcane-purple/30',
                'text-ghost-white font-medium',
                'hover:border-arcane-purple/60 hover:bg-charcoal/70',
                'transition-all duration-200'
              )}
            >
              View Source
            </a>
          </div>

          {/* Stats */}
          <div className="hero-element mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { value: '100%', label: 'Private' },
              { value: '0', label: 'Trace' },
              { value: '∞', label: 'Freedom' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display text-spectral-green">
                  {stat.value}
                </div>
                <div className="text-sm text-mist-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl text-ghost-white text-center mb-16">
            How the Magic Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={cn(
                    'feature-card',
                    'p-6 rounded-2xl',
                    'bg-charcoal/50 border border-arcane-purple/10',
                    'hover:border-arcane-purple/30 hover:bg-charcoal/70',
                    'transition-all duration-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl mb-4',
                      'bg-arcane-purple/20 border border-arcane-purple/30',
                      'flex items-center justify-center'
                    )}
                  >
                    <Icon className="w-6 h-6 text-arcane-purple" />
                  </div>
                  <h3 className="font-display text-xl text-ghost-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-mist-gray">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-ghost-white mb-6">
            Ready to Vanish?
          </h2>
          <p className="text-mist-gray mb-8">
            Your transactions deserve privacy. Start swapping invisibly today.
          </p>
          <Link to="/swap">
            <ShimmerButton>
              Cast Your First Spell
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </div>
  )
}
