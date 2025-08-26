interface ProfitDistribution {
  investorId: number
  investorName: string
  availableProfit: number
  distributedAmount: string
  partnerProfit: number
  partnerAmount: string
}

/**
 * خدمة تصدير التوزيعات
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
    try {
      const exportData = this.prepareExportData(distributions)
      
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
      const csvData = this.convertToCSV(distributions)
      
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
   * تحضير بيانات التصدير
   */
  private static prepareExportData(distributions: ProfitDistribution[]) {
    const exportDate = new Date().toISOString()
    
    // حساب الإحصائيات الإجمالية
    const totalStats = this.calculateTotalStats(distributions)
    
    return {
      metadata: {
        exportDate,
        totalInvestors: distributions.length,
        generatedBy: 'نظام هارموني - إدارة توزيعات الأرباح'
      },
      summary: totalStats,
      distributions: distributions.map(dist => ({
        investorId: dist.investorId,
        investorName: dist.investorName,
        availableProfit: dist.availableProfit,
        distributedAmount: parseFloat(dist.distributedAmount) || 0,
        partnerProfit: dist.partnerProfit,
        partnerAmount: parseFloat(dist.partnerAmount) || 0,
        totalDistributed: (parseFloat(dist.distributedAmount) || 0) + (parseFloat(dist.partnerAmount) || 0),
        remainingAmount: dist.availableProfit + dist.partnerProfit - ((parseFloat(dist.distributedAmount) || 0) + (parseFloat(dist.partnerAmount) || 0))
      }))
    }
  }

  /**
   * تحويل إلى CSV
   */
  private static convertToCSV(distributions: ProfitDistribution[]): string {
    const headers = [
      'معرف المستثمر',
      'اسم المستثمر',
      'الربح المتاح',
      'المبلغ الموزع',
      'نصيب الشريك',
      'مبلغ الشريك',
      'إجمالي التوزيع',
      'المبلغ المتبقي'
    ]

    const csvRows = [
      headers.join(','),
      ...distributions.map(dist => {
        const distributedAmount = parseFloat(dist.distributedAmount) || 0
        const partnerAmount = parseFloat(dist.partnerAmount) || 0
        const totalDistributed = distributedAmount + partnerAmount
        const remainingAmount = dist.availableProfit + dist.partnerProfit - totalDistributed

        return [
          dist.investorId,
          `"${dist.investorName}"`,
          dist.availableProfit,
          distributedAmount,
          dist.partnerProfit,
          partnerAmount,
          totalDistributed,
          remainingAmount
        ].join(',')
      })
    ]

    return csvRows.join('\n')
  }

  /**
   * حساب الإحصائيات الإجمالية
   */
  private static calculateTotalStats(distributions: ProfitDistribution[]) {
    const totalAvailableProfit = distributions.reduce((sum, dist) => sum + dist.availableProfit, 0)
    const totalDistributedAmount = distributions.reduce((sum, dist) => sum + (parseFloat(dist.distributedAmount) || 0), 0)
    const totalPartnerProfit = distributions.reduce((sum, dist) => sum + dist.partnerProfit, 0)
    const totalPartnerAmount = distributions.reduce((sum, dist) => sum + (parseFloat(dist.partnerAmount) || 0), 0)
    const totalDistributed = totalDistributedAmount + totalPartnerAmount
    const totalAvailable = totalAvailableProfit + totalPartnerProfit
    const totalRemaining = totalAvailable - totalDistributed

    return {
      totalAvailableProfit,
      totalDistributedAmount,
      totalPartnerProfit,
      totalPartnerAmount,
      totalDistributed,
      totalAvailable,
      totalRemaining,
      distributionPercentage: totalAvailable > 0 ? Math.round((totalDistributed / totalAvailable) * 10000) / 100 : 0
    }
  }

  /**
   * إنشاء تقرير مفصل
   */
  static generateDetailedReport(distributions: ProfitDistribution[]): string {
    const stats = this.calculateTotalStats(distributions)
    const exportDate = new Date().toLocaleString('ar-SA')

    let report = `تقرير توزيعات الأرباح\n`
    report += `تاريخ التقرير: ${exportDate}\n`
    report += `عدد المستثمرين: ${distributions.length}\n\n`

    report += `الإحصائيات الإجمالية:\n`
    report += `إجمالي الأرباح المتاحة: ${stats.totalAvailableProfit.toLocaleString()} د.ك\n`
    report += `إجمالي المبلغ الموزع: ${stats.totalDistributedAmount.toLocaleString()} د.ك\n`
    report += `إجمالي نصيب الشركاء: ${stats.totalPartnerProfit.toLocaleString()} د.ك\n`
    report += `إجمالي مبلغ الشركاء: ${stats.totalPartnerAmount.toLocaleString()} د.ك\n`
    report += `نسبة التوزيع: ${stats.distributionPercentage}%\n\n`

    report += `تفاصيل التوزيع:\n`
    report += `${'='.repeat(80)}\n`

    distributions.forEach((dist, index) => {
      const distributedAmount = parseFloat(dist.distributedAmount) || 0
      const partnerAmount = parseFloat(dist.partnerAmount) || 0
      
      report += `${index + 1}. ${dist.investorName}\n`
      report += `   الربح المتاح: ${dist.availableProfit.toLocaleString()} د.ك\n`
      report += `   المبلغ الموزع: ${distributedAmount.toLocaleString()} د.ك\n`
      report += `   نصيب الشريك: ${dist.partnerProfit.toLocaleString()} د.ك\n`
      report += `   مبلغ الشريك: ${partnerAmount.toLocaleString()} د.ك\n`
      report += `   ${'-'.repeat(40)}\n`
    })

    return report
  }
}
