import { useMemo } from 'react'

interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * Hook مخصص لحساب إحصائيات توزيعات الأرباح
 */
export const useProfitDistributionsStats = (distributions: ProfitDistribution[]) => {
  /**
   * حساب الإحصائيات
   */
  const stats = useMemo(() => {
    if (!distributions || distributions.length === 0) {
      return {
        totalInvestors: 0,
        totalAvailableProfit: 0,
        totalDistributedAmount: 0,
        totalPartnerAmount: 0,
        remainingProfit: 0,
        distributionPercentage: 0
      }
    }

    const totalAvailableProfit = distributions.reduce((sum, dist) => sum + dist.availableProfit, 0)
    const totalDistributedAmount = distributions.reduce((sum, dist) => sum + parseFloat(dist.distributedAmount || '0'), 0)
    const totalPartnerAmount = distributions.reduce((sum, dist) => sum + parseFloat(dist.partnerAmount || '0'), 0)
    const remainingProfit = totalAvailableProfit - totalDistributedAmount - totalPartnerAmount
    const distributionPercentage = totalAvailableProfit > 0 
      ? ((totalDistributedAmount + totalPartnerAmount) / totalAvailableProfit) * 100 
      : 0

    return {
      totalInvestors: distributions.length,
      totalAvailableProfit,
      totalDistributedAmount,
      totalPartnerAmount,
      remainingProfit,
      distributionPercentage: Math.round(distributionPercentage * 100) / 100
    }
  }, [distributions])

  /**
   * التحقق من اكتمال التوزيع
   */
  const isDistributionComplete = useMemo(() => {
    return distributions.every(dist => 
      dist.distributedAmount && parseFloat(dist.distributedAmount) > 0
    )
  }, [distributions])

  /**
   * التحقق من وجود أخطاء في التوزيع
   */
  const hasDistributionErrors = useMemo(() => {
    return distributions.some(dist => {
      const distributedAmount = parseFloat(dist.distributedAmount || '0')
      const partnerAmount = parseFloat(dist.partnerAmount || '0')
      return (distributedAmount + partnerAmount) > dist.availableProfit
    })
  }, [distributions])

  return {
    stats,
    isDistributionComplete,
    hasDistributionErrors
  }
}
