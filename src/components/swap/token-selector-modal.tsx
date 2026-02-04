import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { ETH, USDC } from '@/lib/tokens'
import { useNativeBalance, useTokenBalance } from '@/hooks/use-token-balance'
import { useAccount } from 'wagmi'

// Re-export Token type from tokens.ts for compatibility
export type { Token } from '@/lib/tokens'
import type { Token } from '@/lib/tokens'

// Only ETH and USDC are available on Unichain Sepolia pool
const AVAILABLE_TOKENS = [ETH, USDC]

interface TokenSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (token: Token) => void
  selectedToken?: Token | null
}

export function TokenSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}: TokenSelectorModalProps) {
  const { isConnected } = useAccount()

  // Fetch real balances
  const { formatted: ethBalance, isLoading: ethLoading } = useNativeBalance()
  const { formatted: usdcBalance, isLoading: usdcLoading } = useTokenBalance(USDC.address)

  const handleSelect = (token: Token) => {
    onSelect(token)
    onClose()
  }

  // Get balance for a token
  const getBalance = (symbol: string): string => {
    if (!isConnected) return '—'
    if (symbol === 'ETH') return ethLoading ? '...' : parseFloat(ethBalance).toFixed(4)
    if (symbol === 'USDC') return usdcLoading ? '...' : parseFloat(usdcBalance).toFixed(2)
    return '0'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Token">
      {/* Info banner */}
      <div className="px-4 pt-4 pb-2">
        <div className="p-3 rounded-lg bg-arcane-purple/10 border border-arcane-purple/20">
          <p className="text-xs text-mist-gray">
            Trading pair: <span className="text-ghost-white font-medium">ETH/USDC</span> on Unichain Sepolia
          </p>
        </div>
      </div>

      {/* Token list */}
      <div className="p-2">
        {AVAILABLE_TOKENS.map((token) => {
          const isSelected = selectedToken?.address.toLowerCase() === token.address.toLowerCase()
          const balance = getBalance(token.symbol)

          return (
            <button
              key={token.address}
              onClick={() => handleSelect(token)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl',
                'hover:bg-white/5 transition-all',
                isSelected && 'bg-arcane-purple/10 border border-arcane-purple/30'
              )}
            >
              {/* Token icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: token.color
                    ? `linear-gradient(135deg, ${token.color}40, ${token.color})`
                    : 'linear-gradient(135deg, #8B5CF6, #00D4FF)',
                }}
              >
                <span className="text-sm font-bold text-white">
                  {token.symbol === 'ETH' ? 'Ξ' : '$'}
                </span>
              </div>

              {/* Token info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ghost-white">
                    {token.symbol}
                  </span>
                  {isSelected && (
                    <span className="text-xs px-2 py-0.5 rounded bg-arcane-purple/20 text-arcane-purple">
                      Selected
                    </span>
                  )}
                </div>
                <span className="text-sm text-mist-gray">{token.name}</span>
              </div>

              {/* Balance */}
              <div className="text-right">
                <span className="text-sm font-mono text-ghost-white">
                  {balance}
                </span>
                <p className="text-xs text-mist-gray">Balance</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-arcane-purple/10">
        <p className="text-xs text-mist-gray text-center">
          More trading pairs coming soon
        </p>
      </div>
    </Modal>
  )
}
