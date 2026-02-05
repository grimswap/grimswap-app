import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps extends ToastData {
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'border-spectral-green/50 shadow-[0_0_20px_rgba(0,255,136,0.2)]',
  error: 'border-blood-crimson/50 shadow-[0_0_20px_rgba(255,51,102,0.2)]',
  warning: 'border-ethereal-cyan/50 shadow-[0_0_20px_rgba(0,212,255,0.2)]',
  info: 'border-arcane-purple/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]',
}

const iconStyles = {
  success: 'text-spectral-green',
  error: 'text-blood-crimson',
  warning: 'text-ethereal-cyan',
  info: 'text-ethereal-cyan',
}

function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null)
  const Icon = icons[type]

  useEffect(() => {
    gsap.fromTo(
      toastRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
    )

    const timer = setTimeout(() => {
      gsap.to(toastRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        onComplete: () => onClose(id),
      })
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const handleClose = () => {
    gsap.to(toastRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.2,
      onComplete: () => onClose(id),
    })
  }

  return (
    <div
      ref={toastRef}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl',
        'bg-charcoal/95 backdrop-blur-sm border',
        'min-w-[300px] max-w-[400px]',
        styles[type]
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ghost-white">{title}</p>
        {description && (
          <p className="text-sm text-mist-gray mt-1 break-words">{description}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="text-mist-gray hover:text-ghost-white transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  )
}
