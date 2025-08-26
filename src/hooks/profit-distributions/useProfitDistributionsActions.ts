import { useCallback } from 'react'
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
 * Hook مخصص لإجراءات توزيعات الأرباح
 */
export const useProfitDistributionsActions = (
  distributions: ProfitDistribution[],
  setDistributions: (distributions: ProfitDistribution[]) => void
) => {
  /**
   * معالج تغيير مبلغ التوزيع
   */
  const handleDistributedAmountChange = useCallback((investorId: number, value: string) => {
    setDistributions(distributions.map(dist =>
      dist.investorId === investorId 
        ? { ...dist, distributedAmount: value }
        : dist
    ))
  }, [distributions, setDistributions])

  /**
   * معالج تغيير مبلغ الشريك
   */
  const handlePartnerAmountChange = useCallback((investorId: number, value: string) => {
    setDistributions(distributions.map(dist =>
      dist.investorId === investorId 
        ? { ...dist, partnerAmount: value }
        : dist
    ))
  }, [distributions, setDistributions])

  /**
   * إعادة تعيين التوزيعات
   */
  const handleReset = useCallback(() => {
    const resetDistributions = ProfitCalculationService.resetDistributions(distributions)
    setDistributions(resetDistributions)
  }, [distributions, setDistributions])

  /**
   * توزيع تلقائي
   */
  const handleAutoDistribute = useCallback(() => {
    const autoDistributions = ProfitCalculationService.suggestAutoDistribution(distributions)
    setDistributions(autoDistributions)
  }, [distributions, setDistributions])

  return {
    handleDistributedAmountChange,
    handlePartnerAmountChange,
    handleReset,
    handleAutoDistribute
  }
}
