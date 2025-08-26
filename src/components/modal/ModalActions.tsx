import React from 'react'

interface ModalActionsProps {
  onCancel: () => void
  onConfirm: () => void
  cancelText?: string
  confirmText?: string
  isLoading?: boolean
}

/**
 * مكون أزرار النافذة المنبثقة
 */
const ModalActions: React.FC<ModalActionsProps> = ({
  onCancel,
  onConfirm,
  cancelText = "إلغاء",
  confirmText = "تأكيد التعديل",
  isLoading = false
}) => {
  return (
    <div className="flex gap-3 justify-end pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? "جاري الحفظ..." : confirmText}
      </button>
    </div>
  )
}

export default ModalActions
