import { SystemHealthService } from '../../services/system/SystemHealthService'
import { DataCleanupService } from '../../services/system/DataCleanupService'

/**
 * واجهة برمجة التطبيقات لإدارة النظام
 */
export class SystemAPI {
  // ===== عمليات الحذف الشامل (للمطورين فقط) =====
  static async deleteAllClients(): Promise<boolean> {
    return DataCleanupService.deleteAllClients()
  }

  static async deleteAllInvestors(): Promise<boolean> {
    return DataCleanupService.deleteAllInvestors()
  }

  static async deleteAllPayments(): Promise<boolean> {
    return DataCleanupService.deleteAllPayments()
  }

  static async deleteAllExpenses(): Promise<boolean> {
    return DataCleanupService.deleteAllExpenses()
  }

  /**
   * حذف جميع البيانات (للمطورين فقط) - محسّن
   */
  static async deleteAllData(): Promise<boolean> {
    return DataCleanupService.deleteAllData()
  }

  // ===== وظائف مساعدة جديدة =====
  
  /**
   * إحصائيات شاملة للنظام
   */
  static async getSystemStats(): Promise<any> {
    return SystemHealthService.getSystemStats()
  }

  /**
   * فحص صحة النظام
   */
  static async performHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: any[]
    timestamp: string
  }> {
    return SystemHealthService.performHealthCheck()
  }
}
