import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Wallet, Shield, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  {
    number: 1,
    icon: Wallet,
    title: 'Deposit',
    subtitle: 'Enter the Privacy Pool',
    description:
      'Deposit ETH into the GrimPool. Your funds are mixed with other depositors, creating a privacy set.',
  },
  {
    number: 2,
    icon: Shield,
    title: 'Prove',
    subtitle: 'Generate ZK Proof',
    description:
      'Generate a zero-knowledge proof that proves you deposited without revealing which deposit is yours.',
  },
  {
    number: 3,
    icon: ArrowLeftRight,
    title: 'Swap',
    subtitle: 'Execute Private Trade',
    description:
      'Submit your proof to execute a private swap on Uniswap v4. Your transaction is unlinkable to your original deposit.',
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate steps
      gsap.from('.step-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      // Animate connecting lines
      gsap.from('.step-line', {
        scaleX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
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
            How It Works
          </h2>
          <p className="text-mist-gray max-w-2xl mx-auto">
            Three simple steps to complete your first private swap using zero-knowledge proofs.
          </p>
        </div>

        {/* Steps - Horizontal on desktop, Vertical on mobile */}
        <div className="relative">
          {/* Desktop layout */}
          <div className="hidden md:flex items-start justify-between gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="step-item flex-1 relative">
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'step-line absolute top-10 left-[60%] w-[80%] h-px',
                        'bg-gradient-to-r from-arcane-purple/50 to-spectral-green/50',
                        'origin-left'
                      )}
                    />
                  )}

                  <div className="flex flex-col items-center text-center">
                    {/* Icon container */}
                    <div className="relative mb-6">
                      {/* Glow ring */}
                      <div
                        className={cn(
                          'absolute inset-0 rounded-full',
                          'bg-arcane-purple/20 blur-xl',
                          'animate-glow-pulse'
                        )}
                      />
                      <div
                        className={cn(
                          'relative w-20 h-20 rounded-full',
                          'bg-charcoal border-2 border-arcane-purple/30',
                          'flex items-center justify-center',
                          'hover:border-arcane-purple/60 hover:shadow-glow-purple',
                          'transition-all duration-300'
                        )}
                      >
                        <Icon className="w-8 h-8 text-arcane-purple" />
                      </div>
                      {/* Step number */}
                      <div
                        className={cn(
                          'absolute -top-2 -right-2',
                          'w-8 h-8 rounded-full',
                          'bg-spectral-green text-void-black',
                          'flex items-center justify-center',
                          'font-display font-bold text-sm'
                        )}
                      >
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-xl text-ghost-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-ethereal-cyan text-sm mb-3">{step.subtitle}</p>
                    <p className="text-mist-gray text-sm leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile layout - Vertical */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="step-item relative flex gap-4">
                  {/* Vertical connecting line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-10 top-20 w-px h-[calc(100%+2rem)]',
                        'bg-gradient-to-b from-arcane-purple/50 to-spectral-green/50'
                      )}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={cn(
                        'relative w-20 h-20 rounded-full',
                        'bg-charcoal border-2 border-arcane-purple/30',
                        'flex items-center justify-center'
                      )}
                    >
                      <Icon className="w-8 h-8 text-arcane-purple" />
                    </div>
                    {/* Step number */}
                    <div
                      className={cn(
                        'absolute -top-2 -right-2',
                        'w-8 h-8 rounded-full',
                        'bg-spectral-green text-void-black',
                        'flex items-center justify-center',
                        'font-display font-bold text-sm'
                      )}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="font-display text-xl text-ghost-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-ethereal-cyan text-sm mb-2">{step.subtitle}</p>
                    <p className="text-mist-gray text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
