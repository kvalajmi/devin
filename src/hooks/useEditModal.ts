import { useState, useEffect, useRef } from 'react'

interface UseEditModalProps {
  isOpen: boolean
  currentValue: number
  currentDescription?: string
  onCancel: () => void
}

/**
 * Hook مخصص لإدارة حالة نافذة التعديل
 */
export const useEditModal = ({
  isOpen,
  currentValue,
  currentDescription = '',
  onCancel
}: UseEditModalProps) => {
  const [value, setValue] = useState(currentValue.toString())
  const [description, setDescription] = useState(currentDescription)
  const [error, setError] = useState('')
  
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset values when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(currentValue.toString())
      setDescription(currentDescription)
      setError('')
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [isOpen, currentValue, currentDescription])

  // Handle keyboard navigation
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

  const validateAndGetValue = (): { isValid: boolean; numValue?: number; error?: string } => {
    const numValue = parseFloat(value)
    
    if (isNaN(numValue) || numValue <= 0) {
      return {
        isValid: false,
        error: 'يرجى إدخال قيمة صحيحة أكبر من صفر'
      }
    }

    return { isValid: true, numValue }
  }

  const validateDescription = (showDescription: boolean): { isValid: boolean; error?: string } => {
    if (showDescription && !description.trim()) {
      return {
        isValid: false,
        error: 'يرجى إدخال الوصف'
      }
    }

    return { isValid: true }
  }

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    setError('')
  }

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription)
    setError('')
  }

  return {
    value,
    description,
    error,
    modalRef,
    inputRef,
    setError,
    handleValueChange,
    handleDescriptionChange,
    validateAndGetValue,
    validateDescription
  }
}
