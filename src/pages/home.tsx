import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Shield, Eye, Zap, Lock } from 'lucide-react'

// Landing page sections
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { TokenGridSection } from '@/components/landing/token-grid'
import { SecuritySection } from '@/components/landing/security-section'
import { FAQSection } from '@/components/landing/faq-section'
import { FooterSection } from '@/components/landing/footer-section'

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
    color: 'pink' as const,
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
    iconBg: 'rgba(0, 237, 218, 0.15)',
    iconBorder: 'rgba(0, 237, 218, 0.3)',
    iconColor: '#00EDDA',
    titleColor: '#00EDDA',
  },
  pink: {
    iconBg: 'rgba(164, 35, 139, 0.2)',
    iconBorder: 'rgba(164, 35, 139, 0.4)',
    iconColor: '#c42aa8',
    titleColor: '#c42aa8',
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
      className="feature-card relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(18, 18, 20, 0.9)',
        border: `1px solid ${isHovered ? 'rgba(164, 35, 139, 0.5)' : 'rgba(164, 35, 139, 0.25)'}`,
        boxShadow: isHovered ? '0 0 30px rgba(164, 35, 139, 0.15)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
        style={{
          background: colors.iconBg,
          border: `1px solid ${colors.iconBorder}`,
        }}
      >
        <Icon className="w-7 h-7" style={{ color: colors.iconColor }} />
      </div>

      {/* Title */}
      <h3
        className="text-xl mb-3"
        style={{
          fontFamily: "'Crimson Text', serif",
          color: colors.titleColor,
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className="text-gray-400 leading-relaxed text-sm"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {feature.description}
      </p>
    </div>
  )
}

export function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Features animation
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
    }, featuresRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="landing-page">
      {/* Hero Section with Protocol Statistics - Seamless gradient flow */}
      <HeroSection />

      {/* How It Works + How The Magic Works - Single wrapper for seamless swirl */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#121214' }}
      >
        {/* Left Swirl Decoration - positioned below deposit icon */}
        <div
          className="absolute left-0 top-[450px] w-[650px] h-[1400px] pointer-events-none opacity-50 z-0"
          style={{
            backgroundImage: 'url(/assets/img/left-hero-swirl.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'left top',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* How It Works (3 steps) */}
        <HowItWorksSection />

        {/* Gradient overlay for How The Magic Works area */}
        <div
          className="absolute left-0 right-0 bottom-0 h-[1000px] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to top, #121214 0%, #4E357F 40%, #2A1F38 60%, #1C1520 75%, #151318 85%, transparent 100%)',
          }}
        />

        {/* How The Magic Works content */}
        <div ref={featuresRef} className="relative z-10 py-20 lg:py-28 px-6 lg:px-16">
          <div className="max-w-[1200px] mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 lg:mb-20">
              <h2
                className="text-4xl lg:text-6xl tracking-tight mb-6"
                style={{ fontFamily: "'Crimson Text', serif" }}
              >
                <span className="text-white">How The </span>
                <span className="text-[#00EDDA]">Magic</span>
                <span className="text-white"> Works</span>
              </h2>
              <p
                className="text-gray-400 max-w-xl mx-auto text-base lg:text-lg leading-relaxed"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Advanced cryptographic techniques combined with DeFi innovation to bring you true financial privacy.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Tokens */}
      <TokenGridSection />

      {/* Security & Trust */}
      <SecuritySection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA + Footer - Seamless gradient flow */}
      <FooterSection />
    </div>
  )
}
