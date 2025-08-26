import { useState, useCallback } from 'react'

interface ConfirmationOptions {
  title?: string
  message: string
  detail?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

interface ConfirmationState {
  isOpen: boolean
  options: ConfirmationOptions
  resolve: (value: boolean) => void
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null)

  const showConfirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmation({
        isOpen: true,
        options,
        resolve
      })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(true)
      setConfirmation(null)
    }
  }, [confirmation])

  const handleCancel = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(false)
      setConfirmation(null)
    }
  }, [confirmation])

  const closeModal = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(false)
      setConfirmation(null)
    }
  }, [confirmation])

  return {
    confirmation: confirmation?.options,
    isOpen: confirmation?.isOpen || false,
    showConfirm,
    handleConfirm,
    handleCancel,
    closeModal
  }
}
