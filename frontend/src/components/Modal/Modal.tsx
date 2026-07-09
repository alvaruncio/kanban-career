import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/60 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="w-full max-w-[32rem] mx-gutter bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl animate-modal-enter">
        <div className="flex items-center justify-between px-lg pt-lg pb-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-surface-container"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}