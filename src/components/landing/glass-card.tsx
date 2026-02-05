import { cn } from '@/lib/utils'
import { useState } from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverColor?: 'pink' | 'cyan'
}

const hoverColors = {
  pink: {
    borderColor: 'rgba(164, 35, 139, 0.4)',
    glowColor: 'rgba(164, 35, 139, 0.3)',
  },
  cyan: {
    borderColor: 'rgba(0, 237, 218, 0.4)',
    glowColor: 'rgba(0, 237, 218, 0.3)',
  },
}

export function GlassCard({ children, className, hoverColor = 'pink' }: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const colors = hoverColors[hoverColor]

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        className
      )}
      style={{
        background: 'rgba(42, 20, 40, 0.6)',
        border: `1px solid ${isHovered ? colors.borderColor : 'rgba(164, 35, 139, 0.2)'}`,
        boxShadow: isHovered ? `0 0 25px ${colors.glowColor}` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}
