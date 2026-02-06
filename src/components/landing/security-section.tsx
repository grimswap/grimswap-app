import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Shield, Github, Lock, Beaker } from 'lucide-react'

const mainFeature = {
  icon: Shield,
  title: 'ZK-Verified',
  description:
    'All proofs verified on-chain by the Groth16 verifier contract. Your privacy is guaranteed by mathematics, not trust.',
}

const secondaryFeatures = [
  {
    icon: Github,
    title: 'Open Source',
    description: 'Code auditable on GitHub. Verify the smart contracts yourself.',
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'You control your keys. We never have access to your funds.',
  },
  {
    icon: Beaker,
    title: 'Testnet Phase',
    description: 'Currently deployed on Unichain Sepolia for testing and development.',
  },
]

interface SmallCardProps {
  feature: typeof secondaryFeatures[0]
}

function SmallCard({ feature }: SmallCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = feature.icon

  return (
    <div
      className="trust-badge p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(18, 18, 20, 0.9)',
        border: `1px solid ${isHovered ? 'rgba(0, 237, 218, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow: isHovered ? '0 0 25px rgba(0, 237, 218, 0.15)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
        style={{
          background: 'rgba(0, 237, 218, 0.1)',
          border: '1px solid rgba(0, 237, 218, 0.3)',
        }}
      >
        <Icon className="w-6 h-6" style={{ color: '#00EDDA' }} />
      </div>

      {/* Content */}
      <h3
        className="text-lg text-white mb-2"
        style={{ fontFamily: "'Crimson Text', serif" }}
      >
        {feature.title}
      </h3>
      <p
        className="text-sm text-gray-400 leading-relaxed"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {feature.description}
      </p>
    </div>
  )
}

export function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMainHovered, setIsMainHovered] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.main-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        '.trust-badge',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
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

  const MainIcon = mainFeature.icon

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 px-6 lg:px-16 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #121214 0%, #1C0E1B 20%, #2A1428 50%, #1C0E1B 80%, #121214 100%)',
      }}
    >
      {/* Left Swirl Decoration */}
      <div
        className="absolute left-0 bottom-0 w-[400px] h-[500px] pointer-events-none opacity-30"
        style={{
          backgroundImage: 'url(/assets/img/left-hero-swirl.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'left bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-4xl lg:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            <span className="text-white">Security & </span>
            <span className="text-[#00EDDA]">Trust</span>
          </h2>
          <p
            className="text-gray-400 max-w-xl mx-auto text-base"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Built with security-first principles. Your privacy and funds are protected by cryptographic proofs.
          </p>
        </div>

        {/* Main ZK-Verified Card */}
        <div
          className="main-card relative p-8 lg:p-12 rounded-3xl mb-6 overflow-hidden transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(164, 35, 139, 0.15) 0%, rgba(107, 33, 168, 0.15) 50%, rgba(0, 237, 218, 0.1) 100%)',
            border: `1px solid ${isMainHovered ? 'rgba(0, 237, 218, 0.4)' : 'rgba(164, 35, 139, 0.3)'}`,
            boxShadow: isMainHovered ? '0 0 40px rgba(0, 237, 218, 0.15)' : 'none',
          }}
          onMouseEnter={() => setIsMainHovered(true)}
          onMouseLeave={() => setIsMainHovered(false)}
        >
          {/* Background decoration */}
          <div
            className="absolute right-0 top-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00EDDA 0%, transparent 70%)' }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(164, 35, 139, 0.2)',
                border: '1px solid rgba(164, 35, 139, 0.4)',
              }}
            >
              <MainIcon className="w-10 h-10" style={{ color: '#A4238B' }} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3
                className="text-2xl lg:text-3xl text-white mb-3"
                style={{ fontFamily: "'Crimson Text', serif" }}
              >
                {mainFeature.title}
              </h3>
              <p
                className="text-gray-400 leading-relaxed max-w-2xl"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {mainFeature.description}
              </p>
            </div>

            {/* Badge */}
            <div
              className="px-4 py-2 rounded-full flex-shrink-0"
              style={{
                background: 'rgba(0, 237, 218, 0.1)',
                border: '1px solid rgba(0, 237, 218, 0.3)',
              }}
            >
              <span className="text-sm" style={{ color: '#00EDDA', fontFamily: 'Poppins, sans-serif' }}>
                Groth16 Verified
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryFeatures.map((feature) => (
            <SmallCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
