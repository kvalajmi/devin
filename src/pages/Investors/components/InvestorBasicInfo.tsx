import React from 'react'
import { Investor } from '../types'

interface InvestorBasicInfoProps {
  investor: Investor
}

const InvestorBasicInfo: React.FC<InvestorBasicInfoProps> = ({ investor }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3">معلومات المستثمر</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
        <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">الاسم</label>
          <div className="text-sm font-semibold text-gray-900">{investor.investorName}</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">الرقم المدني</label>
          <div className="text-sm font-semibold text-gray-900">{investor.civilId}</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">اسم الشريك</label>
          <div className="text-sm font-semibold text-gray-900">{investor.partnerName}</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">نوع الشراكة</label>
          <div className="text-sm font-semibold text-gray-900">{investor.partnershipType}</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">نسبة المستثمر</label>
          <div className="text-sm font-semibold text-blue-600">{investor.investorPercentage}%</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">نسبة الشريك</label>
          <div className="text-sm font-semibold text-green-600">{investor.partnerPercentage}%</div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorBasicInfo
