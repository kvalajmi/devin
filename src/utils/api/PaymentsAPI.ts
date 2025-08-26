import { PaymentsService } from '../../services/PaymentsService'

/**
 * واجهة برمجة التطبيقات لإدارة المدفوعات
 */
export class PaymentsAPI {
  // ===== العمليات الأساسية =====
  static async getPayments(clientId?: number): Promise<any[]> {
    return PaymentsService.getPayments(clientId)
  }

  static async addPaymentRecord(record: any): Promise<number | null> {
    return PaymentsService.addPaymentRecord(record)
  }

  static async updatePaymentRecord(paymentId: number, updates: any): Promise<boolean> {
    return PaymentsService.updatePaymentRecord(paymentId, updates)
  }

  static async deletePaymentRecord(paymentId: number): Promise<boolean> {
    return PaymentsService.deletePaymentRecord(paymentId)
  }

  static async deleteAllPayments(): Promise<boolean> {
    return PaymentsService.deleteAllPayments()
  }

  // ===== العمليات المتقدمة =====
  static async getTotalPayments(clientId: number): Promise<number> {
    return PaymentsService.getTotalPayments(clientId)
  }

  static async getPaymentsByDateRange(startDate: string, endDate: string, clientId?: number): Promise<any[]> {
    return PaymentsService.getPaymentsByDateRange(startDate, endDate, clientId)
  }

  static async searchPayments(searchTerm: string): Promise<any[]> {
    return PaymentsService.searchPayments(searchTerm)
  }

  static async getPaymentStats(): Promise<any> {
    return PaymentsService.getPaymentStats()
  }

  static async getAdvancedPaymentStats(clientId?: number): Promise<any> {
    return PaymentsService.getAdvancedPaymentStats(clientId)
  }

  static async getRecentPayments(limit: number = 10, clientId?: number): Promise<any[]> {
    return PaymentsService.getRecentPayments(limit, clientId)
  }
}
