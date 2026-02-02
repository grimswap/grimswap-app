import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm text-mist-gray">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-gray">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-obsidian/50 border border-transparent',
              'text-ghost-white placeholder:text-shadow-gray',
              'focus:outline-none focus:border-arcane-purple/50',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-blood-crimson/50',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-blood-crimson">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
