import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
    )

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-xl',
    }

    // Variant-specific styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            className: cn(
              'text-white font-semibold',
              'hover:scale-[1.02] active:scale-[0.98]'
            ),
            style: {
              background: 'linear-gradient(135deg, #A4238B 0%, #6B21A8 100%)',
              boxShadow: '0 0 20px rgba(164, 35, 139, 0.3)',
              ...style,
            },
          }
        case 'secondary':
          return {
            className: 'hover:scale-[1.02] active:scale-[0.98]',
            style: {
              background: 'rgba(42, 20, 40, 0.8)',
              border: '1px solid rgba(0, 237, 218, 0.3)',
              color: '#00EDDA',
              ...style,
            },
          }
        case 'ghost':
          return {
            className: cn(
              'bg-transparent text-gray-400',
              'hover:text-white hover:bg-white/5'
            ),
            style,
          }
        case 'danger':
          return {
            className: '',
            style: {
              background: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#dc2626',
              ...style,
            },
          }
        case 'outline':
          return {
            className: cn(
              'bg-transparent text-white',
              'hover:bg-white/5'
            ),
            style: {
              border: '1px solid rgba(164, 35, 139, 0.3)',
              ...style,
            },
          }
        default:
          return { className: '', style }
      }
    }

    const variantStyles = getVariantStyles()

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizes[size],
          variantStyles.className,
          className
        )}
        style={variantStyles.style}
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
