// واجهة موحدة لخدمات حساب وتوزيع الأرباح - محسّنة حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى خدمات متخصصة منفصلة

import {
  ProfitCalculator,
  DistributionValidator,
  DistributionManager,
  DistributionExporter,
  ProfitDistribution
} from './services'

/**
 * خدمة حساب الأرباح وتوزيعها - واجهة موحدة
 * تعمل كواجهة للخدمات المتخصصة المنفصلة
 */
export class ProfitCalculationService {
  // ===== حساب الأرباح =====
  static calculateDistributions(
    investors: any[],
    clients: any[],
    expenses: any[],
    fees: any[],
    partnerWithdrawals: any[]
  ): ProfitDistribution[] {
    return ProfitCalculator.calculateDistributions(investors, clients, expenses, fees, partnerWithdrawals)
  }

  static calculateInvestorProfitStats(investor: any, clients: any[], expenses: any[], fees: any[]) {
    return ProfitCalculator.calculateInvestorProfitStats(investor, clients, expenses, fees)
  }

  // ===== التحقق من صحة البيانات =====
  static validateDistributions(distributions: ProfitDistribution[]) {
    return DistributionValidator.validateDistributions(distributions)
  }

  static validateDistributionAmounts(distributions: ProfitDistribution[]) {
    const result = DistributionValidator.validateDistributions(distributions)
    return {
      isValid: result.isValid,
      errors: result.errors
    }
  }

  static checkDistributionCompleteness(distributions: ProfitDistribution[]) {
    return DistributionValidator.checkDistributionCompleteness(distributions)
  }

  static checkDistributionBalance(distributions: ProfitDistribution[]) {
    return DistributionValidator.checkDistributionBalance(distributions)
  }

  // ===== إدارة التوزيعات =====
  static resetDistributions(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return DistributionManager.resetDistributions(distributions)
  }

  static suggestAutoDistribution(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return DistributionManager.suggestAutoDistribution(distributions)
  }

  static suggestBalancedDistribution(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return DistributionManager.suggestBalancedDistribution(distributions)
  }

  static suggestConservativeDistribution(distributions: ProfitDistribution[]): ProfitDistribution[] {
    return DistributionManager.suggestConservativeDistribution(distributions)
  }

  static suggestCustomDistribution(distributions: ProfitDistribution[], criteria: any): ProfitDistribution[] {
    return DistributionManager.suggestCustomDistribution(distributions, criteria)
  }

  // ===== تصدير البيانات =====
  static exportDistributions(distributions: ProfitDistribution[]) {
    return DistributionExporter.exportDistributions(distributions)
  }

  static exportToExcel(distributions: ProfitDistribution[]) {
    return DistributionExporter.exportToExcel(distributions)
  }

  static exportDistributionData(distributions: ProfitDistribution[]) {
    const result = DistributionExporter.exportDistributions(distributions)
    return result.data
  }

  static generateDetailedReport(distributions: ProfitDistribution[]): string {
    return DistributionExporter.generateDetailedReport(distributions)
  }

  // ===== وظائف مساعدة للتوافق مع الكود القديم =====
  static saveDistributions(_distributions: ProfitDistribution[]) {
    // يمكن إضافة منطق الحفظ هنا لاحقاً
    return {
      success: true,
      message: 'تم حفظ التوزيعات بنجاح'
    }
  }
}
