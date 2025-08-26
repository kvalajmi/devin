import React from 'react'

/**
 * مكون قسم التحذير
 */
const WarningSection: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center mb-2">
        <svg className="w-6 h-6 text-red-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
        <h3 className="text-lg font-semibold text-red-800">تحذير مهم!</h3>
      </div>
      
      <p className="text-red-700 mb-2">
        هذه العملية ستحذف جميع البيانات التالية نهائياً ولا يمكن التراجع عنها:
      </p>
      
      <ul className="list-disc list-inside text-red-700 space-y-1">
        <li>جميع العملاء وبياناتهم</li>
        <li>جميع الدفعات والمعاملات</li>
        <li>جميع المصروفات وأتعاب المحاماة</li>
        <li>جميع سحوبات المستثمرين والشركاء</li>
        <li>جميع سجلات التمويل الفعلي</li>
        <li>جميع المرفقات والوثائق</li>
      </ul>
      
      <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
        <p className="text-red-800 font-medium text-sm">
          💡 نصيحة: تأكد من عمل نسخة احتياطية من البيانات المهمة قبل المتابعة
        </p>
      </div>
    </div>
  )
}

export default WarningSection
