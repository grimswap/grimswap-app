import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SwapCard } from '@/components/swap/swap-card'
import { PoolStatistics } from '@/components/swap/pool-statistics'

export function SwapPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.swap-element', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-[calc(100vh-5rem)] py-8 sm:py-12 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 xl:gap-8">
          {/* Swap Card */}
          <div className="swap-element w-full max-w-md">
            <SwapCard />
          </div>

          {/* Pool Statistics (Large screens only) */}
          <div className="swap-element hidden xl:block flex-shrink-0">
            <PoolStatistics />
          </div>
        </div>
      </div>
    </div>
  )
}
