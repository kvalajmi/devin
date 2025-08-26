import React from 'react'
import { Client } from '../../utils/database'

interface ClientsTableProps {
  clients: Client[]
  isLoading: boolean
  onClientClick: (client: Client) => void
}

/**
 * مكون جدول العملاء
 */
const ClientsTable: React.FC<ClientsTableProps> = ({ clients, isLoading, onClientClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h10m-10 4h6m2 5v6m8-6v6m-8-10V9a3 3 0 114 0v11m-4-11V9a3 3 0 00-6 0v2M7 19a2 2 0 012-2h6a2 2 0 012 2v1a2 2 0 01-2 2H9a2 2 0 01-2-2v-1z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد عملاء</h3>
          <p className="mt-2 text-sm text-gray-500">لم يتم العثور على أي عملاء لهذا المستثمر</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الرقم
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                اسم العميل
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الرقم المدني
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                مبلغ القرض
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الربح
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجمالي
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                المدفوع
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                المتبقي
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client, index) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onClientClick(client)}
              >
                <td className="text-right px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  {client.phoneNumber && (
                    <div className="text-sm text-gray-500">{client.phoneNumber}</div>
                  )}
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {client.civilId}
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    {client.loanAmount?.toLocaleString()} د.ك
                  </div>
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">
                    {client.profit?.toLocaleString()} د.ك
                  </div>
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {client.totalAmount?.toLocaleString()} د.ك
                  </div>
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    {client.totalPaid?.toLocaleString()} د.ك
                  </div>
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-red-600">
                    {client.totalRemaining?.toLocaleString()} د.ك
                  </div>
                </td>
                
                <td className="text-right px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onClientClick(client)
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                  >
                    عرض تفاصيل العميل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientsTable
