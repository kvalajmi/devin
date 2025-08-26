import React, { useState, useEffect } from 'react'
import { SupabaseDatabase } from '../../../../utils/supabase-simple'

interface InvestorProfitCardsProps {
  investorId: number
  investorPercentage: number
  partnerPercentage: number
}

export const InvestorProfitCards: React.FC<InvestorProfitCardsProps> = ({ 
  investorId, 
  investorPercentage, 
  partnerPercentage 
}) => {
  const [profitData, setProfitData] = useState({
    totalInvestorCollectedProfit: 0,
    netInvestorProfit: 0,
    totalPartnerCollectedProfit: 0,
    netPartnerProfit: 0
  })

  useEffect(() => {
    const calculateProfits = async () => {
      try {
        const [clients, payments, expenses, lawyerFees, investorWithdrawals, partnerWithdrawals] = await Promise.all([
          SupabaseDatabase.getClients(),
          SupabaseDatabase.getPayments(),
          SupabaseDatabase.getTransactionExpenses(),
          SupabaseDatabase.getLawyerFees(),
          SupabaseDatabase.getWithdrawalRecords(investorId),
          SupabaseDatabase.getPartnerWithdrawalRecords(investorId)
        ])

        const investorClients = clients.filter(client => client.investor_id === investorId)
        let totalCollectedProfit = 0

        investorClients.forEach(client => {
          const clientPayments = payments.filter(p => p.client_id === client.id)
          const clientExpenses = expenses.filter(e => e.client_id === client.id)
          const clientFees = lawyerFees.filter(f => f.client_id === client.id)

          const totalPaid = clientPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
          const totalExpenses = clientExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
          const totalFees = clientFees.reduce((sum, f) => sum + (f.amount || 0), 0)

          const collectedProfit = totalPaid > (client.loanAmount || 0) ? totalPaid - (client.loanAmount || 0) : 0
          const netProfit = collectedProfit - totalExpenses - totalFees

          totalCollectedProfit += netProfit
        })

        const totalInvestorCollectedProfit = (totalCollectedProfit * investorPercentage) / 100
        const totalPartnerCollectedProfit = (totalCollectedProfit * partnerPercentage) / 100

        const totalInvestorWithdrawals = investorWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0)
        const totalPartnerWithdrawals = partnerWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0)

        setProfitData({
          totalInvestorCollectedProfit,
          netInvestorProfit: totalInvestorCollectedProfit - totalInvestorWithdrawals,
          totalPartnerCollectedProfit,
          netPartnerProfit: totalPartnerCollectedProfit - totalPartnerWithdrawals
        })
      } catch (error) {
        console.error('خطأ في حساب الأرباح:', error)
      }
    }

    calculateProfits()
  }, [investorId, investorPercentage, partnerPercentage])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500">إجمالي ربح المستثمر المحصل</div>
        <div className="text-2xl font-bold text-blue-600">
          {profitData.totalInvestorCollectedProfit.toLocaleString()} د.ك
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500">صافي ربح المستثمر</div>
        <div className="text-2xl font-bold text-green-600">
          {profitData.netInvestorProfit.toLocaleString()} د.ك
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500">إجمالي ربح الشريك المحصل</div>
        <div className="text-2xl font-bold text-purple-600">
          {profitData.totalPartnerCollectedProfit.toLocaleString()} د.ك
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500">صافي ربح الشريك</div>
        <div className="text-2xl font-bold text-orange-600">
          {profitData.netPartnerProfit.toLocaleString()} د.ك
        </div>
      </div>
    </div>
  )
}
