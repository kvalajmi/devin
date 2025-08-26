import React from 'react'
import { FundingRecord, WithdrawalRecord, PartnerWithdrawalRecord } from '../types'

interface InvestorSummaryProps {
  fundingRecords: FundingRecord[]
  withdrawalRecords: WithdrawalRecord[]
  partnerWithdrawalRecords: PartnerWithdrawalRecord[]
}

const InvestorSummary: React.FC<InvestorSummaryProps> = ({ 
  fundingRecords, 
  withdrawalRecords, 
  partnerWithdrawalRecords 
}) => {
  // حساب إجمالي التمويل
  const getTotalFunding = () => {
    return fundingRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  // حساب إجمالي سحوبات المستثمر
  const getInvestorWithdrawals = () => {
    return withdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  // حساب إجمالي سحوبات الشريك
  const getPartnerWithdrawals = () => {
    return partnerWithdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  return (
    <div className="lg:col-span-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800">إحصائيات المحفظة الاستثمارية</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* إجمالي التمويل */}
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-blue-500"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">إجمالي التمويل</div>
                <div className="text-xs text-gray-500">التمويل الفعلي</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {getTotalFunding().toLocaleString()} د.ك
            </div>
            <div className="text-sm text-gray-600">
              عدد العمليات: <span className="font-semibold">{fundingRecords.length}</span>
            </div>
          </div>
        </div>

        {/* سحوبات المستثمر */}
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-emerald-500"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">سحوبات المستثمر</div>
                <div className="text-xs text-gray-500">المبالغ المسحوبة</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {getInvestorWithdrawals().toLocaleString()} د.ك
            </div>
            <div className="text-sm text-gray-600">
              عدد العمليات: <span className="font-semibold">{withdrawalRecords.length}</span>
            </div>
          </div>
        </div>

        {/* سحوبات الشريك */}
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-amber-500"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">سحوبات الشريك</div>
                <div className="text-xs text-gray-500">المبالغ المسحوبة</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {getPartnerWithdrawals().toLocaleString()} د.ك
            </div>
            <div className="text-sm text-gray-600">
              عدد العمليات: <span className="font-semibold">{partnerWithdrawalRecords.length}</span>
            </div>
          </div>
        </div>

        {/* الرصيد المتبقي */}
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-gray-500"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">الرصيد المتبقي</div>
                <div className="text-xs text-gray-500">بعد السحوبات</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {(getTotalFunding() - getInvestorWithdrawals() - getPartnerWithdrawals()).toLocaleString()} د.ك
            </div>
            <div className="text-sm text-gray-600">
              الرصيد الحالي
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorSummary
