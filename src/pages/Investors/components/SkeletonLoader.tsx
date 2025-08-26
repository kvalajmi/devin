import React from 'react'

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* الصف الأول: معلومات المستثمر والرصيد */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* معلومات المستثمر */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* الرصيد الحالي */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6 rounded-lg">
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded w-40 mx-auto mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الصف الثاني: إحصائيات المحفظة */}
      <div className="lg:col-span-2">
        <div className="h-4 bg-gray-300 rounded w-48 mb-3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div className="text-right space-y-1">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>

      {/* الصف الثالث: أقسام إدارة التمويل والسحوبات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-lg ml-3"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-300 rounded w-20"></div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="text-center">
                <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            </div>

            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-gray-50 p-2 rounded border">
                  <div className="flex justify-between mb-1">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonLoader
