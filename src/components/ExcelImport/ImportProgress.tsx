import React from 'react'

interface ImportProgressProps {
  progress: number
  currentStep: string
  isVisible: boolean
}

/**
 * مكون عرض تقدم الاستيراد
 */
const ImportProgress: React.FC<ImportProgressProps> = ({ progress, currentStep, isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">جاري الاستيراد...</h3>
      
      {/* شريط التقدم */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>التقدم</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* الخطوة الحالية */}
      <div className="flex items-center text-sm text-gray-600">
        <svg 
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>{currentStep}</span>
      </div>

      {/* تحذير عدم الإغلاق */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex">
          <svg 
            className="h-5 w-5 text-yellow-400 mr-2" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">تحذير مهم</p>
            <p>لا تغلق هذه النافذة أو تنتقل إلى صفحة أخرى أثناء عملية الاستيراد</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportProgress
