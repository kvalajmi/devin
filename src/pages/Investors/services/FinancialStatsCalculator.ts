import { SupabaseDatabase } from '../../../utils/supabase-simple'
import { BalanceCalculator } from './BalanceCalculator'

/**
 * خدمة حساب الإحصائيات المالية
 * مسؤولية واحدة: حساب الإحصائيات والمؤشرات المالية
 */
export class FinancialStatsCalculator {
  /**
   * حساب إحصائيات مالية شاملة للمستثمر
   */
  static async calculateFinancialStats(investorId: number): Promise<{
    totalIncome: number
    totalOutgoing: number
    netPosition: number
    profitMargin: number
    clientsCount: number
    activeLoansCount: number
  }> {
    try {
      const balanceData = await BalanceCalculator.calculateCurrentBalance(investorId)
      const clients = await SupabaseDatabase.getClients()
      const investorClients = clients // مؤقتاً جميع العملاء

      const totalIncome = balanceData.breakdown.actualFunding + balanceData.breakdown.totalCollection
      const totalOutgoing = balanceData.breakdown.totalLoanAmount + 
                           balanceData.breakdown.partnerWithdrawals + 
                           balanceData.breakdown.investorWithdrawals + 
                           balanceData.breakdown.totalExpenses + 
                           balanceData.breakdown.totalLawyerFees

      const netPosition = totalIncome - totalOutgoing
      const profitMargin = totalIncome > 0 ? ((netPosition / totalIncome) * 100) : 0
      const activeLoansCount = investorClients.filter(client => (client.totalRemaining || 0) > 0).length

      return {
        totalIncome,
        totalOutgoing,
        netPosition,
        profitMargin: Math.round(profitMargin * 100) / 100,
        clientsCount: investorClients.length,
        activeLoansCount
      }
    } catch (error) {
      console.error('❌ خطأ في حساب الإحصائيات المالية:', error)
      return {
        totalIncome: 0,
        totalOutgoing: 0,
        netPosition: 0,
        profitMargin: 0,
        clientsCount: 0,
        activeLoansCount: 0
      }
    }
  }

  /**
   * حساب معدلات الأداء المالي
   */
  static async calculatePerformanceMetrics(investorId: number): Promise<{
    returnOnInvestment: number
    cashFlowRatio: number
    debtToEquityRatio: number
    liquidityRatio: number
  }> {
    try {
      const stats = await this.calculateFinancialStats(investorId)
      const balanceData = await BalanceCalculator.calculateCurrentBalance(investorId)

      // معدل العائد على الاستثمار
      const returnOnInvestment = balanceData.breakdown.actualFunding > 0 
        ? (stats.netPosition / balanceData.breakdown.actualFunding) * 100 
        : 0

      // نسبة التدفق النقدي
      const cashFlowRatio = stats.totalOutgoing > 0 
        ? (stats.totalIncome / stats.totalOutgoing) * 100 
        : 0

      // نسبة الدين إلى حقوق الملكية
      const debtToEquityRatio = balanceData.breakdown.actualFunding > 0 
        ? (balanceData.breakdown.totalLoanAmount / balanceData.breakdown.actualFunding) * 100 
        : 0

      // نسبة السيولة
      const liquidityRatio = balanceData.breakdown.totalLoanAmount > 0 
        ? (balanceData.breakdown.totalCollection / balanceData.breakdown.totalLoanAmount) * 100 
        : 0

      return {
        returnOnInvestment: Math.round(returnOnInvestment * 100) / 100,
        cashFlowRatio: Math.round(cashFlowRatio * 100) / 100,
        debtToEquityRatio: Math.round(debtToEquityRatio * 100) / 100,
        liquidityRatio: Math.round(liquidityRatio * 100) / 100
      }
    } catch (error) {
      console.error('❌ خطأ في حساب معدلات الأداء:', error)
      return {
        returnOnInvestment: 0,
        cashFlowRatio: 0,
        debtToEquityRatio: 0,
        liquidityRatio: 0
      }
    }
  }
}
