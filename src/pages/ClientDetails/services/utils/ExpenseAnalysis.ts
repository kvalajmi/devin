import { ExpenseCategories } from './ExpenseCategories'
import { ExpenseTrends } from './ExpenseTrends'

/**
 * خدمة تحليل المصروفات المحسّنة
 */
export class ExpenseAnalysis {
  // إعادة تصدير دوال التصنيف
  static categorizeExpenses = ExpenseCategories.categorizeExpenses
  static getExpenseStatistics = ExpenseCategories.getExpenseStatistics
  static suggestOptimizations = ExpenseCategories.suggestOptimizations

  // إعادة تصدير دوال الاتجاهات
  static analyzeExpenseTrends = ExpenseTrends.analyzeExpenseTrends
  static predictFutureExpenses = ExpenseTrends.predictFutureExpenses
  static compareWithPreviousPeriods = ExpenseTrends.compareWithPreviousPeriods

  /**
   * تحليل شامل للمصروفات
   */
  static comprehensiveAnalysis(expenses: any[], lawyerFees: any[]): {
    statistics: any
    trends: any
    categories: any
    predictions: any
    optimizations: string[]
    comparison: any
  } {
    return {
      statistics: this.getExpenseStatistics(expenses, lawyerFees),
      trends: this.analyzeExpenseTrends(expenses),
      categories: this.categorizeExpenses(expenses),
      predictions: this.predictFutureExpenses(expenses),
      optimizations: this.suggestOptimizations(expenses),
      comparison: this.compareWithPreviousPeriods(expenses)
    }
  }

  /**
   * تقرير ملخص للمصروفات
   */
  static generateSummaryReport(expenses: any[], lawyerFees: any[]): {
    title: string
    summary: string
    keyMetrics: Record<string, any>
    recommendations: string[]
  } {
    const analysis = this.comprehensiveAnalysis(expenses, lawyerFees)
    
    return {
      title: 'تقرير ملخص المصروفات',
      summary: `تم تحليل ${expenses.length} مصروف و ${lawyerFees.length} أتعاب محامي`,
      keyMetrics: {
        'إجمالي المصروفات': analysis.statistics.totalExpenses,
        'إجمالي أتعاب المحامي': analysis.statistics.totalLawyerFees,
        'المتوسط الشهري المتوقع': analysis.predictions.nextMonthEstimate,
        'الاتجاه العام': analysis.predictions.trend
      },
      recommendations: analysis.optimizations
    }
  }
}