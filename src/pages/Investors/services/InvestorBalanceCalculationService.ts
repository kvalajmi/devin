// استيراد الخدمات المقسمة
import { BalanceCalculator } from './BalanceCalculator'
import { FinancialStatsCalculator } from './FinancialStatsCalculator'
import { BalanceAnalyzer } from './BalanceAnalyzer'

/**
 * خدمة حساب الرصيد المعقد للمستثمر - واجهة موحدة
 * مسؤولية واحدة: توفير واجهة موحدة للخدمات المالية
 */
export class InvestorBalanceCalculationService {
  /**
   * حساب الرصيد الحالي للمستثمر وفقاً للمعادلة المحددة
   */
  static async calculateCurrentBalance(investorId: number) {
    return BalanceCalculator.calculateCurrentBalance(investorId)
  }

  /**
   * حساب إحصائيات مالية شاملة للمستثمر
   */
  static async calculateFinancialStats(investorId: number) {
    return FinancialStatsCalculator.calculateFinancialStats(investorId)
  }

  /**
   * تحليل تفصيلي للرصيد مع التوضيحات
   */
  static async getDetailedBalanceAnalysis(investorId: number) {
    return BalanceAnalyzer.getDetailedBalanceAnalysis(investorId)
  }

  /**
   * تحليل اتجاهات الرصيد
   */
  static async getBalanceTrends(investorId: number) {
    return BalanceAnalyzer.getBalanceTrends(investorId)
  }

  /**
   * حساب معدلات الأداء المالي
   */
  static async calculatePerformanceMetrics(investorId: number) {
    return FinancialStatsCalculator.calculatePerformanceMetrics(investorId)
  }
}
