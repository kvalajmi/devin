import React from 'react'

interface ProgressDisplayProps {
  isClearing: boolean
  progress: number
  currentStep: string
}

/**
 * مكون عرض التقدم
 */
const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  isClearing,
  progress,
  currentStep
}) => {
  if (!isClearing) return null

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{currentStep}</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-center mt-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
        <span className="mr-2 text-sm text-red-600">جاري الحذف...</span>
      </div>
      
      {/* مؤشر مرئي إضافي */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center space-x-1 space-x-reverse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < (progress / 25) ? 'bg-red-500' : 'bg-gray-300'
              } animate-pulse`}
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressDisplay
