import React, { useEffect, useRef } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  detail?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  detail,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Handle keyboard navigation
  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onCancel])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '🗑️',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          titleColor: 'text-red-800',
          borderColor: 'border-red-200'
        }
      case 'warning':
        return {
          icon: '⚠️',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          titleColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        }
      case 'info':
        return {
          icon: 'ℹ️',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          titleColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          icon: '❓',
          confirmButton: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          titleColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all ${styles.borderColor} border-2`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Header */}
          <div className="mb-4 flex items-center">
            <div className="text-2xl ml-3">{styles.icon}</div>
            <h3
              id="modal-title"
              className={`text-lg font-semibold ${styles.titleColor}`}
            >
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p
              id="modal-description"
              className="text-gray-700 text-base leading-relaxed"
            >
              {message}
            </p>
            {detail && (
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {detail}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
