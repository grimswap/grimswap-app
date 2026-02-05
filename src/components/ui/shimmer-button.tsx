import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function ShimmerButton({ children, className, disabled, variant = 'primary', ...props }: ShimmerButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <button
      disabled={disabled}
      className={cn(
        'group relative inline-flex items-center justify-center',
        'w-full px-8 py-4 rounded-xl overflow-hidden',
        'font-semibold text-base',
        'transition-all duration-300',
        'hover:scale-[1.02] active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        isPrimary
          ? 'text-void-black'
          : 'bg-transparent border border-ethereal-cyan/50 text-ethereal-cyan hover:bg-ethereal-cyan/10',
        className
      )}
      style={isPrimary ? {
        background: 'linear-gradient(135deg, #00EDDA 0%, #00b8aa 100%)',
        boxShadow: '0 0 20px rgba(0, 237, 218, 0.4)',
      } : undefined}
      {...props}
    >
      {/* Shimmer effect */}
      <div
        className={cn(
          'absolute inset-0 -translate-x-full',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'group-hover:translate-x-full',
          'transition-transform duration-1000',
          'group-disabled:group-hover:translate-x-[-100%]'
        )}
      />

      {/* Glow effect on hover */}
      {isPrimary && (
        <div
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100',
            'transition-opacity duration-300'
          )}
          style={{
            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
          }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
