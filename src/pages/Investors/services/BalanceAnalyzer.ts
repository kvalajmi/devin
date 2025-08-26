import { BalanceCalculator } from './BalanceCalculator'

/**
 * خدمة تحليل الرصيد التفصيلي
 * مسؤولية واحدة: تحليل وتفسير بيانات الرصيد
 */
export class BalanceAnalyzer {
  /**
   * تحليل تفصيلي للرصيد مع التوضيحات
   */
  static async getDetailedBalanceAnalysis(investorId: number): Promise<{
    formula: string
    calculation: string
    result: number
    components: Array<{
      name: string
      value: number
      type: 'positive' | 'negative'
      description: string
    }>
  }> {
    const balanceData = await BalanceCalculator.calculateCurrentBalance(investorId)
    const { breakdown } = balanceData

    return {
      formula: 'الرصيد الحالي = التمويل الفعلي + إجمالي التحصيل - إجمالي مبلغ القروض - مسحوبات الشريك - مسحوبات المستثمر - إجمالي المصاريف',
      calculation: `${breakdown.actualFunding} + ${breakdown.totalCollection} - ${breakdown.totalLoanAmount} - ${breakdown.partnerWithdrawals} - ${breakdown.investorWithdrawals} - ${breakdown.totalExpenses + breakdown.totalLawyerFees}`,
      result: balanceData.currentBalance,
      components: [
        {
          name: 'التمويل الفعلي',
          value: breakdown.actualFunding,
          type: 'positive',
          description: 'المبالغ المودعة من قبل المستثمر'
        },
        {
          name: 'إجمالي التحصيل',
          value: breakdown.totalCollection,
          type: 'positive',
          description: 'المبالغ المحصلة من العملاء'
        },
        {
          name: 'إجمالي مبلغ القروض',
          value: breakdown.totalLoanAmount,
          type: 'negative',
          description: 'المبالغ المقرضة للعملاء'
        },
        {
          name: 'مسحوبات الشريك',
          value: breakdown.partnerWithdrawals,
          type: 'negative',
          description: 'المبالغ المسحوبة من قبل الشريك'
        },
        {
          name: 'مسحوبات المستثمر',
          value: breakdown.investorWithdrawals,
          type: 'negative',
          description: 'المبالغ المسحوبة من قبل المستثمر'
        },
        {
          name: 'المصاريف العادية',
          value: breakdown.totalExpenses,
          type: 'negative',
          description: 'مصاريف المعاملات والعمليات'
        },
        {
          name: 'أتعاب المحامي',
          value: breakdown.totalLawyerFees,
          type: 'negative',
          description: 'أتعاب المحاماة والاستشارات القانونية'
        }
      ]
    }
  }

  /**
   * تحليل اتجاهات الرصيد
   */
  static async getBalanceTrends(investorId: number): Promise<{
    trend: 'increasing' | 'decreasing' | 'stable'
    recommendation: string
    riskLevel: 'low' | 'medium' | 'high'
    actionItems: string[]
  }> {
    try {
      const balanceData = await BalanceCalculator.calculateCurrentBalance(investorId)
      const { breakdown, currentBalance } = balanceData

      // تحليل الاتجاه
      const totalIncome = breakdown.actualFunding + breakdown.totalCollection
      const totalOutgoing = breakdown.totalLoanAmount + breakdown.partnerWithdrawals + 
                           breakdown.investorWithdrawals + breakdown.totalExpenses + breakdown.totalLawyerFees

      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
      let riskLevel: 'low' | 'medium' | 'high' = 'low'
      let recommendation = ''
      const actionItems: string[] = []

      if (currentBalance > 0) {
        if (totalIncome > totalOutgoing * 1.2) {
          trend = 'increasing'
          recommendation = 'الوضع المالي ممتاز مع نمو إيجابي'
          riskLevel = 'low'
          actionItems.push('النظر في فرص استثمارية جديدة')
          actionItems.push('الحفاظ على معدل النمو الحالي')
        } else {
          trend = 'stable'
          recommendation = 'الوضع المالي مستقر'
          riskLevel = 'medium'
          actionItems.push('مراقبة التدفقات النقدية')
          actionItems.push('تحسين معدل التحصيل')
        }
      } else {
        trend = 'decreasing'
        recommendation = 'يحتاج إلى تدخل فوري لتحسين الوضع المالي'
        riskLevel = 'high'
        actionItems.push('مراجعة استراتيجية الاستثمار')
        actionItems.push('تقليل المسحوبات')
        actionItems.push('زيادة التحصيل من العملاء')
      }

      return {
        trend,
        recommendation,
        riskLevel,
        actionItems
      }
    } catch (error) {
      console.error('❌ خطأ في تحليل اتجاهات الرصيد:', error)
      return {
        trend: 'stable',
        recommendation: 'غير متاح',
        riskLevel: 'medium',
        actionItems: []
      }
    }
  }
}
