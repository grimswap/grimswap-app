import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: cn(
        'bg-gradient-to-r from-arcane-purple to-purple-deep',
        'text-ghost-white font-semibold',
        'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
        'hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]',
        'hover:scale-[1.02] active:scale-[0.98]'
      ),
      secondary: cn(
        'bg-charcoal border border-spectral-green/30',
        'text-spectral-green',
        'hover:border-spectral-green/60',
        'hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]'
      ),
      ghost: cn(
        'bg-transparent text-mist-gray',
        'hover:text-ghost-white hover:bg-white/5'
      ),
      danger: cn(
        'bg-blood-crimson/20 border border-blood-crimson/30',
        'text-blood-crimson',
        'hover:bg-blood-crimson/30 hover:border-blood-crimson/50'
      ),
      outline: cn(
        'bg-transparent border border-arcane-purple/30',
        'text-ghost-white',
        'hover:border-arcane-purple/60 hover:bg-arcane-purple/10'
      ),
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
