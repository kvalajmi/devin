import { useState, useCallback } from 'react'
import { SupabaseDatabase } from '../../utils/supabase-simple'
import { ProfitCalculationService } from '../../pages/ProfitDistributions/ProfitCalculationService'

interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * Hook مخصص لإدارة بيانات توزيعات الأرباح
 */
export const useProfitDistributionsData = () => {
  const [distributions, setDistributions] = useState<ProfitDistribution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * تحميل بيانات التوزيعات
   */
  const loadDistributionsData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // جلب جميع البيانات المطلوبة
      const [investors, clients, expenses, fees, partnerWithdrawals] = await Promise.all([
        SupabaseDatabase.getInvestors(),
        SupabaseDatabase.getClients(),
        SupabaseDatabase.getTransactionExpenses(),
        SupabaseDatabase.getLawyerFees(),
        SupabaseDatabase.getPartnerWithdrawalRecords()
      ])

      // حساب التوزيعات
      const calculatedDistributions = ProfitCalculationService.calculateDistributions(
        investors, clients, expenses, fees, partnerWithdrawals
      )

      setDistributions(calculatedDistributions)
    } catch (error) {
      console.error('خطأ في تحميل بيانات التوزيع:', error)
      setError('حدث خطأ في تحميل بيانات التوزيع')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * إعادة تحميل البيانات
   */
  const reloadData = useCallback(() => {
    loadDistributionsData()
  }, [loadDistributionsData])

  /**
   * مسح الخطأ
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    distributions,
    setDistributions,
    isLoading,
    error,
    loadDistributionsData,
    reloadData,
    clearError
  }
}
