import React from 'react'

interface InvestorPageHeaderProps {
  showAddForm: boolean
  onToggleAddForm: () => void
  isLoading?: boolean
}

/**
 * مكون رأس صفحة المستثمرين
 */
const InvestorPageHeader: React.FC<InvestorPageHeaderProps> = ({
  showAddForm,
  onToggleAddForm,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* العنوان */}
      <div className="flex items-center">
        <div className="text-3xl ml-3">👥</div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">قسم المستثمرين</h1>
          <p className="text-gray-600 text-sm mt-1">إدارة المستثمرين والشراكات المالية</p>
        </div>
      </div>

      {/* أزرار العمليات */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <button
          onClick={onToggleAddForm}
          disabled={isLoading}
          className={`btn-primary w-full sm:w-auto ${
            showAddForm ? 'bg-gray-600 hover:bg-gray-700' : ''
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center justify-center">
            {showAddForm ? (
              <>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                إلغاء
              </>
            ) : (
              <>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إضافة مستثمر جديد
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

export default InvestorPageHeader
