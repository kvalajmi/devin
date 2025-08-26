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

      console.log(`Debug: Investor ${investorId} has ${investorClients.length} clients`)
      console.log('Debug: All clients:', clients.map(c => ({ id: c.id, name: c.name, investor_id: c.investor_id })))
      console.log('Debug: Filtered investor clients:', investorClients.map(c => ({ id: c.id, name: c.name })))

      let totalCollectedProfit = 0

      for (const client of investorClients) {
        const clientPayments = payments.filter(payment => payment.client_id === client.id)
        const totalPaid = clientPayments.reduce((sum, payment) => sum + payment.amount, 0)
        const loanAmount = client.loan_amount || 0
        
        console.log(`Debug: Client ${client.name}: totalPaid=${totalPaid}, loanAmount=${loanAmount}`)
        
        const collectedProfit = totalPaid > loanAmount ? totalPaid - loanAmount : 0
        totalCollectedProfit += collectedProfit
        
        console.log(`Debug: Client ${client.name} profit: ${collectedProfit}`)
      }
      
      console.log(`Debug: Total collected profit: ${totalCollectedProfit}`)

      const totalExpenses = expenses
        .filter(expense => clientIds.includes(expense.client_id))
        .reduce((sum, expense) => sum + expense.amount, 0)

      const totalLawyerFeesAmount = lawyerFees
        .filter(fee => clientIds.includes(fee.client_id))
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
