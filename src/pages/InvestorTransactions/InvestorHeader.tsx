import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Investor {
  id: number
  investorName: string
  partnerName: string
  partnershipType: string
  partnerPercentage: number
  civilId: string
  joinDate: string
}

interface InvestorHeaderProps {
  investor: Investor
  investorId?: string
}

/**
 * مكون رأس المستثمر - يعرض معلومات المستثمر والأزرار
 */
const InvestorHeader: React.FC<InvestorHeaderProps> = ({ investor, investorId }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              معاملات المستثمر: {investor.investorName}
            </h1>
          </div>
          
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={() => navigate(`/investor-import/${investorId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              استيراد من Excel
            </button>
            <button
              onClick={() => navigate('/investors')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              العودة لقائمة المستثمرين
            </button>
          </div>
        </div>
        
        {/* معلومات إضافية عن المستثمر */}
        <div className="pb-4 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">الشريك:</span>
              <span className="font-medium text-gray-900 mr-2">{investor.partnerName}</span>
            </div>
            <div>
              <span className="text-gray-600">نوع الشراكة:</span>
              <span className="font-medium text-gray-900 mr-2">{investor.partnershipType}</span>
            </div>
            <div>
              <span className="text-gray-600">نسبة الشريك:</span>
              <span className="font-medium text-gray-900 mr-2">{investor.partnerPercentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">تاريخ الانضمام:</span>
              <span className="font-medium text-gray-900 mr-2">{investor.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorHeader
