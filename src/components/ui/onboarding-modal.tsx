import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { Wallet, Lock, ArrowLeftRight, Gift, ChevronRight, ChevronLeft } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: () => void
}

const STEPS = [
  {
    icon: Wallet,
    title: 'Welcome to GrimSwap',
    description:
      'GrimSwap is a privacy-preserving DEX built on Uniswap v4. Your swaps are shielded by zero-knowledge proofs — no one can trace your transactions back to you.',
    accent: 'text-ethereal-cyan',
    iconBg: 'bg-ethereal-cyan/20',
    iconBorder: 'border-ethereal-cyan/50',
  },
  {
    icon: Lock,
    title: 'Deposit to GrimPool',
    description:
      'Head to the Grimoire page and deposit ETH or USDC into the GrimPool. Your deposit creates a cryptographic commitment that merges into a shared privacy set — hiding your identity among all depositors.',
    accent: 'text-arcane-purple',
    iconBg: 'bg-arcane-purple/20',
    iconBorder: 'border-arcane-purple/50',
  },
  {
    icon: ArrowLeftRight,
    title: 'Private Swap',
    description:
      'Generate a zero-knowledge proof to verify your deposit without revealing which one is yours. A relayer submits the swap on your behalf, and tokens arrive at a fresh stealth address.',
    accent: 'text-spectral-green',
    iconBg: 'bg-spectral-green/20',
    iconBorder: 'border-spectral-green/50',
  },
  {
    icon: Gift,
    title: 'Claim Your Tokens',
    description:
      'Back on the Grimoire page, you\'ll find your stealth addresses with received tokens. Claim them to any wallet you choose. The link between your deposit and withdrawal is cryptographically broken.',
    accent: 'text-ethereal-cyan',
    iconBg: 'bg-ethereal-cyan/20',
    iconBorder: 'border-ethereal-cyan/50',
  },
] as const

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stepContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setStep(0)

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      )
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      )
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const animateStepTransition = (direction: 'next' | 'prev', callback: () => void) => {
    if (!stepContentRef.current) {
      callback()
      return
    }

    const xOut = direction === 'next' ? -30 : 30
    const xIn = direction === 'next' ? 30 : -30

    gsap.to(stepContentRef.current, {
      x: xOut,
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        callback()
        gsap.fromTo(
          stepContentRef.current,
          { x: xIn, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }
        )
      },
    })
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      animateStepTransition('next', () => setStep((s) => s + 1))
    } else {
      handleClose()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      animateStepTransition('prev', () => setStep((s) => s - 1))
    }
  }

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.15 })
    gsap.to(contentRef.current, {
      scale: 0.95,
      opacity: 0,
      y: 10,
      duration: 0.15,
      onComplete: onComplete,
    })
  }

  if (!isOpen) return null

  const current = STEPS[step]
  const Icon = current.icon
  const isLastStep = step === STEPS.length - 1

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-void-black/85 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-md overflow-hidden',
          'rounded-2xl p-[1px]',
          'bg-gradient-to-br from-arcane-purple/50 via-transparent to-ethereal-cyan/50'
        )}
      >
        <div className="rounded-2xl bg-charcoal overflow-hidden">
          {/* Step Content */}
          <div className="px-6 pt-8 pb-6">
            <div ref={stepContentRef}>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl border-2 flex items-center justify-center',
                    current.iconBg,
                    current.iconBorder
                  )}
                >
                  <Icon className={cn('w-8 h-8', current.accent)} />
                </div>
              </div>

              {/* Title */}
              <h2
                className="font-display text-2xl text-ghost-white text-center mb-3"
              >
                {current.title}
              </h2>

              {/* Description */}
              <p className="text-mist-gray text-sm leading-relaxed text-center">
                {current.description}
              </p>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 pb-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === step
                    ? 'w-6 bg-ethereal-cyan'
                    : 'w-1.5 bg-mist-gray/30'
                )}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex items-center justify-between">
            {/* Left: Back or Skip */}
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-mist-gray hover:text-ghost-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="text-sm text-mist-gray hover:text-ghost-white transition-colors"
              >
                Skip
              </button>
            )}

            {/* Right: Next or Get Started */}
            <button
              onClick={handleNext}
              className={cn(
                'relative flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden',
                'hover:scale-[1.02] active:scale-[0.98]',
                isLastStep
                  ? 'text-void-black'
                  : 'bg-ethereal-cyan/10 text-ethereal-cyan hover:bg-ethereal-cyan/20 border border-ethereal-cyan/30'
              )}
              style={isLastStep ? {
                background: 'linear-gradient(135deg, #00EDDA 0%, #00b8aa 100%)',
                boxShadow: '0 0 20px rgba(0, 237, 218, 0.4)',
              } : undefined}
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
