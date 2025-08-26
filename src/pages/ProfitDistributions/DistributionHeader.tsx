import React from 'react'

interface DistributionHeaderProps {
  distributionsCount: number
  isLoading?: boolean
}

/**
 * مكون رأس صفحة توزيعات الأرباح
 */
const DistributionHeader: React.FC<DistributionHeaderProps> = ({ 
  distributionsCount, 
  isLoading = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-3xl ml-4">💰</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">توزيعات الأرباح</h1>
            <p className="text-gray-600 mt-1">
              إدارة وتوزيع الأرباح على المستثمرين والشركاء
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="text-sm text-gray-500">
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
                جاري التحميل...
              </div>
            ) : (
              <>عدد المستثمرين: {distributionsCount}</>
            )}
          </div>
          
          {/* مؤشرات إضافية */}
          <div className="hidden md:flex items-center space-x-2 space-x-reverse text-xs text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full ml-1"></div>
              <span>متاح للتوزيع</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full ml-1"></div>
              <span>موزع</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full ml-1"></div>
              <span>نصيب الشريك</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* شريط التقدم للتحميل */}
      {isLoading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DistributionHeader
