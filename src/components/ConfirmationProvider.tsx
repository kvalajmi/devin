import React, { createContext, useContext, ReactNode } from 'react'
import { useConfirmation } from '../hooks/useConfirmation'
import ConfirmationModal from './ConfirmationModal'

interface ConfirmationContextType {
  showConfirm: (options: {
    title?: string
    message: string
    detail?: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
  }) => Promise<boolean>
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined)

export const useConfirmationContext = () => {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmationContext must be used within ConfirmationProvider')
  }
  return context
}

interface ConfirmationProviderProps {
  children: ReactNode
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const {
    confirmation,
    isOpen,
    showConfirm,
    handleConfirm,
    handleCancel
  } = useConfirmation()

  return (
    <ConfirmationContext.Provider value={{ showConfirm }}>
      {children}
      
      {confirmation && (
        <ConfirmationModal
          isOpen={isOpen}
          title={confirmation.title || 'تأكيد'}
          message={confirmation.message}
          detail={confirmation.detail}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
          type={confirmation.type}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmationContext.Provider>
  )
}
