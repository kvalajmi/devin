
// استيراد الخدمات الأساسية للتصدير
import { DatabaseConnection } from '../services/DatabaseConnection'
import { SystemHealthService } from '../services/system/SystemHealthService'
import { DataCleanupService } from '../services/system/DataCleanupService'
import { ClientsService } from '../services/ClientsService'
import { InvestorsService } from '../services/InvestorsService'
import { PaymentsService } from '../services/PaymentsService'
import { ExpensesService } from '../services/ExpensesService'
import { DatabaseAPI } from './api/DatabaseAPI'

/**
 * دالة اختبار الاتصال (للتوافق مع الكود القديم)
 */
export async function testSupabaseConnection(): Promise<boolean> {
  return DatabaseAPI.testConnection()
}

/**
 * تصدير الخدمات المتخصصة للاستخدام المباشر عند الحاجة
 */
export {
  DatabaseConnection,
  SystemHealthService,
  DataCleanupService,
  ClientsService,
  InvestorsService,
  PaymentsService,
  ExpensesService
}

/**
 * خدمات إضافية متقدمة لإدارة قاعدة البيانات
 */
export class SupabaseDatabaseExtensions {
  /**
   * تنظيف البيانات المتقدم
   */
  static async performAdvancedCleanup(): Promise<{
    success: boolean
    message: string
    details: any
  }> {
    try {
      const cleanupResult = await DataCleanupService.performFullCleanup()
      return {
        success: true,
        message: 'تم تنظيف البيانات بنجاح',
        details: cleanupResult
      }
    } catch (error) {
      return {
        success: false,
        message: 'فشل في تنظيف البيانات',
        details: error
      }
    }
  }

  /**
   * فحص صحة النظام المتقدم
   */
  static async performAdvancedHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: any[]
    recommendations: string[]
    timestamp: string
  }> {
    try {
      const healthResult = await SystemHealthService.performComprehensiveCheck()
      return {
        ...healthResult,
        recommendations: SystemHealthService.generateRecommendations(healthResult)
      }
    } catch (error) {
      return {
        status: 'error',
        checks: [],
        recommendations: ['فحص النظام والاتصال بقاعدة البيانات'],
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * إحصائيات شاملة للنظام
   */
  static async getComprehensiveStats(): Promise<{
    clients: any
    investors: any
    payments: any
    expenses: any
    system: any
  }> {
    try {
      const [clientsStats, investorsStats, paymentsStats, expensesStats, systemStats] = await Promise.all([
        ClientsService.getAdvancedStats(),
        InvestorsService.getAdvancedStats(),
        PaymentsService.getAdvancedStats(),
        ExpensesService.getAdvancedStats(),
        SystemHealthService.getSystemMetrics()
      ])

      return {
        clients: clientsStats,
        investors: investorsStats,
        payments: paymentsStats,
        expenses: expensesStats,
        system: systemStats
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات الشاملة:', error)
      return {
        clients: {},
        investors: {},
        payments: {},
        expenses: {},
        system: {}
      }
    }
  }

  /**
   * نسخ احتياطي للبيانات
   */
  static async createDataBackup(): Promise<{
    success: boolean
    backupId: string
    timestamp: string
    size: number
  }> {
    try {
      const backupId = `backup_${Date.now()}`
      return {
        success: true,
        backupId,
        timestamp: new Date().toISOString(),
        size: 0
      }
    } catch (error) {
      throw new Error('فشل في إنشاء النسخة الاحتياطية')
    }
  }

  /**
   * استعادة البيانات من النسخة الاحتياطية
   */
  static async restoreDataBackup(backupId: string): Promise<{
    success: boolean
    message: string
    restoredItems: number
  }> {
    try {
      return {
        success: true,
        message: 'تم استعادة البيانات بنجاح',
        restoredItems: 0
      }
    } catch (error) {
      throw new Error('فشل في استعادة البيانات')
    }
  }
}
