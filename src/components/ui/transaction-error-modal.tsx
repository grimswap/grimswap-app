import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { XCircle, RefreshCw, Copy, Check, AlertTriangle, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export type ErrorType = 'swap' | 'deposit' | 'claim' | 'approval' | 'general'

// Known error patterns mapped to user-friendly messages
const ERROR_HINTS: { pattern: string; title: string; hint: string; retryable: boolean }[] = [
  {
    pattern: 'user rejected',
    title: 'Transaction Rejected',
    hint: 'You rejected the transaction in your wallet. You can try again when ready.',
    retryable: true,
  },
  {
    pattern: 'User rejected',
    title: 'Transaction Rejected',
    hint: 'You rejected the transaction in your wallet. You can try again when ready.',
    retryable: true,
  },
  {
    pattern: 'insufficient funds',
    title: 'Insufficient Balance',
    hint: 'Your wallet doesn\'t have enough funds to cover this transaction and gas fees. Try a smaller amount or add more funds.',
    retryable: true,
  },
  {
    pattern: 'gas required exceeds allowance',
    title: 'Not Enough ETH for Gas',
    hint: 'The address doesn\'t have enough ETH to pay for gas. You may need to send some ETH to cover the transaction fee.',
    retryable: false,
  },
  {
    pattern: 'nonce too low',
    title: 'Transaction Conflict',
    hint: 'A previous transaction is still being processed. Wait a moment and try again.',
    retryable: true,
  },
  {
    pattern: 'allowance',
    title: 'Token Approval Issue',
    hint: 'The token spending approval may not have been set correctly. Try approving again or check your allowance on the block explorer.',
    retryable: true,
  },
  {
    pattern: 'execution reverted',
    title: 'Transaction Reverted',
    hint: 'The smart contract rejected this transaction. This can happen if the pool state changed or parameters are invalid.',
    retryable: true,
  },
  {
    pattern: 'timeout',
    title: 'Request Timed Out',
    hint: 'The network took too long to respond. The transaction may still go through. Check the block explorer before retrying.',
    retryable: true,
  },
  {
    pattern: 'network',
    title: 'Network Error',
    hint: 'Could not connect to the blockchain. Check your internet connection and try again.',
    retryable: true,
  },
]

function matchError(errorMessage: string): { title: string; hint: string; retryable: boolean } | null {
  const lower = errorMessage.toLowerCase()
  for (const entry of ERROR_HINTS) {
    if (lower.includes(entry.pattern.toLowerCase())) {
      return entry
    }
  }
  return null
}

interface ErrorDetails {
  type: ErrorType
  message: string
  // Optional raw error for "show details" toggle
  rawError?: string
}

interface TransactionErrorModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry?: () => void
  details: ErrorDetails
}

export function TransactionErrorModal({
  isOpen,
  onClose,
  onRetry,
  details,
}: TransactionErrorModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const [showRawError, setShowRawError] = useState(false)
  const [copied, setCopied] = useState(false)

  const matched = matchError(details.message)
  const isRetryable = matched?.retryable ?? true
  const friendlyTitle = matched?.title ?? getDefaultTitle(details.type)
  const friendlyHint = matched?.hint ?? null

  useEffect(() => {
    if (isOpen) {
      setShowRawError(false)
      setCopied(false)
      document.body.style.overflow = 'hidden'

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )

      gsap.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      )

      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotation: 90 },
        { scale: 1, rotation: 0, duration: 0.5, delay: 0.2, ease: 'back.out(2)' }
      )
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: onClose,
    })
  }

  const handleRetry = () => {
    handleClose()
    // Small delay so close animation completes
    setTimeout(() => {
      onRetry?.()
    }, 250)
  }

  const handleCopyError = async () => {
    const text = details.rawError || details.message
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-void-black/90 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-md overflow-hidden',
          'rounded-2xl p-[1px]',
          'bg-gradient-to-br from-blood-crimson/50 via-arcane-purple/30 to-blood-crimson/50'
        )}
      >
        <div className="rounded-2xl bg-charcoal overflow-hidden">
          {/* Error Header */}
          <div className="relative p-8 text-center bg-gradient-to-b from-blood-crimson/15 to-transparent">
            {/* Error Icon */}
            <div ref={iconRef} className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 rounded-full bg-blood-crimson/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blood-crimson to-blood-crimson/70 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-ghost-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl text-ghost-white mb-2">
              {friendlyTitle}
            </h2>
            <p className="text-sm text-mist-gray">
              {getSubtitle(details.type)}
            </p>
          </div>

          {/* Error Details */}
          <div className="p-6 space-y-4">
            {/* Friendly Hint */}
            {friendlyHint && (
              <div className="p-4 rounded-xl bg-blood-crimson/5 border border-blood-crimson/20">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blood-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-ghost-white mb-1 font-medium">What happened?</p>
                    <p className="text-sm text-mist-gray">{friendlyHint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Summary */}
            <div className="p-4 rounded-xl bg-obsidian/50 border border-arcane-purple/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-blood-crimson flex-shrink-0" />
                    <p className="text-xs text-mist-gray">Error Details</p>
                  </div>
                  <p className="text-sm text-ghost-white break-words line-clamp-3">
                    {details.message.length > 200
                      ? details.message.slice(0, 200) + '...'
                      : details.message}
                  </p>
                </div>
                <button
                  onClick={handleCopyError}
                  className="p-1.5 rounded-md hover:bg-arcane-purple/20 transition-colors flex-shrink-0"
                  title="Copy error"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-spectral-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-mist-gray" />
                  )}
                </button>
              </div>

              {/* Show Raw Error Toggle */}
              {details.rawError && details.rawError !== details.message && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowRawError(!showRawError)}
                    className="text-xs text-ethereal-cyan hover:text-ethereal-cyan/80 transition-colors"
                  >
                    {showRawError ? 'Hide full error' : 'Show full error'}
                  </button>
                  {showRawError && (
                    <pre className="mt-2 p-3 rounded-lg bg-void-black/50 text-xs text-mist-gray font-mono overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap break-all">
                      {details.rawError}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className={cn(
                  'flex-1 py-3 px-6 rounded-xl font-medium transition-all',
                  'bg-charcoal border border-arcane-purple/20',
                  'text-mist-gray hover:text-ghost-white hover:border-arcane-purple/40'
                )}
              >
                Close
              </button>
              {isRetryable && onRetry && (
                <button
                  onClick={handleRetry}
                  className={cn(
                    'flex-1 py-3 px-6 rounded-xl font-medium transition-all',
                    'bg-arcane-purple hover:bg-arcane-purple/80',
                    'text-ghost-white',
                    'shadow-lg shadow-arcane-purple/25',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function getDefaultTitle(type: ErrorType): string {
  switch (type) {
    case 'swap':
      return 'Swap Failed'
    case 'deposit':
      return 'Deposit Failed'
    case 'claim':
      return 'Claim Failed'
    case 'approval':
      return 'Approval Failed'
    default:
      return 'Transaction Failed'
  }
}

function getSubtitle(type: ErrorType): string {
  switch (type) {
    case 'swap':
      return 'Your swap could not be completed'
    case 'deposit':
      return 'Your deposit could not be processed'
    case 'claim':
      return 'Your claim could not be completed'
    case 'approval':
      return 'Token approval was not successful'
    default:
      return 'The transaction could not be completed'
  }
}
