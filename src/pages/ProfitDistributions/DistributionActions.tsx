import React from 'react'

interface DistributionActionsProps {
  distributionsCount: number
  onReset: () => void
  onSave: () => void
  onAutoDistribute: () => void
  onExport: () => void
  isLoading?: boolean
}

/**
 * مكون أزرار عمليات التوزيع
 */
const DistributionActions: React.FC<DistributionActionsProps> = ({
  distributionsCount,
  onReset,
  onSave,
  onAutoDistribute,
  onExport,
  isLoading = false
}) => {
  if (distributionsCount === 0) return null

  return (
    <div className="mt-6 space-y-4">
      {/* أزرار العمليات الأساسية */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
        <button
          onClick={onReset}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          إعادة تعيين
        </button>

        <button
          onClick={onAutoDistribute}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          توزيع تلقائي
        </button>

        <button
          onClick={onExport}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          تصدير
        </button>

        <button
          onClick={onSave}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              حفظ التوزيعات
            </>
          )}
        </button>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 ml-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">معلومات مهمة:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>التوزيع التلقائي سيوزع جميع الأرباح المتاحة</li>
              <li>يمكنك تعديل المبالغ يدوياً قبل الحفظ</li>
              <li>التصدير سيحفظ ملف Excel بتفاصيل التوزيع</li>
              <li>إعادة التعيين ستمحو جميع المبالغ المدخلة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistributionActions
