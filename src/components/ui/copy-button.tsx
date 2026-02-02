import { cn } from '@/lib/utils'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, className, size = 'md' }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()

  const sizes = {
    sm: 'p-1',
    md: 'p-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }

  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        'rounded-lg transition-all duration-200',
        'hover:bg-white/5',
        copied ? 'text-spectral-green' : 'text-mist-gray hover:text-ghost-white',
        sizes[size],
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className={iconSizes[size]} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
    </button>
  )
}

// Address with copy functionality
interface AddressDisplayProps {
  address: string
  truncate?: boolean
  chars?: number
  className?: string
}

export function AddressDisplay({
  address,
  truncate = true,
  chars = 4,
  className,
}: AddressDisplayProps) {
  const displayAddress = truncate
    ? `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
    : address

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-mono text-sm text-ghost-white">{displayAddress}</span>
      <CopyButton text={address} size="sm" />
    </div>
  )
}
