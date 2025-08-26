import { PaymentsAPI } from './api/PaymentsAPI'

/**
 * خدمة قاعدة البيانات للمدفوعات
 * تم فصلها حسب القاعدة الذهبية
 */
export class SupabaseDatabasePayments {
  static async getPayments(clientId?: number): Promise<any[]> {
    return PaymentsAPI.getPayments(clientId)
  }

  static async addPaymentRecord(record: any): Promise<number | null> {
    return PaymentsAPI.addPaymentRecord(record)
  }

  static async updatePaymentRecord(paymentId: number, updates: any): Promise<boolean> {
    return PaymentsAPI.updatePaymentRecord(paymentId, updates)
  }

  static async deletePaymentRecord(paymentId: number): Promise<boolean> {
    return PaymentsAPI.deletePaymentRecord(paymentId)
  }

  static async getTotalPayments(clientId: number): Promise<number> {
    return PaymentsAPI.getTotalPayments(clientId)
  }

  static async getPaymentsByDateRange(startDate: string, endDate: string, clientId?: number): Promise<any[]> {
    return PaymentsAPI.getPaymentsByDateRange(startDate, endDate, clientId)
  }

  static async searchPayments(searchTerm: string): Promise<any[]> {
    return PaymentsAPI.searchPayments(searchTerm)
  }

  static async getPaymentStats(): Promise<any> {
    return PaymentsAPI.getPaymentStats()
  }

  static async getAdvancedPaymentStats(clientId?: number): Promise<any> {
    return PaymentsAPI.getAdvancedPaymentStats(clientId)
  }

  static async getRecentPayments(limit: number = 10, clientId?: number): Promise<any[]> {
    return PaymentsAPI.getRecentPayments(limit, clientId)
  }
}
