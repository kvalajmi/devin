import React, { useState } from 'react'
import { useConfirmationContext } from './ConfirmationProvider'
import { createDeleteConfirm } from '../utils/confirmation-helpers'

// استيراد المكونات الجديدة
import PageHeader from './ClearAllData/PageHeader'
import WarningSection from './ClearAllData/WarningSection'
import ProgressDisplay from './ClearAllData/ProgressDisplay'
import ResultsDisplay from './ClearAllData/ResultsDisplay'
import { ClearDataService, ClearDataProgress } from './ClearAllData/ClearDataService'

/**
 * مكون حذف جميع البيانات المحسّن
 * تم تقسيمه إلى مكونات أصغر حسب القاعدة الذهبية
 */
const ClearAllData: React.FC = () => {
  const { showConfirm } = useConfirmationContext()
  const deleteConfirm = createDeleteConfirm(showConfirm)
  
  // حالات التطبيق
  const [isClearing, setIsClearing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [results, setResults] = useState<string[]>([])

  /**
   * تنفيذ عملية حذف البيانات
   */
  const clearAllData = async (): Promise<void> => {
    try {
      setIsClearing(true)
      setProgress(0)
      setCurrentStep('بدء عملية الحذف...')
      setResults([])

      await ClearDataService.clearAllData((progressData: ClearDataProgress) => {
        setProgress(progressData.progress)
        setCurrentStep(progressData.currentStep)
        setResults(progressData.results)
      })

    } catch (error) {
      console.error('خطأ في عملية حذف البيانات:', error)
      setResults(prev => [...prev, `❌ خطأ عام: ${error}`])
    } finally {
      setIsClearing(false)
      setCurrentStep('اكتملت العملية')
    }
  }

  /**
   * معالج زر الحذف مع التأكيد
   */
  const handleClearData = async (): Promise<void> => {
    const confirmed = await deleteConfirm.deleteAllData()
    
    if (confirmed) {
      await clearAllData()
    }
  }

  /**
   * معالج إعادة تعيين النتائج
   */
  const handleResetResults = (): void => {
    setResults([])
    setProgress(0)
    setCurrentStep('')
  }

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* رأس الصفحة */}
      <PageHeader />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          
          {/* قسم التحذير */}
          <WarningSection />

          {/* عرض التقدم */}
          <ProgressDisplay
            isClearing={isClearing}
            progress={progress}
            currentStep={currentStep}
          />

          {/* عرض النتائج */}
          <ResultsDisplay results={results} />

          {/* أزرار التحكم */}
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button
              onClick={handleClearData}
              disabled={isClearing}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-semibold flex items-center"
            >
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الحذف...
                </>
              ) : (
                <>
                  🗑️ حذف جميع البيانات
                </>
              )}
            </button>

            {results.length > 0 && !isClearing && (
              <button
                onClick={handleResetResults}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                🔄 مسح النتائج
              </button>
            )}
          </div>
          
          {/* معلومات إضافية */}
          {!isClearing && results.length === 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">نصائح مهمة:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>تأكد من عمل نسخة احتياطية من البيانات المهمة</li>
                    <li>هذه العملية ستحذف جميع البيانات نهائياً</li>
                    <li>يُنصح بإغلاق التطبيقات الأخرى أثناء العملية</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ClearAllData
