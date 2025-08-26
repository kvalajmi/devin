// صفحة توزيعات الأرباح المحسّنة - تم إعادة تنظيمها حسب القاعدة الذهبية
// تم تقسيم المنطق إلى hook مخصص ومكونات منفصلة

import React from 'react'
import { useProfitDistributions } from '../hooks/useProfitDistributions'

// استيراد المكونات المتخصصة
import DistributionHeader from './ProfitDistributions/DistributionHeader'
import DistributionTable from './ProfitDistributions/DistributionTable'
import DistributionActions from './ProfitDistributions/DistributionActions'

/**
 * صفحة توزيعات الأرباح المحسّنة
 * تم تقسيمها إلى مكونات أصغر وhook مخصص لتحسين القابلية للصيانة
 */
const ProfitDistributions: React.FC = () => {
  const {
    distributions,
    isLoading,
    isSaving,
    error,
    stats,
    handleDistributedAmountChange,
    handlePartnerAmountChange,
    handleReset,
    handleAutoDistribute,
    handleSave,
    handleExport,
    clearError
  } = useProfitDistributions()

  // معالج حفظ التوزيعات مع عرض النتيجة
  const handleSaveWithFeedback = async () => {
    const result = await handleSave()
    if (result.success) {
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  // معالج تصدير البيانات مع عرض النتيجة
  const handleExportWithFeedback = () => {
    const result = handleExport()
    if (result.success) {
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات التوزيع...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس الصفحة */}
        <DistributionHeader 
          distributionsCount={distributions.length}
          isLoading={isLoading}
        />

        {/* عرض الأخطاء */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 ml-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">حدث خطأ</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* معلومات الحساب */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 ml-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">طريقة حساب الأرباح:</p>
              <p>صافي الربح = إجمالي أرباح العملاء - المصروفات - أتعاب المحاماة</p>
              <p>نصيب الشريك = صافي الربح × نسبة الشريك</p>
              <p>الربح المتاح للتوزيع = نصيب الشريك - المبلغ المسحوب مسبقاً</p>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        {distributions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500">إجمالي المتاح للتوزيع</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalAvailable.toLocaleString()} د.ك
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500">إجمالي الموزع</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalDistributed.toLocaleString()} د.ك
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500">نسبة التوزيع</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.distributionPercentage.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500">المتبقي للتوزيع</div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.remainingToDistribute.toLocaleString()} د.ك
              </div>
            </div>
          </div>
        )}

        {/* جدول التوزيعات */}
        <DistributionTable
          distributions={distributions}
          onDistributedAmountChange={handleDistributedAmountChange}
          onPartnerAmountChange={handlePartnerAmountChange}
        />

        {/* أزرار العمليات */}
        <DistributionActions
          distributionsCount={distributions.length}
          onReset={handleReset}
          onSave={handleSaveWithFeedback}
          onAutoDistribute={handleAutoDistribute}
          onExport={handleExportWithFeedback}
          isLoading={isSaving}
        />
      </div>
    </div>
  )
}

export default ProfitDistributions