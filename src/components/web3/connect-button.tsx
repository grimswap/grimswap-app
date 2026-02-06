import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'

export function GrimConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className={cn(
                      'px-5 py-2.5 rounded-xl',
                      'text-white text-sm font-medium',
                      'transition-all duration-200',
                      'hover:scale-[1.02] active:scale-[0.98]'
                    )}
                    style={{
                      background: 'linear-gradient(135deg, #A4238B 0%, #6B21A8 100%)',
                      boxShadow: '0 0 20px rgba(164, 35, 139, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(164, 35, 139, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(164, 35, 139, 0.3)'
                    }}
                  >
                    Enter Grimoire
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className={cn(
                      'px-5 py-2.5 rounded-xl',
                      'text-white text-sm font-medium',
                      'transition-colors'
                    )}
                    style={{
                      background: 'rgba(220, 38, 38, 0.8)',
                    }}
                  >
                    Wrong Network
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl',
                      'transition-all duration-200'
                    )}
                    style={{
                      background: 'rgba(18, 18, 20, 0.8)',
                      border: '1px solid rgba(164, 35, 139, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(164, 35, 139, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(164, 35, 139, 0.3)'
                    }}
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain'}
                        src={chain.iconUrl}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span className="text-white text-sm hidden sm:block">
                      {chain.name}
                    </span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl',
                      'transition-all duration-200'
                    )}
                    style={{
                      background: 'rgba(18, 18, 20, 0.8)',
                      border: '1px solid rgba(0, 237, 218, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 237, 218, 0.5)'
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 237, 218, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 237, 218, 0.3)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <span className="font-mono text-sm" style={{ color: '#00EDDA' }}>
                      {account.displayName}
                    </span>
                    {account.displayBalance && (
                      <span className="text-gray-400 text-sm hidden sm:block">
                        {account.displayBalance}
                      </span>
                    )}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
