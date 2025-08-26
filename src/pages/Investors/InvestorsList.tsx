import React from 'react'
import { Investor } from './types'

interface InvestorsListProps {
  investors: Investor[]
  onViewDetails: (investor: Investor) => void
  onEdit: (investor: Investor) => void
  onDelete: (investorId: number) => void
  onViewTransactions: (investor: Investor) => void
}

const InvestorsList: React.FC<InvestorsListProps> = ({
  investors,
  onViewDetails,
  onEdit,
  onDelete,
  onViewTransactions
}) => {
  if (investors.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-500 text-lg mb-2">لا توجد مستثمرين مسجلين</div>
        <div className="text-gray-400">قم بإضافة مستثمر جديد للبدء</div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full border-2 border-gray-400 rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-gray-200 to-gray-300">
            <tr>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                معاملات المستثمر
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                اسم المستثمر
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                اسم الشريك
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                نوع الشراكة
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                نسبة المستثمر
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                نسبة الشريك
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                الرقم المدني
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                تاريخ الانضمام
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-base font-bold text-gray-800 border-2 border-gray-400">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {investors.map((investor, index) => (
              <tr 
                key={investor.id} 
                className={`hover:bg-blue-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <button
                    onClick={() => onViewTransactions(investor)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    عرض المعاملات
                  </button>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-base font-bold text-gray-900">{investor.investorName}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-base font-medium text-gray-700">{investor.partnerName}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-base font-medium text-gray-700">{investor.partnershipType}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-lg font-bold text-blue-600">{investor.investorPercentage}%</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-lg font-bold text-green-600">{investor.partnerPercentage}%</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-base font-medium text-gray-700">{investor.civilId}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="text-base font-medium text-gray-700">{investor.joinDate}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 border-2 border-gray-400">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onViewDetails(investor)}
                      className="px-4 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={() => onEdit(investor)}
                      className="px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => onDelete(investor.id)}
                      className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvestorsList
