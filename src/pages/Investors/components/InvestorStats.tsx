import React from 'react'

interface InvestorStatsProps {
  stats: {
    totalInvestors: number
    totalInvestorPercentage: number
    totalPartnerPercentage: number
    averageInvestorPercentage: number
  }
  isLoading?: boolean
}

/**
 * مكون عرض إحصائيات المستثمرين
 */
const InvestorStats: React.FC<InvestorStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* إجمالي عدد المستثمرين */}
      <div className="card">
        <div className="flex items-center">
          <div className="text-3xl ml-3">👥</div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalInvestors}</div>
            <div className="text-sm text-gray-600">إجمالي المستثمرين</div>
          </div>
        </div>
      </div>

      {/* متوسط نسبة المستثمر */}
      <div className="card">
        <div className="flex items-center">
          <div className="text-3xl ml-3">📊</div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {stats.averageInvestorPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">متوسط نسبة المستثمر</div>
          </div>
        </div>
      </div>

      {/* إجمالي نسب المستثمرين */}
      <div className="card">
        <div className="flex items-center">
          <div className="text-3xl ml-3">💰</div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalInvestorPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">إجمالي نسب المستثمرين</div>
          </div>
        </div>
      </div>

      {/* إجمالي نسب الشركاء */}
      <div className="card">
        <div className="flex items-center">
          <div className="text-3xl ml-3">🤝</div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalPartnerPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">إجمالي نسب الشركاء</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorStats
