// خدمة إدارة المدفوعات الموحدة - تم إعادة تنظيمها حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى خدمات متخصصة منفصلة

import { PaymentOperationsService } from './payments/PaymentOperationsService'
import { PaymentCalculationsService } from './payments/PaymentCalculationsService'
import { PaymentQueryService } from './payments/PaymentQueryService'

/**
 * خدمة إدارة المدفوعات - واجهة موحدة
 * تعمل كواجهة للخدمات المتخصصة المنفصلة
 */
export class PaymentsService {
  // ===== العمليات الأساسية =====
  static async getPayments(clientId?: number): Promise<any[]> {
    return PaymentOperationsService.getPayments(clientId)
  }

  static async addPaymentRecord(record: any): Promise<number | null> {
    return PaymentOperationsService.addPaymentRecord(record)
  }

  static async updatePaymentRecord(paymentId: number, updates: any): Promise<boolean> {
    return PaymentOperationsService.updatePaymentRecord(paymentId, updates)
  }

  static async deletePaymentRecord(paymentId: number): Promise<boolean> {
    return PaymentOperationsService.deletePaymentRecord(paymentId)
  }

  static async deleteAllPayments(): Promise<boolean> {
    return PaymentOperationsService.deleteAllPayments()
  }

  // ===== الحسابات والإحصائيات =====
  static async getTotalPayments(clientId: number): Promise<number> {
    return PaymentCalculationsService.getTotalPayments(clientId)
  }

  static async getPaymentStats(): Promise<any> {
    return PaymentCalculationsService.getPaymentStats()
  }

  static async getAdvancedPaymentStats(clientId?: number): Promise<any> {
    return PaymentCalculationsService.getAdvancedPaymentStats(clientId)
  }

  // ===== البحث والاستعلامات =====
  static async getPaymentsByDateRange(startDate: string, endDate: string, clientId?: number): Promise<any[]> {
    return PaymentQueryService.getPaymentsByDateRange(startDate, endDate, clientId)
  }

  static async searchPayments(searchTerm: string): Promise<any[]> {
    return PaymentQueryService.searchPayments(searchTerm)
  }

  static async advancedSearchPayments(filters: {
    searchTerm?: string
    clientId?: number
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
  }): Promise<any[]> {
    return PaymentQueryService.advancedSearchPayments(filters)
  }

  static async getRecentPayments(limit: number = 10, clientId?: number): Promise<any[]> {
    return PaymentQueryService.getRecentPayments(limit, clientId)
  }

  static async getPaymentsByAmount(orderBy: 'highest' | 'lowest' = 'highest', limit: number = 10): Promise<any[]> {
    return PaymentQueryService.getPaymentsByAmount(orderBy, limit)
  }
}

// تصدير الخدمات المتخصصة للاستخدام المباشر عند الحاجة
export { PaymentOperationsService, PaymentCalculationsService, PaymentQueryService }