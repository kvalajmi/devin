import React from 'react'
import { FundingRecord, WithdrawalRecord, PartnerWithdrawalRecord } from '../types'

interface InvestorBalanceProps {
  fundingRecords: FundingRecord[]
  withdrawalRecords: WithdrawalRecord[]
  partnerWithdrawalRecords: PartnerWithdrawalRecord[]
}

const InvestorBalance: React.FC<InvestorBalanceProps> = ({ 
  fundingRecords, 
  withdrawalRecords, 
  partnerWithdrawalRecords 
}) => {
  // حساب الرصيد الحالي
  const calculateCurrentBalance = () => {
    const totalFunding = fundingRecords.reduce((sum, record) => sum + record.amount, 0)
    const totalInvestorWithdrawals = withdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
    const totalPartnerWithdrawals = partnerWithdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
    return totalFunding - totalInvestorWithdrawals - totalPartnerWithdrawals
  }

  // حساب إجمالي التمويل
  const getTotalFunding = () => {
    return fundingRecords.reduce((sum, record) => sum + record.amount, 0)
  }

  // حساب إجمالي السحوبات
  const getTotalWithdrawals = () => {
    const investorWithdrawals = withdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
    const partnerWithdrawals = partnerWithdrawalRecords.reduce((sum, record) => sum + record.amount, 0)
    return investorWithdrawals + partnerWithdrawals
  }

  return (
    <div className="lg:col-span-2">
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 rounded-lg text-white shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-center">الرصيد الحالي للمحفظة</h3>
        <div className="text-center">
          <div className="text-4xl font-bold mb-3">
            {calculateCurrentBalance().toLocaleString()} د.ك
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-500 bg-opacity-30 p-3 rounded-lg">
              <div className="font-semibold">إجمالي التمويل</div>
              <div className="text-lg font-bold">
                {getTotalFunding().toLocaleString()} د.ك
              </div>
            </div>
            <div className="bg-gray-500 bg-opacity-30 p-3 rounded-lg">
              <div className="font-semibold">إجمالي السحوبات</div>
              <div className="text-lg font-bold">
                {getTotalWithdrawals().toLocaleString()} د.ك
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorBalance
