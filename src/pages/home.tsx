import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Shield, Eye, Zap, Lock, ChevronDown, Github, Twitter } from 'lucide-react'

// Landing page sections
import { StatsSection } from '@/components/landing/stats-section'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { TokenGridSection } from '@/components/landing/token-grid'
import { SecuritySection } from '@/components/landing/security-section'
import { FAQSection } from '@/components/landing/faq-section'

const features = [
  {
    icon: Shield,
    title: 'Zero-Knowledge Proofs',
    description: 'ZK-SNARK technology hides you among all depositors. Prove you deposited without revealing which one.',
    color: 'purple',
  },
  {
    icon: Eye,
    title: 'Stealth Addresses',
    description: 'One-time addresses for every swap. No one can link your transactions together.',
    color: 'cyan',
  },
  {
    icon: Zap,
    title: 'Uniswap v4 Hooks',
    description: 'Built on the latest Uniswap technology for efficient, trustless swaps.',
    color: 'green',
  },
  {
    icon: Lock,
    title: 'Relayer Network',
    description: 'Relayers submit your transaction, hiding even your gas payment for complete privacy.',
    color: 'purple',
  },
]

const featureColors = {
  purple: {
    icon: 'text-arcane-purple',
    bg: 'bg-arcane-purple/20',
    border: 'border-arcane-purple/30',
    glow: 'group-hover:shadow-glow-purple',
  },
  cyan: {
    icon: 'text-ethereal-cyan',
    bg: 'bg-ethereal-cyan/20',
    border: 'border-ethereal-cyan/30',
    glow: 'group-hover:shadow-glow-cyan',
  },
  green: {
    icon: 'text-spectral-green',
    bg: 'bg-spectral-green/20',
    border: 'border-spectral-green/30',
    glow: 'group-hover:shadow-glow-green',
  },
}

// Floating orb component for background
function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={cn(
        'absolute rounded-full blur-[100px] animate-float',
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

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

      // Scroll indicator animation
      gsap.to('.scroll-indicator', {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'power1.inOut',
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
      {/* Hero Section with Enhanced Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Animated floating orbs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingOrb
            className="w-[500px] h-[500px] bg-arcane-purple/15 top-1/4 left-1/4 -translate-x-1/2"
            delay={0}
          />
          <FloatingOrb
            className="w-[400px] h-[400px] bg-ethereal-cyan/10 top-1/3 right-1/4"
            delay={2}
          />
          <FloatingOrb
            className="w-[300px] h-[300px] bg-spectral-green/10 bottom-1/4 left-1/3"
            delay={4}
          />
        </div>

        {/* Main glow pulse */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[800px] h-[800px] rounded-full',
              'bg-arcane-purple/20 blur-[150px]',
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
              <ShimmerButton className="w-full sm:w-auto btn-glow-purple">
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
                'transition-all duration-200',
                'flex items-center gap-2'
              )}
            >
              <Github className="w-5 h-5" />
              View Source
            </a>
          </div>

          {/* Hero Stats */}
          <div className="hero-element mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { value: '100%', label: 'Private' },
              { value: '0', label: 'Trace' },
              { value: '\u221E', label: 'Freedom' },
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

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
          <div
            className={cn(
              'w-10 h-10 rounded-full',
              'bg-charcoal/50 border border-arcane-purple/20',
              'flex items-center justify-center',
              'cursor-pointer hover:border-arcane-purple/40',
              'transition-colors duration-200'
            )}
            onClick={() => {
              document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <ChevronDown className="w-5 h-5 text-mist-gray" />
          </div>
        </div>
      </section>

      {/* Live Protocol Stats */}
      <div id="stats-section">
        <StatsSection />
      </div>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features Section (Enhanced) */}
      <section ref={featuresRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl text-ghost-white text-center mb-4">
            How the Magic Works
          </h2>
          <p className="text-mist-gray text-center max-w-2xl mx-auto mb-16">
            Advanced cryptographic techniques combined with DeFi innovation to bring you true financial privacy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              const colors = featureColors[feature.color as keyof typeof featureColors]
              return (
                <div
                  key={feature.title}
                  className={cn(
                    'feature-card group',
                    'p-6 rounded-2xl',
                    'bg-charcoal/50 border border-arcane-purple/10',
                    'hover:border-arcane-purple/30 hover:bg-charcoal/70',
                    'transition-all duration-300',
                    'hover:-translate-y-1'
                  )}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl mb-4',
                      colors.bg,
                      'border',
                      colors.border,
                      'flex items-center justify-center',
                      colors.glow,
                      'transition-all duration-300',
                      'animate-float'
                    )}
                    style={{ animationDelay: `${Math.random() * 2}s` }}
                  >
                    <Icon className={cn('w-7 h-7', colors.icon)} />
                  </div>
                  <h3 className="font-display text-xl text-ghost-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-mist-gray leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Supported Tokens */}
      <TokenGridSection />

      {/* Security & Trust */}
      <SecuritySection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section (Enhanced) */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Glow background */}
          <div className="relative">
            <div
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'w-[400px] h-[200px] rounded-full',
                'bg-arcane-purple/20 blur-[80px]'
              )}
            />

            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl text-ghost-white mb-4">
                Ready to Vanish?
              </h2>
              <p className="text-lg text-gradient-arcane font-display mb-2">
                Join the Dark Arts
              </p>
              <p className="text-mist-gray mb-8">
                Your transactions deserve privacy. Start swapping invisibly today.
              </p>

              <Link to="/swap">
                <ShimmerButton className="btn-glow-purple">
                  Cast Your First Spell
                </ShimmerButton>
              </Link>

              {/* Social links */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <a
                  href="https://twitter.com/grimswap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-12 h-12 rounded-xl',
                    'bg-charcoal/50 border border-arcane-purple/20',
                    'flex items-center justify-center',
                    'hover:border-arcane-purple/40 hover:bg-charcoal/70',
                    'transition-all duration-200'
                  )}
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-mist-gray" />
                </a>
                <a
                  href="https://github.com/grimswap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-12 h-12 rounded-xl',
                    'bg-charcoal/50 border border-arcane-purple/20',
                    'flex items-center justify-center',
                    'hover:border-arcane-purple/40 hover:bg-charcoal/70',
                    'transition-all duration-200'
                  )}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-mist-gray" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
