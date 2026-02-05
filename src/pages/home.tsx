import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
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
    color: 'cyan' as const,
  },
  {
    icon: Eye,
    title: 'Stealth Addresses',
    description: 'One-time addresses for every swap. No one can link your transactions together.',
    color: 'cyan' as const,
  },
  {
    icon: Zap,
    title: 'Uniswap v4 Hooks',
    description: 'Built on the latest Uniswap technology for efficient, trustless swaps.',
    color: 'cyan' as const,
  },
  {
    icon: Lock,
    title: 'Relayer Network',
    description: 'Relayers submit your transaction, hiding even your gas payment for complete privacy.',
    color: 'cyan' as const,
  },
]

const featureColors = {
  cyan: {
    iconColor: '#00EDDA',
    iconBg: 'rgba(0, 237, 218, 0.2)',
    iconBorder: 'rgba(0, 237, 218, 0.4)',
    hoverBorder: 'rgba(0, 237, 218, 0.5)',
    hoverGlow: 'rgba(0, 237, 218, 0.3)',
  },
}

interface FeatureCardProps {
  feature: typeof features[0]
}

function FeatureCard({ feature }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = feature.icon
  const colors = featureColors[feature.color]

  return (
    <div
      className="feature-card p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(42, 20, 40, 0.6)',
        border: `1px solid ${isHovered ? colors.hoverBorder : 'rgba(164, 35, 139, 0.2)'}`,
        boxShadow: isHovered ? `0 0 25px ${colors.hoverGlow}` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
        style={{
          background: colors.iconBg,
          border: `1px solid ${colors.iconBorder}`,
        }}
      >
        <Icon className="w-7 h-7" style={{ color: colors.iconColor }} />
      </div>
      <h3 className="font-display text-xl text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
    </div>
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

      // Features animation - use immediateRender: false to prevent invisible cards
      gsap.fromTo(
        '.feature-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="hero-element font-display text-5xl sm:text-6xl md:text-7xl text-white mb-6 tracking-wide">
            THE DARK ARTS
            <br />
            <span className="text-gradient-cyan">OF DEFI</span>
          </h1>

          <p className="hero-element text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Privacy-preserving token swaps powered by ZK-SNARK proofs and stealth addresses.
            Trade invisibly on Uniswap v4.
          </p>

          <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/swap">
              <ShimmerButton className="w-full sm:w-auto">
                Enter the Grimoire
              </ShimmerButton>
            </Link>
            {/* <Link
              to="/swap"
              className="px-8 py-4 rounded-xl bg-transparent text-white font-medium transition-all duration-200 flex items-center gap-2"
              style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              View Source
            </Link> */}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={() => {
              document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Live Protocol Stats */}
      <div id="stats-section">
        <StatsSection />
      </div>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl text-white text-center mb-4">
            How The <span className="text-gradient-cyan">Magic</span> Works
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Advanced cryptographic techniques combined with DeFi innovation to bring you true financial privacy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Supported Tokens */}
      <TokenGridSection />

      {/* Security & Trust */}
      <SecuritySection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            {/* Glow background */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-[80px] opacity-30"
              style={{ background: 'radial-gradient(circle, #00EDDA 0%, transparent 70%)' }}
            />

            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">
                Ready To <span className="text-gradient-cyan">Vanish</span>?
              </h2>
              <p className="text-gray-400 mb-8">
                Your transactions deserve privacy. Start swapping invisibly today.
              </p>

              <Link to="/swap">
                <ShimmerButton>Cast Your First Spell</ShimmerButton>
              </Link>

              {/* Social links */}
              <div className="mt-8 flex items-center justify-center gap-4">
                {[
                  { icon: Twitter, href: 'https://twitter.com/grimswap', label: 'Twitter' },
                  { icon: Github, href: 'https://github.com/grimswap', label: 'GitHub' },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(164, 35, 139, 0.4)'
                        e.currentTarget.style.background = 'rgba(164, 35, 139, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
