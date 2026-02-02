import { useState, useCallback } from 'react'
import { type ToastData, type ToastType } from '@/components/ui/toast'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string, duration?: number) => {
      const id = `toast-${++toastId}`
      setToasts((prev) => [...prev, { id, type, title, description, duration }])
      return id
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (title: string, description?: string) =>
      addToast('success', title, description),
    error: (title: string, description?: string) =>
      addToast('error', title, description),
    warning: (title: string, description?: string) =>
      addToast('warning', title, description),
    info: (title: string, description?: string) =>
      addToast('info', title, description),
  }

  return { toasts, toast, removeToast }
}
