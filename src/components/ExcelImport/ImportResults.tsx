import React from 'react'
import { ImportedClient } from './DataParser'

interface ImportResultsProps {
  clients: ImportedClient[]
  onStartImport: () => void
  onClear: () => void
  isImporting: boolean
}

/**
 * مكون عرض نتائج تحليل الملف قبل الاستيراد
 */
const ImportResults: React.FC<ImportResultsProps> = ({ 
  clients, 
  onStartImport, 
  onClear, 
  isImporting 
}) => {
  if (clients.length === 0) return null

  const totalPayments = clients.reduce((sum, client) => sum + client.payments.length, 0)
  const totalExpenses = clients.reduce((sum, client) => sum + client.expenses.length, 0)
  const totalLawyerFees = clients.reduce((sum, client) => sum + client.lawyerFees.length, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">نتائج تحليل الملف</h3>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            disabled={isImporting}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            مسح
          </button>
          <button
            onClick={onStartImport}
            disabled={isImporting}
            className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
          >
            {isImporting ? 'جاري الاستيراد...' : 'بدء الاستيراد'}
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
          <div className="text-sm text-blue-800">عميل</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalPayments}</div>
          <div className="text-sm text-green-800">دفعة</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{totalExpenses}</div>
          <div className="text-sm text-red-800">مصروف</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{totalLawyerFees}</div>
          <div className="text-sm text-purple-800">أتعاب محامي</div>
        </div>
      </div>

      {/* قائمة العملاء */}
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">كود المعاملة</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم العميل</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">مبلغ القرض</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدفوعات</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المصروفات</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">أتعاب المحامي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {client.transactionCode}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {client.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {client.loanAmount.toLocaleString()} د.ك
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {client.payments.length}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {client.expenses.length}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {client.lawyerFees.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ImportResults
