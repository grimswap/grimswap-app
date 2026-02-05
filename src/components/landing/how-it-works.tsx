import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Wallet, Shield, ArrowLeftRight } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Wallet,
    title: 'Deposit',
    subtitle: 'Enter the Privacy Pool',
    description: 'Deposit ETH into the GrimPool and merge into a shared privacy set.',
    color: 'pink' as const,
  },
  {
    number: 2,
    icon: Shield,
    title: 'Prove',
    subtitle: 'Generate ZK Proof',
    description: 'Prove ownership with zero-knowledge — without revealing yourself.',
    color: 'cyan' as const,
  },
  {
    number: 3,
    icon: ArrowLeftRight,
    title: 'Swap',
    subtitle: 'Execute Private Trade',
    description: 'Execute a private swap. Your transaction leaves no trace.',
    color: 'pink' as const,
  },
]

const stepColors = {
  pink: {
    iconColor: '#A4238B',
    iconBg: 'rgba(164, 35, 139, 0.2)',
    iconBorder: 'rgba(164, 35, 139, 0.4)',
    hoverBorder: 'rgba(164, 35, 139, 0.5)',
    hoverGlow: 'rgba(164, 35, 139, 0.3)',
    numberBg: '#A4238B',
    numberText: '#ffffff',
  },
  cyan: {
    iconColor: '#00EDDA',
    iconBg: 'rgba(0, 237, 218, 0.2)',
    iconBorder: 'rgba(0, 237, 218, 0.4)',
    hoverBorder: 'rgba(0, 237, 218, 0.5)',
    hoverGlow: 'rgba(0, 237, 218, 0.3)',
    numberBg: '#00EDDA',
    numberText: '#121214',
  },
}

interface StepCardProps {
  step: typeof steps[0]
}

function StepCard({ step }: StepCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = step.icon
  const colors = stepColors[step.color]

  return (
    <div
      className="step-item p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(42, 20, 40, 0.6)',
        border: `1px solid ${isHovered ? colors.hoverBorder : 'rgba(164, 35, 139, 0.2)'}`,
        boxShadow: isHovered ? `0 0 25px ${colors.hoverGlow}` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon container */}
      <div className="relative inline-block mb-4">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto"
          style={{
            background: colors.iconBg,
            border: `1px solid ${colors.iconBorder}`,
          }}
        >
          <Icon className="w-8 h-8" style={{ color: colors.iconColor }} />
        </div>
        {/* Step number */}
        <div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: colors.numberBg,
            color: colors.numberText,
          }}
        >
          {step.number}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-xl mb-1 text-white">
        {step.title}
      </h3>
      <p className="text-gray-400 text-sm mb-3">{step.subtitle}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
    </div>
  )
}

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.step-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
            How It <span className="text-gradient-cyan">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three simple steps to complete your first private swap using zero-knowledge proofs.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  )
}
