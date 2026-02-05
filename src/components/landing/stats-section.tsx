import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Activity, Users, DollarSign, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProtocolStats } from '@/hooks/use-protocol-stats'

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  suffix?: string
  isLoading: boolean
  delay?: number
}

function StatCard({ icon: Icon, label, value, suffix = '', isLoading, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0)
  const cardRef = useRef<HTMLDivElement>(null)

  // Animate number counting
  useEffect(() => {
    if (isLoading || typeof value === 'string') {
      setDisplayValue(value)
      return
    }

    const numValue = Number(value)
    if (isNaN(numValue)) {
      setDisplayValue(value)
      return
    }

    // Animate from 0 to value
    const duration = 1.5
    const startTime = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(numValue * eased)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const timer = setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, isLoading, delay])

  return (
    <div
      ref={cardRef}
      className={cn(
        'stat-card group relative p-6 rounded-2xl',
        'bg-charcoal/50 backdrop-blur-xl',
        'border border-arcane-purple/10',
        'hover:border-arcane-purple/30',
        'transition-all duration-300',
        'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]'
      )}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100',
          'bg-gradient-to-br from-arcane-purple/5 to-transparent',
          'transition-opacity duration-300'
        )}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl mb-4',
            'bg-arcane-purple/20 border border-arcane-purple/30',
            'flex items-center justify-center',
            'group-hover:shadow-glow-purple',
            'transition-all duration-300'
          )}
        >
          <Icon className="w-6 h-6 text-arcane-purple" />
        </div>

        {/* Value */}
        {isLoading ? (
          <div className="h-8 w-24 skeleton rounded mb-2" />
        ) : (
          <div className="text-2xl sm:text-3xl font-display text-ghost-white mb-1">
            {displayValue}
            {suffix && <span className="text-mist-gray text-lg ml-1">{suffix}</span>}
          </div>
        )}

        {/* Label */}
        <div className="text-sm text-mist-gray">{label}</div>
      </div>
    </div>
  )
}

export function StatsSection() {
  const { stats, isLoading, error } = useProtocolStats()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
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

  const statItems = [
    {
      icon: Activity,
      label: 'Pool Liquidity',
      value: stats?.poolLiquidity || '—',
      suffix: '',
    },
    {
      icon: Users,
      label: 'Privacy Deposits',
      value: stats?.depositCount || 0,
      suffix: '',
    },
    {
      icon: DollarSign,
      label: 'ETH Price',
      value: stats?.ethPrice ? `$${stats.ethPrice.toFixed(2)}` : '—',
      suffix: '',
    },
    {
      icon: Globe,
      label: 'Network',
      value: stats?.network || 'Unichain Sepolia',
      suffix: '',
    },
  ]

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl text-ghost-white mb-3">
            Protocol Statistics
          </h2>
          <p className="text-mist-gray text-sm">Live data from the GrimSwap protocol</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item, index) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              suffix={item.suffix}
              isLoading={isLoading}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Error state */}
        {error && (
          <p className="text-center text-blood-crimson/80 text-sm mt-4">
            Unable to fetch live data. Showing cached values.
          </p>
        )}
      </div>
    </section>
  )
}
