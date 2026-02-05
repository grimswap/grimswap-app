import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Activity, Users, DollarSign, Globe, RefreshCw } from 'lucide-react'
import { useProtocolStats } from '@/hooks/use-protocol-stats'

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  isLoading: boolean
  delay?: number
  color: 'pink' | 'cyan'
}

const cardColors = {
  pink: {
    iconColor: '#A4238B',
    iconBg: 'rgba(164, 35, 139, 0.2)',
    iconBorder: 'rgba(164, 35, 139, 0.4)',
    hoverBorder: 'rgba(164, 35, 139, 0.5)',
    hoverGlow: 'rgba(164, 35, 139, 0.3)',
  },
  cyan: {
    iconColor: '#00EDDA',
    iconBg: 'rgba(0, 237, 218, 0.2)',
    iconBorder: 'rgba(0, 237, 218, 0.4)',
    hoverBorder: 'rgba(0, 237, 218, 0.5)',
    hoverGlow: 'rgba(0, 237, 218, 0.3)',
  },
}

function StatCard({ icon: Icon, label, value, isLoading, delay = 0, color }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const colors = cardColors[color]

  useEffect(() => {
    if (isLoading) return

    if (typeof value === 'string') {
      setDisplayValue(value)
      setHasAnimated(true)
      return
    }

    const numValue = Number(value)
    if (isNaN(numValue) || numValue === 0) {
      setDisplayValue(value)
      setHasAnimated(true)
      return
    }

    if (hasAnimated) {
      setDisplayValue(value)
      return
    }

    const duration = 1.5
    const startTime = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(numValue * eased)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setHasAnimated(true)
      }
    }

    const timer = setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, isLoading, delay, hasAnimated])

  return (
    <div
      className="stat-card p-6 rounded-2xl transition-all duration-300"
      style={{
        background: 'rgba(42, 20, 40, 0.6)',
        border: `1px solid ${isHovered ? colors.hoverBorder : 'rgba(164, 35, 139, 0.2)'}`,
        boxShadow: isHovered ? `0 0 25px ${colors.hoverGlow}` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
        style={{
          background: colors.iconBg,
          border: `1px solid ${colors.iconBorder}`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color: colors.iconColor }} />
      </div>

      {/* Value */}
      {isLoading ? (
        <div className="h-8 w-24 bg-white/10 rounded mb-2 animate-pulse" />
      ) : (
        <div className="text-2xl sm:text-3xl font-display text-white mb-1">
          {displayValue}
        </div>
      )}

      {/* Label */}
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

export function StatsSection() {
  const { stats, isLoading, error, refetch } = useProtocolStats()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
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

  const formatEthPrice = (price: number): string => {
    if (!price || price === 0) return '—'
    return `$${price.toFixed(2)}`
  }

  const statItems: Array<{
    icon: React.ElementType
    label: string
    value: string | number
    color: 'pink' | 'cyan'
  }> = [
    { icon: Activity, label: 'Pool Liquidity', value: stats.poolLiquidity, color: 'pink' },
    { icon: Users, label: 'Privacy Deposits', value: stats.depositCount, color: 'cyan' },
    { icon: DollarSign, label: 'ETH Price', value: formatEthPrice(stats.ethPrice), color: 'pink' },
    { icon: Globe, label: 'Network', value: stats.network, color: 'cyan' },
  ]

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-3">
            <span className="text-gradient-cyan">Protocol</span> Statistics
          </h2>
          <p className="text-gray-400 text-sm">
            {error ? 'Showing cached data' : 'Live Data From the GrimSwap Protocol'}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item, index) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              isLoading={isLoading}
              delay={index * 0.1}
              color={item.color}
            />
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <p className="text-gray-500 text-sm">Unable to fetch live data</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
