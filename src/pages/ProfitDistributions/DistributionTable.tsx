import React from 'react'
import GlobalArabicNumberInput from '../../components/forms/GlobalArabicNumberInput'

interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

interface DistributionTableProps {
  distributions: ProfitDistribution[]
  onDistributedAmountChange: (investorId: number, value: string) => void
  onPartnerAmountChange: (investorId: number, value: string) => void
}

/**
 * مكون جدول توزيعات الأرباح
 */
const DistributionTable: React.FC<DistributionTableProps> = ({
  distributions,
  onDistributedAmountChange,
  onPartnerAmountChange
}) => {
  if (distributions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">💰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد توزيعات متاحة</h3>
        <p className="text-gray-500">لم يتم العثور على أي مستثمرين أو أرباح قابلة للتوزيع</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستثمر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الربح المتاح للتوزيع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ الموزع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نصيب الشريك
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مبلغ الشريك
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {distributions.map((distribution) => (
              <tr 
                key={distribution.investorId}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {distribution.investorName?.charAt(0) || '؟'}
                        </span>
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {distribution.investorName || 'غير محدد'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {distribution.investorId}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    {distribution.availableProfit.toLocaleString()} د.ك
                  </div>
                  <div className="text-xs text-gray-500">
                    متاح للتوزيع
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <GlobalArabicNumberInput
                    type="text"
                    value={distribution.distributedAmount}
                    onChange={(value) => onDistributedAmountChange(distribution.investorId, value)}
                    placeholder="أدخل المبلغ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {distribution.distributedAmount && (
                    <div className="text-xs text-gray-500 mt-1">
                      المتبقي: {(distribution.availableProfit - (parseFloat(distribution.distributedAmount) || 0)).toLocaleString()} د.ك
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-purple-600">
                    {distribution.partnerProfit.toLocaleString()} د.ك
                  </div>
                  <div className="text-xs text-gray-500">
                    نصيب الشريك
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <GlobalArabicNumberInput
                    type="text"
                    value={distribution.partnerAmount}
                    onChange={(value) => onPartnerAmountChange(distribution.investorId, value)}
                    placeholder="أدخل المبلغ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  {distribution.partnerAmount && (
                    <div className="text-xs text-gray-500 mt-1">
                      المتبقي: {(distribution.partnerProfit - (parseFloat(distribution.partnerAmount) || 0)).toLocaleString()} د.ك
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* ملخص الإجماليات */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">إجمالي الأرباح المتاحة</div>
            <div className="text-lg font-semibold text-green-600">
              {distributions.reduce((sum, dist) => sum + dist.availableProfit, 0).toLocaleString()} د.ك
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">إجمالي الموزع</div>
            <div className="text-lg font-semibold text-blue-600">
              {distributions.reduce((sum, dist) => sum + (parseFloat(dist.distributedAmount) || 0), 0).toLocaleString()} د.ك
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">إجمالي نصيب الشركاء</div>
            <div className="text-lg font-semibold text-purple-600">
              {distributions.reduce((sum, dist) => sum + dist.partnerProfit, 0).toLocaleString()} د.ك
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">إجمالي مبلغ الشركاء</div>
            <div className="text-lg font-semibold text-orange-600">
              {distributions.reduce((sum, dist) => sum + (parseFloat(dist.partnerAmount) || 0), 0).toLocaleString()} د.ك
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistributionTable
