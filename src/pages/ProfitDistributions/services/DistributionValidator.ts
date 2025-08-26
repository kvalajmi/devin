interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * خدمة التحقق من صحة التوزيعات
 */
export class DistributionValidator {
  /**
   * التحقق من صحة مبالغ التوزيع
   */
  static validateDistributions(distributions: ProfitDistribution[]): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!distributions || distributions.length === 0) {
      errors.push('لا توجد توزيعات للتحقق منها')
      return { isValid: false, errors, warnings }
    }

    distributions.forEach(dist => {
      const distributedAmount = parseFloat(dist.distributedAmount) || 0
      const partnerAmount = parseFloat(dist.partnerAmount) || 0

      // التحقق من عدم تجاوز المبلغ المتاح
      if (distributedAmount > dist.availableProfit) {
        errors.push(`مبلغ التوزيع للمستثمر ${dist.investorName} يتجاوز المبلغ المتاح`)
      }

      if (partnerAmount > dist.partnerProfit) {
        errors.push(`مبلغ الشريك للمستثمر ${dist.investorName} يتجاوز نصيب الشريك`)
      }

      // التحقق من القيم السالبة
      if (distributedAmount < 0) {
        errors.push(`مبلغ التوزيع للمستثمر ${dist.investorName} لا يمكن أن يكون سالباً`)
      }

      if (partnerAmount < 0) {
        errors.push(`مبلغ الشريك للمستثمر ${dist.investorName} لا يمكن أن يكون سالباً`)
      }

      // تحذيرات
      if (distributedAmount === 0 && dist.availableProfit > 0) {
        warnings.push(`لم يتم توزيع أي مبلغ للمستثمر ${dist.investorName} رغم وجود أرباح متاحة`)
      }

      if (partnerAmount === 0 && dist.partnerProfit > 0) {
        warnings.push(`لم يتم تحديد مبلغ للشريك للمستثمر ${dist.investorName}`)
      }

      // التحقق من التوزيع الكامل
      const totalDistributed = distributedAmount + partnerAmount
      const totalAvailable = dist.availableProfit + dist.partnerProfit
      
      if (totalDistributed > totalAvailable) {
        errors.push(`إجمالي التوزيع للمستثمر ${dist.investorName} يتجاوز إجمالي المبلغ المتاح`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * التحقق من اكتمال التوزيع
   */
  static checkDistributionCompleteness(distributions: ProfitDistribution[]): {
    isComplete: boolean
    incompleteInvestors: string[]
    totalUndistributed: number
  } {
    const incompleteInvestors: string[] = []
    let totalUndistributed = 0

    distributions.forEach(dist => {
      const distributedAmount = parseFloat(dist.distributedAmount) || 0
      const partnerAmount = parseFloat(dist.partnerAmount) || 0
      const totalDistributed = distributedAmount + partnerAmount
      const totalAvailable = dist.availableProfit + dist.partnerProfit

      if (totalDistributed < totalAvailable) {
        incompleteInvestors.push(dist.investorName)
        totalUndistributed += (totalAvailable - totalDistributed)
      }
    })

    return {
      isComplete: incompleteInvestors.length === 0,
      incompleteInvestors,
      totalUndistributed: Math.round(totalUndistributed * 100) / 100
    }
  }

  /**
   * التحقق من التوازن في التوزيع
   */
  static checkDistributionBalance(distributions: ProfitDistribution[]): {
    isBalanced: boolean
    imbalances: Array<{
      investorName: string
      issue: string
      suggestion: string
    }>
  } {
    const imbalances: Array<{
      investorName: string
      issue: string
      suggestion: string
    }> = []

    distributions.forEach(dist => {
      const distributedAmount = parseFloat(dist.distributedAmount) || 0
      const partnerAmount = parseFloat(dist.partnerAmount) || 0

      // التحقق من التوزيع المتوازن
      if (distributedAmount > 0 && partnerAmount === 0 && dist.partnerProfit > 0) {
        imbalances.push({
          investorName: dist.investorName,
          issue: 'تم توزيع مبلغ للمستثمر ولكن لم يتم تحديد مبلغ للشريك',
          suggestion: 'يُنصح بتوزيع مبلغ للشريك أيضاً'
        })
      }

      if (partnerAmount > 0 && distributedAmount === 0 && dist.availableProfit > 0) {
        imbalances.push({
          investorName: dist.investorName,
          issue: 'تم تحديد مبلغ للشريك ولكن لم يتم توزيع مبلغ للمستثمر',
          suggestion: 'يُنصح بتوزيع مبلغ للمستثمر أيضاً'
        })
      }
    })

    return {
      isBalanced: imbalances.length === 0,
      imbalances
    }
  }
}
