import React from 'react'

interface InvestorDetailsHeaderProps {
  isEditing: boolean
  isLoading: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onClose: () => void
}

/**
 * مكون رأس تفاصيل المستثمر
 * يحتوي على العنوان والأزرار
 */
const InvestorDetailsHeader: React.FC<InvestorDetailsHeaderProps> = ({
  isEditing,
  isLoading,
  onEdit,
  onSave,
  onCancel,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <h2 className="text-xl font-bold text-gray-900">تفاصيل المستثمر</h2>
      <div className="flex space-x-2 space-x-reverse">
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="btn-secondary"
          >
            تعديل
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button
              onClick={onCancel}
              className="btn-secondary"
            >
              إلغاء
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="btn-outline"
        >
          إغلاق
        </button>
      </div>
    </div>
  )
}

export default InvestorDetailsHeader
