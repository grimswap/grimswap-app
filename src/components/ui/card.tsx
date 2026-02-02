import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: 'purple' | 'green' | 'cyan' | 'none'
}

export function Card({ children, className, glow = 'purple' }: CardProps) {
  const glowStyles = {
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    green: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
    none: '',
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl p-[1px]',
        'bg-gradient-to-br from-arcane-purple/30 via-transparent to-spectral-green/30',
        className
      )}
    >
      <div
        className={cn(
          'rounded-2xl bg-charcoal/90 backdrop-blur-xl',
          'transition-all duration-500',
          glowStyles[glow]
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-arcane-purple/10', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-arcane-purple/10', className)}>
      {children}
    </div>
  )
}
