import React from 'react'

/**
 * مكون رأس صفحة حذف البيانات
 */
const PageHeader: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="العودة للصفحة السابقة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-red-600 ml-2">🗑️</span>
                حذف جميع البيانات
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                تنظيف النظام قبل الاستيراد الجديد
              </p>
            </div>
          </div>
          
          {/* معلومات إضافية */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <div className="text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>عملية لا يمكن التراجع عنها</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>تنظيف شامل للنظام</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
