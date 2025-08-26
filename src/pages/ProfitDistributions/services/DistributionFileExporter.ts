interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

import { DistributionDataProcessor } from './DistributionDataProcessor'

/**
 * خدمة تصدير ملفات التوزيعات
 * تم فصلها حسب القاعدة الذهبية
 */
export class DistributionFileExporter {
  /**
   * تصدير بيانات التوزيع
   */
  static exportDistributions(distributions: ProfitDistribution[]): {
    success: boolean
    message: string
    data?: any
  } {
    try {
      const exportData = DistributionDataProcessor.prepareExportData(distributions)
      
      // تحويل البيانات إلى JSON وتنزيلها
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `profit_distributions_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return {
        success: true,
        message: 'تم تصدير البيانات بنجاح!',
        data: exportData
      }
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error)
      return {
        success: false,
        message: 'حدث خطأ أثناء تصدير البيانات'
      }
    }
  }

  /**
   * تصدير إلى Excel
   */
  static exportToExcel(distributions: ProfitDistribution[]): {
    success: boolean
    message: string
  } {
    try {
      // إنشاء بيانات CSV
      const csvData = DistributionDataProcessor.convertToCSV(distributions)
      
      // إنشاء ملف CSV
      const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(csvBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `profit_distributions_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return {
        success: true,
        message: 'تم تصدير البيانات إلى Excel بنجاح!'
      }
    } catch (error) {
      console.error('خطأ في تصدير Excel:', error)
      return {
        success: false,
        message: 'حدث خطأ أثناء تصدير البيانات إلى Excel'
      }
    }
  }

  /**
   * تصدير تقرير نصي
   */
  static exportTextReport(distributions: ProfitDistribution[]): {
    success: boolean
    message: string
  } {
    try {
      const reportContent = DistributionDataProcessor.generateDetailedReport(distributions)
      
      const reportBlob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
      const url = URL.createObjectURL(reportBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `profit_distributions_report_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return {
        success: true,
        message: 'تم تصدير التقرير بنجاح!'
      }
    } catch (error) {
      console.error('خطأ في تصدير التقرير:', error)
      return {
        success: false,
        message: 'حدث خطأ أثناء تصدير التقرير'
      }
    }
  }
}
