import { DatabaseConnection } from '../DatabaseConnection'
import { ClientsService } from '../ClientsService'
import { InvestorsService } from '../InvestorsService'
import { PaymentsService } from '../PaymentsService'
import { ExpensesService } from '../ExpensesService'

/**
 * خدمة متخصصة لفحص صحة النظام وإحصائيات النظام
 * مسؤولية واحدة: صحة النظام والإحصائيات فقط
 */
export class SystemHealthService {
  /**
   * إحصائيات شاملة للنظام
   */
  static async getSystemStats(): Promise<any> {
    try {
      const [clientsStats, investorsStats, paymentsStats, expensesStats] = await Promise.all([
        ClientsService.getClients().then(clients => ({ count: clients.length, data: clients })),
        InvestorsService.getInvestors().then(investors => ({ count: investors.length, data: investors })),
        PaymentsService.getPaymentStats(),
        ExpensesService.getExpensesStats()
      ])

      return {
        clients: clientsStats,
        investors: investorsStats,
        payments: paymentsStats,
        expenses: expensesStats,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ خطأ في getSystemStats:', error)
      return null
    }
  }

  /**
   * فحص صحة النظام
   */
  static async performHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: any[]
    timestamp: string
  }> {
    const checks = []
    let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy'

    try {
      // فحص الاتصال
      const connectionTest = await DatabaseConnection.testConnection()
      checks.push({
        name: 'Database Connection',
        status: connectionTest ? 'pass' : 'fail',
        message: connectionTest ? 'الاتصال بقاعدة البيانات يعمل بشكل طبيعي' : 'فشل في الاتصال بقاعدة البيانات'
      })

      if (!connectionTest) {
        overallStatus = 'error'
      }

      // فحص البيانات الأساسية
      const [clients, investors] = await Promise.all([
        ClientsService.getClients().catch(() => []),
        InvestorsService.getInvestors().catch(() => [])
      ])

      checks.push({
        name: 'Data Availability',
        status: clients.length > 0 || investors.length > 0 ? 'pass' : 'warning',
        message: `تم العثور على ${clients.length} عميل و ${investors.length} مستثمر`,
        details: { clients: clients.length, investors: investors.length }
      })

      if (clients.length === 0 && investors.length === 0 && overallStatus === 'healthy') {
        overallStatus = 'warning'
      }

      // فحص الأداء
      const startTime = performance.now()
      await ClientsService.getClients()
      const endTime = performance.now()
      const responseTime = endTime - startTime

      checks.push({
        name: 'Performance',
        status: responseTime < 1000 ? 'pass' : responseTime < 3000 ? 'warning' : 'fail',
        message: `زمن الاستجابة: ${responseTime.toFixed(2)}ms`,
        details: { responseTime: responseTime.toFixed(2) }
      })

      if (responseTime > 3000) {
        overallStatus = overallStatus === 'healthy' ? 'warning' : overallStatus
      }

    } catch (error) {
      checks.push({
        name: 'System Check',
        status: 'fail',
        message: 'حدث خطأ أثناء فحص النظام',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      })
      overallStatus = 'error'
    }

    return {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * فحص صحة البيانات
   */
  static async performDataIntegrityCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    issues: any[]
    timestamp: string
  }> {
    const issues = []
    let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy'

    try {
      // فحص تكامل البيانات
      const clients = await ClientsService.getClients()
      const payments = await PaymentsService.getPayments()

      // فحص العملاء بدون دفعات
      const clientsWithoutPayments = clients.filter(client => 
        !payments.some(payment => payment.client_id === client.id)
      )

      if (clientsWithoutPayments.length > 0) {
        issues.push({
          type: 'warning',
          message: `${clientsWithoutPayments.length} عميل بدون دفعات`,
          details: clientsWithoutPayments.map(c => ({ id: c.id, name: c.name }))
        })
        overallStatus = overallStatus === 'healthy' ? 'warning' : overallStatus
      }

      // فحص البيانات المفقودة
      const clientsWithMissingData = clients.filter(client => 
        !client.civil_id || !client.phone_number || !client.name
      )

      if (clientsWithMissingData.length > 0) {
        issues.push({
          type: 'warning',
          message: `${clientsWithMissingData.length} عميل ببيانات ناقصة`,
          details: clientsWithMissingData.map(c => ({ id: c.id, name: c.name, missing: [] }))
        })
        overallStatus = overallStatus === 'healthy' ? 'warning' : overallStatus
      }

    } catch (error) {
      issues.push({
        type: 'error',
        message: 'فشل في فحص تكامل البيانات',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      })
      overallStatus = 'error'
    }

    return {
      status: overallStatus,
      issues,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * تقرير صحة النظام
   */
  static async generateHealthReport(): Promise<any> {
    const [healthCheck, dataIntegrity, systemStats] = await Promise.all([
      this.performHealthCheck(),
      this.performDataIntegrityCheck(),
      this.getSystemStats()
    ])

    return {
      timestamp: new Date().toISOString(),
      overallStatus: healthCheck.status === 'error' || dataIntegrity.status === 'error' ? 'error' : 
                    healthCheck.status === 'warning' || dataIntegrity.status === 'warning' ? 'warning' : 'healthy',
      healthCheck,
      dataIntegrity,
      systemStats,
      recommendations: this.generateRecommendations(healthCheck, dataIntegrity)
    }
  }

  /**
   * توليد التوصيات بناءً على نتائج الفحص
   */
  private static generateRecommendations(healthCheck: any, dataIntegrity: any): string[] {
    const recommendations = []

    if (healthCheck.status === 'error') {
      recommendations.push('🔴 فحص الاتصال بقاعدة البيانات وإصلاح المشاكل')
    }

    if (dataIntegrity.status === 'warning') {
      recommendations.push('🟡 مراجعة البيانات الناقصة وإكمالها')
    }

    if (healthCheck.checks.some((check: any) => check.name === 'Performance' && check.status === 'fail')) {
      recommendations.push('🔴 تحسين أداء قاعدة البيانات')
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ النظام يعمل بشكل طبيعي')
    }

    return recommendations
  }
}
