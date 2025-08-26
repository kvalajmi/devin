import React from 'react'
import { formatCurrency } from '../../utils/formatters'

interface BalanceDetailsSectionProps {
  breakdown: {
    actualFunding: number
    totalCollection: number
    totalLoanAmount: number
    partnerWithdrawals: number
    investorWithdrawals: number
    totalExpenses: number
    totalLawyerFees: number
  }
  onRefresh: () => void
}

/**
 * مكون عرض تفاصيل الرصيد
 * مسؤولية واحدة: عرض تفاصيل مكونات الرصيد
 */
const BalanceDetailsSection: React.FC<BalanceDetailsSectionProps> = ({
  breakdown,
  onRefresh
}) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* المدخلات الإيجابية */}
        <div className="space-y-3">
          <h4 className="font-semibold text-green-700 flex items-center">
            <span className="ml-2">➕</span>
            المدخلات
          </h4>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">التمويل الفعلي</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(breakdown.actualFunding)}
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">إجمالي التحصيل</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(breakdown.totalCollection)}
              </span>
            </div>
          </div>
        </div>

        {/* المخرجات السلبية */}
        <div className="space-y-3">
          <h4 className="font-semibold text-red-700 flex items-center">
            <span className="ml-2">➖</span>
            المخرجات
          </h4>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">إجمالي مبلغ القروض</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(breakdown.totalLoanAmount)}
              </span>
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">مسحوبات الشريك</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(breakdown.partnerWithdrawals)}
              </span>
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">مسحوبات المستثمر</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(breakdown.investorWithdrawals)}
              </span>
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">المصاريف العادية</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(breakdown.totalExpenses)}
              </span>
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">أتعاب المحامي</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(breakdown.totalLawyerFees)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* زر التحديث */}
      <div className="mt-6 text-center">
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🔄 تحديث الرصيد
        </button>
      </div>
    </div>
  )
}

export default BalanceDetailsSection
