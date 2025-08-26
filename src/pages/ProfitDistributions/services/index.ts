// تصدير جميع خدمات توزيعات الأرباح المقسمة
export { ProfitCalculator } from './ProfitCalculator'
export { DistributionValidator } from './DistributionValidator'
export { DistributionManager } from './DistributionManager'
export { DistributionExporter } from './DistributionExporter'

// تصدير الواجهات المشتركة
export interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}
