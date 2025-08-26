// مكون نافذة التعديل - تم إعادة تنظيمه حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى مكونات منفصلة أصغر

import React from 'react'
import { useEditModal } from '../hooks/useEditModal'

// استيراد المكونات المنفصلة
import ModalHeader from './modal/ModalHeader'
import ValueInput from './modal/ValueInput'
import DescriptionInput from './modal/DescriptionInput'
import ValueComparison from './modal/ValueComparison'
import ModalActions from './modal/ModalActions'
import ErrorMessage from './modal/ErrorMessage'

interface EditModalProps {
  isOpen: boolean
  title: string
  currentValue: number
  currentDescription?: string
  fieldLabel: string
  descriptionLabel?: string
  onConfirm: (value: number, description?: string) => void
  onCancel: () => void
  showDescription?: boolean
}

/**
 * مكون نافذة التعديل المحسّن
 * تم تقسيمه إلى مكونات أصغر لتحسين القابلية للصيانة
 */
const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  title,
  currentValue,
  currentDescription = '',
  fieldLabel,
  descriptionLabel,
  onConfirm,
  onCancel,
  showDescription = false
}) => {
  const {
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
  } = useEditModal({
    isOpen,
    currentValue,
    currentDescription,
    onCancel
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // التحقق من صحة القيمة
    const valueValidation = validateAndGetValue()
    if (!valueValidation.isValid) {
      setError(valueValidation.error || 'خطأ في القيمة')
      return
    }

    // التحقق من صحة الوصف إذا كان مطلوباً
    const descriptionValidation = validateDescription(showDescription)
    if (!descriptionValidation.isValid) {
      setError(descriptionValidation.error || 'خطأ في الوصف')
      return
    }

    onConfirm(valueValidation.numValue!, showDescription ? description : undefined)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        {/* Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all border-2 border-blue-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <ModalHeader title={title} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Value Input */}
            <ValueInput
              ref={inputRef}
              label={fieldLabel}
              value={value}
              onChange={handleValueChange}
            />

            {/* Description Input (if needed) */}
            {showDescription && descriptionLabel && (
              <DescriptionInput
                label={descriptionLabel}
                value={description}
                onChange={handleDescriptionChange}
              />
            )}

            {/* Error Message */}
            <ErrorMessage error={error} />

            {/* Current vs New Comparison */}
            <ValueComparison
              currentValue={currentValue}
              newValue={value}
            />

            {/* Actions */}
            <ModalActions
              onCancel={onCancel}
              onConfirm={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditModal