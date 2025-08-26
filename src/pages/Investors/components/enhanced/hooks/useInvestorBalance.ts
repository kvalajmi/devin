import { useState, useEffect } from 'react'
import { InvestorBalanceCalculationService } from '../../../services/InvestorBalanceCalculationService'

interface BalanceData {
  currentBalance: number
  breakdown: {
    actualFunding: number
    totalCollection: number
    totalLoanAmount: number
    partnerWithdrawals: number
    investorWithdrawals: number
    totalExpenses: number
    totalLawyerFees: number
  }
}

/**
 * Hook مخصص لإدارة بيانات رصيد المستثمر
 * مسؤولية واحدة: جلب وإدارة بيانات الرصيد
 */
export const useInvestorBalance = (investorId: number) => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBalanceData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await InvestorBalanceCalculationService.calculateCurrentBalance(investorId)
      setBalanceData(data)
    } catch (error) {
      console.error('خطأ في تحميل بيانات الرصيد:', error)
      setError('فشل في تحميل بيانات الرصيد')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (investorId) {
      loadBalanceData()
    }
  }, [investorId])

  return {
    balanceData,
    isLoading,
    error,
    refreshBalance: loadBalanceData
  }
}
