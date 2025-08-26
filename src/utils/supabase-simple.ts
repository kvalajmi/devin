// واجهة موحدة لجميع خدمات قاعدة البيانات - محسّنة حسب القاعدة الذهبية
// تم تقسيم الملف إلى واجهات متخصصة منفصلة للحصول على أفضل تنظيم

// استيراد الواجهات المقسمة
import { DatabaseAPI } from './api/DatabaseAPI'
import { ClientsAPI } from './api/ClientsAPI'
import { InvestorsAPI } from './api/InvestorsAPI'
import { PaymentsAPI } from './api/PaymentsAPI'
import { ExpensesAPI } from './api/ExpensesAPI'
import { SystemAPI } from './api/SystemAPI'

// استيراد الخدمات الأساسية للتصدير
import { DatabaseConnection } from '../services/DatabaseConnection'
import { SystemHealthService } from '../services/system/SystemHealthService'
import { DataCleanupService } from '../services/system/DataCleanupService'
import { ClientsService } from '../services/ClientsService'
import { InvestorsService } from '../services/InvestorsService'
import { PaymentsService } from '../services/PaymentsService'
import { ExpensesService } from '../services/ExpensesService'

/**
 * فئة موحدة لإدارة قاعدة البيانات المحسّنة
 * تعمل كواجهة للواجهات المتخصصة المنفصلة
 * تم تحسينها لتوفير أداء أفضل وقابلية صيانة محسّنة
 */
export class SupabaseDatabase {
  // ===== إدارة الاتصال =====
  static getClient() {
    return DatabaseAPI.getClient()
  }

  static async testConnection(): Promise<boolean> {
    return DatabaseAPI.testConnection()
  }

  // ===== عمليات العملاء =====
  static async getClients(): Promise<any[]> {
    return ClientsAPI.getClients()
  }

  static async addClient(client: any): Promise<number | null> {
    return ClientsAPI.addClient(client)
  }

  static async updateClient(clientId: number, updates: any): Promise<boolean> {
    return ClientsAPI.updateClient(clientId, updates)
  }

  static async deleteClient(clientId: number): Promise<boolean> {
    return ClientsAPI.deleteClient(clientId)
  }

  static async searchClients(searchTerm: string): Promise<any[]> {
    return ClientsAPI.searchClients(searchTerm)
  }

  static async getClientById(clientId: number): Promise<any | null> {
    return ClientsAPI.getClientById(clientId)
  }

  static convertSupabaseToClient(supabaseClient: any): any {
    return ClientsAPI.convertSupabaseToClient(supabaseClient)
  }

  static async advancedSearchClients(filters: any): Promise<any[]> {
    return ClientsAPI.advancedSearchClients(filters)
  }

  // ===== عمليات المستثمرين =====
  static async getInvestors(): Promise<any[]> {
    return InvestorsAPI.getInvestors()
  }

  static async addInvestor(investor: any): Promise<number | null> {
    return InvestorsAPI.addInvestor(investor)
  }

  static async updateInvestor(investorId: number, updates: any): Promise<boolean> {
    return InvestorsAPI.updateInvestor(investorId, updates)
  }

  static async deleteInvestor(investorId: number): Promise<boolean> {
    return InvestorsAPI.deleteInvestor(investorId)
  }

  static async getInvestorById(investorId: number): Promise<any | null> {
    return InvestorsAPI.getInvestorById(investorId)
  }

  static async searchInvestors(searchTerm: string): Promise<any[]> {
    return InvestorsAPI.searchInvestors(searchTerm)
  }

  // ===== عمليات التمويل والسحوبات =====
  static async addFundingRecord(record: any): Promise<number | null> {
    return InvestorsAPI.addFundingRecord(record)
  }

  static async getFundingRecords(investorId?: number): Promise<any[]> {
    return InvestorsAPI.getFundingRecords(investorId)
  }

  static async addWithdrawalRecord(record: any): Promise<number | null> {
    return InvestorsAPI.addWithdrawalRecord(record)
  }

  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    return InvestorsAPI.getWithdrawalRecords(investorId)
  }

  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    return InvestorsAPI.addPartnerWithdrawalRecord(record)
  }

  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    return InvestorsAPI.getPartnerWithdrawalRecords(investorId)
  }

  static async getAvailableBalance(investorId: number): Promise<number> {
    return InvestorsAPI.getAvailableBalance(investorId)
  }

  // ===== عمليات المدفوعات =====
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

  // ===== عمليات المصروفات =====
  static async getTransactionExpenses(clientId?: number): Promise<any[]> {
    return ExpensesAPI.getTransactionExpenses(clientId)
  }

  static async addTransactionExpense(expense: any): Promise<number | null> {
    return ExpensesAPI.addTransactionExpense(expense)
  }

  static async updateTransactionExpense(expenseId: number, updates: any): Promise<boolean> {
    return ExpensesAPI.updateTransactionExpense(expenseId, updates)
  }

  static async deleteTransactionExpense(expenseId: number): Promise<boolean> {
    return ExpensesAPI.deleteTransactionExpense(expenseId)
  }

  // ===== عمليات أتعاب المحامي =====
  static async getLawyerFees(clientId?: number): Promise<any[]> {
    return ExpensesAPI.getLawyerFees(clientId)
  }

  static async addLawyerFee(fee: any): Promise<number | null> {
    return ExpensesAPI.addLawyerFee(fee)
  }

  static async updateLawyerFee(feeId: number, updates: any): Promise<boolean> {
    return ExpensesAPI.updateLawyerFee(feeId, updates)
  }

  static async deleteLawyerFee(feeId: number): Promise<boolean> {
    return ExpensesAPI.deleteLawyerFee(feeId)
  }

  // ===== إحصائيات المصروفات =====
  static async getExpensesStats(clientId?: number): Promise<any> {
    return ExpensesAPI.getExpensesStats(clientId)
  }

  static async searchExpenses(searchTerm: string): Promise<{ expenses: any[], fees: any[] }> {
    return ExpensesAPI.searchExpenses(searchTerm)
  }

  static async getAdvancedExpensesStats(clientId?: number): Promise<any> {
    return ExpensesAPI.getAdvancedExpensesStats(clientId)
  }

  // ===== عمليات النظام =====
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

// دالة اختبار الاتصال (للتوافق مع الكود القديم)
export async function testSupabaseConnection(): Promise<boolean> {
  return DatabaseAPI.testConnection()
}

// تصدير الخدمات المتخصصة للاستخدام المباشر عند الحاجة
export {
  DatabaseConnection,
  SystemHealthService,
  DataCleanupService,
  ClientsService,
  InvestorsService,
  PaymentsService,
  ExpensesService
}