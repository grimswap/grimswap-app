import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { Token } from './token-selector-modal'

interface TokenInputProps {
  label: string
  amount: string
  onAmountChange: (amount: string) => void
  token: Token | null
  onTokenSelect?: () => void
  balance?: string
  disabled?: boolean
  className?: string
}

export function TokenInput({
  label,
  amount,
  onAmountChange,
  token,
  onTokenSelect,
  balance,
  disabled,
  className,
}: TokenInputProps) {
  const handlePercentage = (percent: number) => {
    if (balance) {
      const bal = parseFloat(balance.replace(/,/g, ''))
      onAmountChange(((bal * percent) / 100).toString())
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl p-4',
        'bg-obsidian/50 border border-transparent',
        'focus-within:border-arcane-purple/50',
        'transition-all duration-200',
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-mist-gray">{label}</span>
        {balance && (
          <span className="text-sm text-mist-gray">
            Balance:{' '}
            <span className="text-ghost-white font-mono">{balance}</span>
          </span>
        )}
      </div>

      {/* Input row */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, '')
            onAmountChange(value)
          }}
          placeholder="0.0"
          disabled={disabled}
          className={cn(
            'flex-1 min-w-0 bg-transparent',
            'text-2xl font-mono text-ghost-white',
            'placeholder:text-mist-gray/50',
            'focus:outline-none',
            disabled && 'cursor-not-allowed opacity-70'
          )}
        />

        <button
          type="button"
          onClick={onTokenSelect}
          disabled={!onTokenSelect}
          className={cn(
            'flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl',
            'bg-charcoal border border-mist-gray/20',
            'hover:border-arcane-purple/50 transition-all',
            !onTokenSelect && 'cursor-default'
          )}
        >
          {token ? (
            <>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-charcoal">
                {token.logoURI ? (
                  <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-[8px] font-bold text-ghost-white">
                    {token.symbol.slice(0, 2)}
                  </span>
                )}
              </div>
              <span className="font-medium text-ghost-white whitespace-nowrap">{token.symbol}</span>
            </>
          ) : (
            <span className="font-medium text-ghost-white whitespace-nowrap">Select</span>
          )}
          {onTokenSelect && <ChevronDown className="w-4 h-4 text-mist-gray flex-shrink-0" />}
        </button>
      </div>

      {/* Percentage buttons */}
      {balance && !disabled && (
        <div className="flex gap-2 mt-3">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => handlePercentage(percent)}
              className={cn(
                'flex-1 px-2 py-1.5 rounded-lg text-xs font-medium',
                'bg-arcane-purple/10 text-ethereal-cyan border border-arcane-purple/20',
                'hover:bg-arcane-purple/20 hover:border-arcane-purple/40 transition-colors'
              )}
            >
              {percent === 100 ? 'MAX' : `${percent}%`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
