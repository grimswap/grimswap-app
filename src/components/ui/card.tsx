import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: 'purple' | 'green' | 'cyan' | 'none'
}

export function Card({ children, className, glow = 'purple' }: CardProps) {
  const glowStyles = {
    purple: 'hover:shadow-[0_0_30px_rgba(164,35,139,0.2)]',
    green: 'hover:shadow-[0_0_30px_rgba(0,237,218,0.2)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(0,237,218,0.2)]',
    none: '',
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl p-[1px]',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(164, 35, 139, 0.3) 0%, transparent 50%, rgba(0, 237, 218, 0.3) 100%)',
      }}
    >
      <div
        className={cn(
          'rounded-2xl backdrop-blur-xl',
          'transition-all duration-500',
          glowStyles[glow]
        )}
        style={{
          background: 'rgba(42, 20, 40, 0.9)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      style={{ borderBottom: '1px solid rgba(164, 35, 139, 0.15)' }}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      style={{ borderTop: '1px solid rgba(164, 35, 139, 0.15)' }}
    >
      {children}
    </div>
  )
}
