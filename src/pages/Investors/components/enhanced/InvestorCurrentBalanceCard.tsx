import React, { useState } from 'react'
import { formatCurrency, getBalanceStatus } from '../../utils/formatters'
import { useInvestorBalance } from './hooks/useInvestorBalance'
import BalanceDetailsSection from './BalanceDetailsSection'

interface InvestorCurrentBalanceCardProps {
  investorId: number
  investorName: string
}

/**
 * بطاقة الرصيد الحالي المحسّنة
 * تعرض الرصيد المحسوب وفقاً للمعادلة المعقدة مع تفاصيل المكونات
 */
const InvestorCurrentBalanceCard: React.FC<InvestorCurrentBalanceCardProps> = ({
  investorId,
  investorName
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const { balanceData, isLoading, error, refreshBalance } = useInvestorBalance(investorId)

  // استخدام دوال التنسيق الموحدة
  const balanceStatus = getBalanceStatus(balanceData?.currentBalance || 0)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    )
  }

  if (!balanceData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="text-center text-red-600">
          خطأ في تحميل بيانات الرصيد
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <span className="text-2xl ml-3">💰</span>
            الرصيد الحالي
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-100 hover:text-white transition-colors"
          >
            {showDetails ? '🔼' : '🔽'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-4xl font-bold mb-2 flex items-center justify-center">
            <span className="ml-2">{balanceStatus.icon}</span>
            <span className={balanceData.currentBalance >= 0 ? 'text-green-100' : 'text-red-200'}>
              {formatCurrency(balanceData.currentBalance)}
            </span>
          </div>
          <div className="text-blue-100 text-sm">
            رصيد {investorName}
          </div>
        </div>
      </div>

      {/* المعادلة */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="text-xs text-gray-600 text-center">
          <strong>المعادلة:</strong> التمويل الفعلي + إجمالي التحصيل - إجمالي مبلغ القروض - مسحوبات الشريك - مسحوبات المستثمر - إجمالي المصاريف
        </div>
      </div>

      {/* التفاصيل */}
      {showDetails && (
        <BalanceDetailsSection
          breakdown={balanceData.breakdown}
          onRefresh={refreshBalance}
        />
      )}
    </div>
  )
}

export default InvestorCurrentBalanceCard
