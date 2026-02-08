import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

const STORAGE_PREFIX = 'grimswap-onboarding-'

function getStorageKey(address: string): string {
  return `${STORAGE_PREFIX}${address.toLowerCase()}`
}

function isOnboardingComplete(address: string): boolean {
  if (typeof window === 'undefined') return true

  try {
    return localStorage.getItem(getStorageKey(address)) === 'done'
  } catch {
    return false
  }
}

function markOnboardingComplete(address: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(getStorageKey(address), 'done')
  } catch (e) {
    console.error('Failed to save onboarding state:', e)
  }
}

function clearOnboardingState(address: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(getStorageKey(address))
  } catch (e) {
    console.error('Failed to clear onboarding state:', e)
  }
}

export function useOnboarding() {
  const { address, isConnected } = useAccount()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      const completed = isOnboardingComplete(address)
      setShowOnboarding(!completed)
    } else {
      setShowOnboarding(false)
    }
  }, [isConnected, address])

  const completeOnboarding = useCallback(() => {
    if (address) {
      markOnboardingComplete(address)
      setShowOnboarding(false)
    }
  }, [address])

  const resetOnboarding = useCallback(() => {
    if (address) {
      clearOnboardingState(address)
      setShowOnboarding(true)
    }
  }, [address])

  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
  }
}
