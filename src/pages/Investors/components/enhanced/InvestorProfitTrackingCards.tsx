import React from 'react'
import { formatCurrency } from '../../utils/formatters'
import { useInvestorProfitTracking } from './hooks/useInvestorProfitTracking'

interface InvestorProfitTrackingCardsProps {
  investorId: number
}

/**
 * بطاقات تتبع الأرباح للمستثمر والشريك
 * تعرض إجمالي وصافي الأرباح المحصلة لكل طرف
 */
const InvestorProfitTrackingCards: React.FC<InvestorProfitTrackingCardsProps> = ({ investorId }) => {
  const { profitData, isLoading, error } = useInvestorProfitTracking(investorId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !profitData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
          خطأ في تحميل بيانات الأرباح
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* إجمالي ربح المستثمر المحصل */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">إجمالي ربح المستثمر المحصل</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(profitData.totalInvestorCollectedProfit)}
            </div>
          </div>
          <div className="text-3xl">💰</div>
        </div>
      </div>

      {/* صافي ربح المستثمر */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">صافي ربح المستثمر</div>
            <div className={`text-2xl font-bold ${profitData.netInvestorProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profitData.netInvestorProfit)}
            </div>
          </div>
          <div className="text-3xl">📈</div>
        </div>
      </div>

      {/* إجمالي ربح الشريك المحصل */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">إجمالي ربح الشريك المحصل</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(profitData.totalPartnerCollectedProfit)}
            </div>
          </div>
          <div className="text-3xl">🤝</div>
        </div>
      </div>

      {/* صافي ربح الشريك */}
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">صافي ربح الشريك</div>
            <div className={`text-2xl font-bold ${profitData.netPartnerProfit >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {formatCurrency(profitData.netPartnerProfit)}
            </div>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </div>
    </div>
  )
}

export default InvestorProfitTrackingCards
