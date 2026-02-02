import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function ShimmerButton({ children, className, disabled, ...props }: ShimmerButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'group relative inline-flex items-center justify-center',
        'w-full px-8 py-4 rounded-xl overflow-hidden',
        'bg-gradient-to-r from-arcane-purple to-purple-deep',
        'text-ghost-white font-semibold text-base',
        'transition-all duration-300',
        'hover:scale-[1.01] active:scale-[0.99]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        className
      )}
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

      {/* Glow effect */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100',
          'shadow-[inset_0_0_20px_rgba(139,92,246,0.3)]',
          'transition-opacity duration-300'
        )}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
