import React from 'react'
import { Client } from '../../utils/database'

interface ClientHeaderProps {
  client: Client | null
  isLoading: boolean
  onEditClient: () => void
  onEditLoan: () => void
  onShowAttachments: () => void
  onShowStatement: () => void
  onBack: () => void
}

/**
 * مكون رأس العميل - يعرض المعلومات الأساسية والأزرار
 */
const ClientHeader: React.FC<ClientHeaderProps> = ({
  client,
  isLoading,
  onEditClient,
  onEditLoan,
  onShowAttachments,
  onShowStatement,
  onBack
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="text-center text-gray-500">
          لم يتم العثور على بيانات العميل
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* زر الرجوع */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة إلى القائمة
        </button>

        <div className="flex gap-2">
          <button
            onClick={onShowStatement}
            className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            📊 كشف الحساب
          </button>
          <button
            onClick={onShowAttachments}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            📎 المرفقات
          </button>
        </div>
      </div>

      {/* معلومات العميل */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* المعلومات الشخصية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            المعلومات الشخصية
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">الاسم:</span>
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الرقم المدني:</span>
              <span className="font-medium">{client.civilId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">رقم الهاتف:</span>
              <span className="font-medium">{client.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">كود المعاملة:</span>
              <span className="font-medium text-blue-600">{client.transaction_code}</span>
            </div>
          </div>
          <button
            onClick={onEditClient}
            className="w-full px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            تعديل البيانات الشخصية
          </button>
        </div>

        {/* معلومات القرض */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            معلومات القرض
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">مبلغ القرض:</span>
              <span className="font-medium text-green-600">{client.loanAmount?.toLocaleString()} د.ك</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الربح:</span>
              <span className="font-medium text-blue-600">{client.profit?.toLocaleString()} د.ك</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">قيمة القسط:</span>
              <span className="font-medium">{client.installmentValue?.toLocaleString()} د.ك</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">فترة السداد:</span>
              <span className="font-medium">{client.paymentPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الضمان:</span>
              <span className="font-medium">{client.guarantee}</span>
            </div>
          </div>
          <button
            onClick={onEditLoan}
            className="w-full px-4 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
          >
            تعديل معلومات القرض
          </button>
        </div>

        {/* التواريخ المهمة */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            التواريخ المهمة
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ نزول المعاش:</span>
              <span className="font-medium">{client.pensionDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ التمويل:</span>
              <span className="font-medium">{client.fundingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">أول قسط:</span>
              <span className="font-medium">{client.firstInstallmentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">مصروفات المعاملة:</span>
              <span className="font-medium text-red-600">{(client as any).transactionExpenses?.toLocaleString() || 0} د.ك</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientHeader
