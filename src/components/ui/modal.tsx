import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showClose?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showClose = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      )
      gsap.fromTo(
        contentRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      )
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.15 })
    gsap.to(contentRef.current, {
      scale: 0.95,
      opacity: 0,
      y: 10,
      duration: 0.15,
      onComplete: onClose,
    })
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-void-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-md max-h-[85vh] overflow-hidden',
          'rounded-2xl p-[1px]',
          'bg-gradient-to-br from-arcane-purple/50 via-transparent to-spectral-green/50',
          className
        )}
      >
        <div className="rounded-2xl bg-charcoal overflow-hidden">
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-arcane-purple/10">
              {title && (
                <h2 className="font-display text-xl text-ghost-white">{title}</h2>
              )}
              {showClose && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors ml-auto"
                >
                  <X className="w-5 h-5 text-mist-gray" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
