interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * خدمة إدارة التوزيعات
 */
export class DistributionManager {
  /**
   * إعادة تعيين التوزيعات
   */
  static resetDistributions(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return distributions.map(dist => ({
      ...dist,
      distributedAmount: '',
      partnerAmount: ''
    }))
  }

  /**
   * اقتراح توزيع تلقائي
   */
  static suggestAutoDistribution(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return distributions.map(dist => {
      // توزيع 80% من الربح المتاح للمستثمر
      const suggestedDistribution = Math.round(dist.availableProfit * 0.8)
      
      // توزيع 70% من نصيب الشريك
      const suggestedPartnerAmount = Math.round(dist.partnerProfit * 0.7)

      return {
        ...dist,
        distributedAmount: suggestedDistribution.toString(),
        partnerAmount: suggestedPartnerAmount.toString()
      }
    })
  }

  /**
   * توزيع متوازن (نسب متساوية)
   */
  static suggestBalancedDistribution(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return distributions.map(dist => {
      // توزيع نفس النسبة للمستثمر والشريك
      const distributionPercentage = 0.75 // 75%
      
      const suggestedDistribution = Math.round(dist.availableProfit * distributionPercentage)
      const suggestedPartnerAmount = Math.round(dist.partnerProfit * distributionPercentage)

      return {
        ...dist,
        distributedAmount: suggestedDistribution.toString(),
        partnerAmount: suggestedPartnerAmount.toString()
      }
    })
  }

  /**
   * توزيع محافظ (نسب منخفضة)
   */
  static suggestConservativeDistribution(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return distributions.map(dist => {
      // توزيع نسبة منخفضة للحفاظ على السيولة
      const conservativePercentage = 0.5 // 50%
      
      const suggestedDistribution = Math.round(dist.availableProfit * conservativePercentage)
      const suggestedPartnerAmount = Math.round(dist.partnerProfit * conservativePercentage)

      return {
        ...dist,
        distributedAmount: suggestedDistribution.toString(),
        partnerAmount: suggestedPartnerAmount.toString()
      }
    })
  }

  /**
   * توزيع مخصص بناءً على معايير محددة
   */
  static suggestCustomDistribution(
    distributions: ProfitDistribution[],
    criteria: {
      investorPercentage: number
      partnerPercentage: number
      minAmount?: number
      maxAmount?: number
    }
  ): ProfitDistribution[] {
    return distributions.map(dist => {
      let suggestedDistribution = Math.round(dist.availableProfit * (criteria.investorPercentage / 100))
      let suggestedPartnerAmount = Math.round(dist.partnerProfit * (criteria.partnerPercentage / 100))

      // تطبيق الحد الأدنى والأقصى إذا تم تحديدهما
      if (criteria.minAmount) {
        suggestedDistribution = Math.max(suggestedDistribution, criteria.minAmount)
        suggestedPartnerAmount = Math.max(suggestedPartnerAmount, criteria.minAmount)
      }

      if (criteria.maxAmount) {
        suggestedDistribution = Math.min(suggestedDistribution, criteria.maxAmount)
        suggestedPartnerAmount = Math.min(suggestedPartnerAmount, criteria.maxAmount)
      }

      // التأكد من عدم تجاوز المبلغ المتاح
      suggestedDistribution = Math.min(suggestedDistribution, dist.availableProfit)
      suggestedPartnerAmount = Math.min(suggestedPartnerAmount, dist.partnerProfit)

      return {
        ...dist,
        distributedAmount: suggestedDistribution.toString(),
        partnerAmount: suggestedPartnerAmount.toString()
      }
    })
  }

  /**
   * تطبيق توزيع موحد لجميع المستثمرين
   */
  static applyUniformDistribution(
    distributions: ProfitDistribution[],
    amount: number,
    type: 'fixed' | 'percentage' = 'fixed'
  ): ProfitDistribution[] {
    return distributions.map(dist => {
      let distributedAmount: number
      let partnerAmount: number

      if (type === 'percentage') {
        distributedAmount = Math.round(dist.availableProfit * (amount / 100))
        partnerAmount = Math.round(dist.partnerProfit * (amount / 100))
      } else {
        distributedAmount = Math.min(amount, dist.availableProfit)
        partnerAmount = Math.min(amount, dist.partnerProfit)
      }

      return {
        ...dist,
        distributedAmount: distributedAmount.toString(),
        partnerAmount: partnerAmount.toString()
      }
    })
  }
}
