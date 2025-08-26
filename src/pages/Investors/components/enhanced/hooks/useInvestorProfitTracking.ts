import { useState, useEffect } from 'react'
import { SupabaseDatabase } from '../../../../../utils/supabase-simple'

interface InvestorProfitData {
  totalInvestorCollectedProfit: number
  netInvestorProfit: number
  totalPartnerCollectedProfit: number
  netPartnerProfit: number
}

/**
 * Hook لحساب وتتبع أرباح المستثمر والشريك
 */
export const useInvestorProfitTracking = (investorId: number) => {
  const [profitData, setProfitData] = useState<InvestorProfitData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateProfitData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [clients, payments, expenses, lawyerFees, withdrawals, partnerWithdrawals, investors] = await Promise.all([
        SupabaseDatabase.getClients(),
        SupabaseDatabase.getPayments(),
        SupabaseDatabase.getTransactionExpenses(),
        SupabaseDatabase.getLawyerFees(),
        SupabaseDatabase.getWithdrawalRecords(investorId),
        SupabaseDatabase.getPartnerWithdrawalRecords(investorId),
        SupabaseDatabase.getInvestors()
      ])

      const investor = investors.find(inv => inv.id === investorId)
      if (!investor) {
        throw new Error('المستثمر غير موجود')
      }

      const investorClients = clients.filter(client => client.investor_id === investorId)
      const clientIds = investorClients.map(client => client.id)

      let totalCollectedProfit = 0

      for (const client of investorClients) {
        const clientPayments = payments.filter(payment => payment.clientId === client.id)
        const totalPaid = clientPayments.reduce((sum, payment) => sum + payment.amount, 0)
        const loanAmount = client.loan_amount || 0
        
        const collectedProfit = totalPaid > loanAmount ? totalPaid - loanAmount : 0
        totalCollectedProfit += collectedProfit
      }

      const totalExpenses = expenses
        .filter(expense => clientIds.includes(expense.clientId))
        .reduce((sum, expense) => sum + expense.amount, 0)

      const totalLawyerFeesAmount = lawyerFees
        .filter(fee => clientIds.includes(fee.clientId))
        .reduce((sum, fee) => sum + fee.amount, 0)

      const netCollectedProfit = totalCollectedProfit - totalExpenses - totalLawyerFeesAmount

      const investorPercentage = investor.investor_percentage || 50
      const partnerPercentage = investor.partner_percentage || 50

      const totalInvestorCollectedProfit = (netCollectedProfit * investorPercentage) / 100
      const totalPartnerCollectedProfit = (netCollectedProfit * partnerPercentage) / 100

      const totalInvestorWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0)
      const totalPartnerWithdrawals = partnerWithdrawals.reduce((sum, w) => sum + w.amount, 0)

      const netInvestorProfit = totalInvestorCollectedProfit - totalInvestorWithdrawals
      const netPartnerProfit = totalPartnerCollectedProfit - totalPartnerWithdrawals

      setProfitData({
        totalInvestorCollectedProfit,
        netInvestorProfit,
        totalPartnerCollectedProfit,
        netPartnerProfit
      })

    } catch (error) {
      console.error('خطأ في حساب بيانات الأرباح:', error)
      setError('حدث خطأ في تحميل بيانات الأرباح')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (investorId) {
      calculateProfitData()
    }
  }, [investorId])

  return {
    profitData,
    isLoading,
    error,
    refreshProfitData: calculateProfitData
  }
}
