import React, { useState } from 'react'
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters'
import { usePartnerWithdrawals } from './hooks/usePartnerWithdrawals'
import AddWithdrawalForm from './AddWithdrawalForm'

interface PartnerWithdrawalsTableProps {
  investorId: number
  partnerName: string
}

/**
 * جدول كشف مسحوبات الشريك
 * مسؤولية واحدة: عرض جدول مسحوبات الشريك مع إمكانية السحب
 */
const PartnerWithdrawalsTable: React.FC<PartnerWithdrawalsTableProps> = ({
  investorId,
  partnerName
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const { records, isLoading, error, addRecord, getTotalWithdrawals } = usePartnerWithdrawals(investorId)

  const handleAddRecord = async (recordData: { amount: number; date: string; notes: string }) => {
    await addRecord(recordData)
    setShowAddForm(false)
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center">
            <span className="text-xl ml-3">🤝</span>
            كشف مسحوبات الشريك
          </h3>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="text-sm bg-orange-500 bg-opacity-30 px-3 py-1 rounded-full">
              الإجمالي: {formatCurrency(getTotalWithdrawals())}
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              {showAddForm ? '❌ إلغاء' : '💸 سحب جديد'}
            </button>
          </div>
        </div>
      </div>

      {/* نموذج إضافة سحب جديد */}
      {showAddForm && (
        <AddWithdrawalForm
          onAdd={handleAddRecord}
          onCancel={() => setShowAddForm(false)}
          isLoading={isLoading}
          title="سحب جديد للشريك"
          type="partner"
        />
      )}

      {/* الجدول */}
      <div className="overflow-x-auto border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">جاري تحميل البيانات...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🤝</div>
            <p>لا توجد مسحوبات للشريك</p>
            <p className="text-sm">ابدأ بإضافة أول عملية سحب</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                  البيان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">
                    {record.notes || 'سحب من ' + partnerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 border border-gray-300">
                    {formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                    {formatDate(record.date)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-orange-50">
              <tr>
                <td className="px-6 py-3 text-sm font-bold text-gray-900 border border-gray-300">
                  الإجمالي
                </td>
                <td className="px-6 py-3 text-sm font-bold text-orange-600 border border-gray-300">
                  {formatCurrency(getTotalWithdrawals())}
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 border border-gray-300">
                  {formatNumber(records.length)} عملية
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}

export default PartnerWithdrawalsTable
