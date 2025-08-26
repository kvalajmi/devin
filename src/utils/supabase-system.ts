import { SystemAPI } from './api/SystemAPI'

/**
 * خدمة قاعدة البيانات للنظام
 * تم فصلها حسب القاعدة الذهبية
 */
export class SupabaseDatabaseSystem {
  static async deleteAllClients(): Promise<boolean> {
    return SystemAPI.deleteAllClients()
  }

  static async deleteAllInvestors(): Promise<boolean> {
    return SystemAPI.deleteAllInvestors()
  }

  static async deleteAllPayments(): Promise<boolean> {
    return SystemAPI.deleteAllPayments()
  }

  static async deleteAllExpenses(): Promise<boolean> {
    return SystemAPI.deleteAllExpenses()
  }

  static async deleteAllData(): Promise<boolean> {
    return SystemAPI.deleteAllData()
  }

  static async getSystemStats(): Promise<any> {
    return SystemAPI.getSystemStats()
  }

  static async performHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: any[]
    timestamp: string
  }> {
    return SystemAPI.performHealthCheck()
  }
}
