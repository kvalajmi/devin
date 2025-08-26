// تصدير جميع hooks توزيعات الأرباح المقسمة
export { useProfitDistributionsData } from './useProfitDistributionsData'
export { useProfitDistributionsActions } from './useProfitDistributionsActions'
export { useProfitDistributionsOperations } from './useProfitDistributionsOperations'
export { useProfitDistributionsStats } from './useProfitDistributionsStats'

// تصدير الواجهات المشتركة
export interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}
