import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Search, Star } from 'lucide-react'

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  balance?: string
}

// Mock tokens for demo
const MOCK_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    balance: '1.234',
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: '1,250.00',
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    balance: '500.00',
  },
  {
    address: '0x6B175474E89094C44Da98b954EescdeCB5BE3D00',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    balance: '0.00',
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    balance: '0.0125',
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    balance: '45.5',
  },
]

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
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>(['ETH', 'USDC'])

  const filteredTokens = useMemo(() => {
    if (!search) return MOCK_TOKENS
    const query = search.toLowerCase()
    return MOCK_TOKENS.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    )
  }, [search])

  const handleSelect = (token: Token) => {
    onSelect(token)
    onClose()
    setSearch('')
  }

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Token">
      {/* Search */}
      <div className="p-4 border-b border-arcane-purple/10">
        <Input
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Favorite tokens */}
      {favorites.length > 0 && !search && (
        <div className="p-4 border-b border-arcane-purple/10">
          <div className="flex flex-wrap gap-2">
            {favorites.map((symbol) => {
              const token = MOCK_TOKENS.find((t) => t.symbol === symbol)
              if (!token) return null
              return (
                <button
                  key={symbol}
                  onClick={() => handleSelect(token)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl',
                    'bg-obsidian/50 border border-arcane-purple/20',
                    'hover:border-arcane-purple/50 transition-all',
                    selectedToken?.symbol === symbol && 'border-arcane-purple'
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-arcane-purple to-ethereal-cyan" />
                  <span className="text-sm font-medium text-ghost-white">
                    {symbol}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Token list */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredTokens.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-mist-gray">No tokens found</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredTokens.map((token) => {
              const isSelected = selectedToken?.address === token.address
              const isFavorite = favorites.includes(token.symbol)

              return (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl',
                    'hover:bg-white/5 transition-all',
                    isSelected && 'bg-arcane-purple/10'
                  )}
                >
                  {/* Token icon */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-arcane-purple to-ethereal-cyan flex items-center justify-center">
                      <span className="text-xs font-bold text-ghost-white">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                  </div>

                  {/* Token info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ghost-white">
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

                  {/* Balance & favorite */}
                  <div className="flex items-center gap-3">
                    {token.balance && (
                      <span className="text-sm font-mono text-ghost-white">
                        {token.balance}
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(token.symbol, e)}
                      className={cn(
                        'p-1 rounded transition-colors',
                        isFavorite
                          ? 'text-spectral-green'
                          : 'text-mist-gray/50 hover:text-mist-gray'
                      )}
                    >
                      <Star
                        className="w-4 h-4"
                        fill={isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}
