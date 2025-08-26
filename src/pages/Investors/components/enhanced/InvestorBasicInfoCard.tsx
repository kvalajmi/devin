import React from 'react'
import { Investor } from '../../types'
import { formatDate, formatNumber } from '../../utils/formatters'

interface InvestorBasicInfoCardProps {
  investor: Investor
}

/**
 * بطاقة معلومات المستثمر الأساسية المحسّنة
 * تعرض المعلومات الأساسية مع النسب بشكل بصري جذاب
 */
const InvestorBasicInfoCard: React.FC<InvestorBasicInfoCardProps> = ({ investor }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg ml-3">
            👤
          </span>
          معلومات المستثمر
        </h3>
        <div className="text-sm text-gray-500">
          انضم في: {formatDate(investor.joinDate)}
        </div>
      </div>

      {/* المعلومات الأساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              اسم المستثمر
            </label>
            <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
              {investor.investorName}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              الرقم المدني
            </label>
            <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
              {investor.civilId}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              اسم الشريك
            </label>
            <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
              {investor.partnerName}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              نوع الشراكة
            </label>
            <div className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
              {investor.partnershipType}
            </div>
          </div>
        </div>
      </div>

      {/* نسب المشاركة - عرض بصري */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
          نسب المشاركة
        </h4>
        
        {/* الشريط التقدمي */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>{investor.investorName}</span>
            <span>{investor.partnerName}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${investor.investorPercentage}%` }}
            >
              <span className="text-white text-xs font-bold">
                {formatNumber(investor.investorPercentage, 1)}%
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>المستثمر: {formatNumber(investor.investorPercentage, 1)}%</span>
            <span>الشريك: {formatNumber(investor.partnerPercentage, 1)}%</span>
          </div>
        </div>

        {/* الدوائر التوضيحية */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${investor.investorPercentage}, 100`}
                />
              </svg>
              <span className="absolute text-sm font-bold text-blue-600">
                {formatNumber(investor.investorPercentage, 1)}%
              </span>
            </div>
            <div className="text-sm font-medium text-gray-700">المستثمر</div>
          </div>
          
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-2">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${investor.partnerPercentage}, 100`}
                />
              </svg>
              <span className="absolute text-sm font-bold text-green-600">
                {formatNumber(investor.partnerPercentage, 1)}%
              </span>
            </div>
            <div className="text-sm font-medium text-gray-700">الشريك</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorBasicInfoCard
