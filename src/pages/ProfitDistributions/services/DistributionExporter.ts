interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

import { DistributionDataProcessor } from './DistributionDataProcessor'
import { DistributionFileExporter } from './DistributionFileExporter'

/**
 * خدمة تصدير التوزيعات - واجهة موحدة
 * تم تقسيمها حسب القاعدة الذهبية (200 سطر كحد أقصى)
 */
export class DistributionExporter {
  /**
   * تصدير بيانات التوزيع
   */
  static exportDistributions(distributions: ProfitDistribution[]): {
    success: boolean
    message: string
    data?: any
  } {
    return DistributionFileExporter.exportDistributions(distributions)
  }

  /**
   * تصدير إلى Excel
   */
  static exportToExcel(distributions: ProfitDistribution[]): {
    success: boolean
    message: string
  } {
    return DistributionFileExporter.exportToExcel(distributions)
  }

  /**
   * إنشاء تقرير مفصل
   */
  static generateDetailedReport(distributions: ProfitDistribution[]): string {
    return DistributionDataProcessor.generateDetailedReport(distributions)
  }

  /**
   * تصدير بيانات التوزيع (للتوافق مع الكود القديم)
   */
  static exportDistributionData(distributions: ProfitDistribution[]): any {
    return DistributionDataProcessor.prepareExportData(distributions)
  }
}
