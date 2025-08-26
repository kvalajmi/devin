// واجهة موحدة لجميع خدمات قاعدة البيانات - محسّنة حسب القاعدة الذهبية
// تم تقسيم الملف إلى واجهات متخصصة منفصلة للحصول على أفضل تنظيم

// استيراد الواجهات المقسمة
import { DatabaseAPI } from './api/DatabaseAPI'

import { SupabaseDatabaseClients } from './supabase-clients'
import { SupabaseDatabaseInvestors } from './supabase-investors'
import { SupabaseDatabasePayments } from './supabase-payments'
import { SupabaseDatabaseExpenses } from './supabase-expenses'
import { SupabaseDatabaseSystem } from './supabase-system'

/**
 * فئة موحدة لإدارة قاعدة البيانات المحسّنة - واجهة موحدة
 * تم تقسيمها حسب القاعدة الذهبية (200 سطر كحد أقصى)
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
    return SupabaseDatabaseClients.getClients()
  }

  static async addClient(client: any): Promise<number | null> {
    return SupabaseDatabaseClients.addClient(client)
  }

  static async updateClient(clientId: number, updates: any): Promise<boolean> {
    return SupabaseDatabaseClients.updateClient(clientId, updates)
  }

  static async deleteClient(clientId: number): Promise<boolean> {
    return SupabaseDatabaseClients.deleteClient(clientId)
  }

  static async searchClients(searchTerm: string): Promise<any[]> {
    return SupabaseDatabaseClients.searchClients(searchTerm)
  }

  static async getClientById(clientId: number): Promise<any | null> {
    return SupabaseDatabaseClients.getClientById(clientId)
  }

  static convertSupabaseToClient(supabaseClient: any): any {
    return SupabaseDatabaseClients.convertSupabaseToClient(supabaseClient)
  }

  static async advancedSearchClients(filters: any): Promise<any[]> {
    return SupabaseDatabaseClients.advancedSearchClients(filters)
  }

  // ===== عمليات المستثمرين =====
  static async getInvestors(): Promise<any[]> {
    return SupabaseDatabaseInvestors.getInvestors()
  }

  static async addInvestor(investor: any): Promise<number | null> {
    return SupabaseDatabaseInvestors.addInvestor(investor)
  }

  static async updateInvestor(investorId: number, updates: any): Promise<boolean> {
    return SupabaseDatabaseInvestors.updateInvestor(investorId, updates)
  }

  static async deleteInvestor(investorId: number): Promise<boolean> {
    return SupabaseDatabaseInvestors.deleteInvestor(investorId)
  }

  static async getInvestorById(investorId: number): Promise<any | null> {
    return SupabaseDatabaseInvestors.getInvestorById(investorId)
  }

  static async searchInvestors(searchTerm: string): Promise<any[]> {
    return SupabaseDatabaseInvestors.searchInvestors(searchTerm)
  }

  // ===== عمليات التمويل والسحوبات =====
  static async addFundingRecord(record: any): Promise<number | null> {
    return SupabaseDatabaseInvestors.addFundingRecord(record)
  }

  static async getFundingRecords(investorId?: number): Promise<any[]> {
    return SupabaseDatabaseInvestors.getFundingRecords(investorId)
  }

  static async addWithdrawalRecord(record: any): Promise<number | null> {
    return SupabaseDatabaseInvestors.addWithdrawalRecord(record)
  }

  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    return SupabaseDatabaseInvestors.getWithdrawalRecords(investorId)
  }

  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    return SupabaseDatabaseInvestors.addPartnerWithdrawalRecord(record)
  }

  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    return SupabaseDatabaseInvestors.getPartnerWithdrawalRecords(investorId)
  }

  static async getAvailableBalance(investorId: number): Promise<number> {
    return SupabaseDatabaseInvestors.getAvailableBalance(investorId)
  }

  // ===== عمليات المدفوعات =====
  static async getPayments(clientId?: number): Promise<any[]> {
    return SupabaseDatabasePayments.getPayments(clientId)
  }

  static async addPaymentRecord(record: any): Promise<number | null> {
    return SupabaseDatabasePayments.addPaymentRecord(record)
  }

  static async updatePaymentRecord(paymentId: number, updates: any): Promise<boolean> {
    return SupabaseDatabasePayments.updatePaymentRecord(paymentId, updates)
  }

  static async deletePaymentRecord(paymentId: number): Promise<boolean> {
    return SupabaseDatabasePayments.deletePaymentRecord(paymentId)
  }

  static async getTotalPayments(clientId: number): Promise<number> {
    return SupabaseDatabasePayments.getTotalPayments(clientId)
  }

  static async getPaymentsByDateRange(startDate: string, endDate: string, clientId?: number): Promise<any[]> {
    return SupabaseDatabasePayments.getPaymentsByDateRange(startDate, endDate, clientId)
  }

  static async searchPayments(searchTerm: string): Promise<any[]> {
    return SupabaseDatabasePayments.searchPayments(searchTerm)
  }

  static async getPaymentStats(): Promise<any> {
    return SupabaseDatabasePayments.getPaymentStats()
  }

  static async getAdvancedPaymentStats(clientId?: number): Promise<any> {
    return SupabaseDatabasePayments.getAdvancedPaymentStats(clientId)
  }

  static async getRecentPayments(limit: number = 10, clientId?: number): Promise<any[]> {
    return SupabaseDatabasePayments.getRecentPayments(limit, clientId)
  }

  // ===== عمليات المصروفات =====
  static async getTransactionExpenses(clientId?: number): Promise<any[]> {
    return SupabaseDatabaseExpenses.getTransactionExpenses(clientId)
  }

  static async addTransactionExpense(expense: any): Promise<number | null> {
    return SupabaseDatabaseExpenses.addTransactionExpense(expense)
  }

  static async updateTransactionExpense(expenseId: number, updates: any): Promise<boolean> {
    return SupabaseDatabaseExpenses.updateTransactionExpense(expenseId, updates)
  }

  static async deleteTransactionExpense(expenseId: number): Promise<boolean> {
    return SupabaseDatabaseExpenses.deleteTransactionExpense(expenseId)
  }

  // ===== عمليات أتعاب المحامي =====
  static async getLawyerFees(clientId?: number): Promise<any[]> {
    return SupabaseDatabaseExpenses.getLawyerFees(clientId)
  }

  static async addLawyerFee(fee: any): Promise<number | null> {
    return SupabaseDatabaseExpenses.addLawyerFee(fee)
  }

  static async updateLawyerFee(feeId: number, updates: any): Promise<boolean> {
    return SupabaseDatabaseExpenses.updateLawyerFee(feeId, updates)
  }

  static async deleteLawyerFee(feeId: number): Promise<boolean> {
    return SupabaseDatabaseExpenses.deleteLawyerFee(feeId)
  }

  // ===== إحصائيات المصروفات =====
  static async getExpensesStats(clientId?: number): Promise<any> {
    return SupabaseDatabaseExpenses.getExpensesStats(clientId)
  }

  static async searchExpenses(searchTerm: string): Promise<{ expenses: any[], fees: any[] }> {
    return SupabaseDatabaseExpenses.searchExpenses(searchTerm)
  }

  static async getAdvancedExpensesStats(clientId?: number): Promise<any> {
    return SupabaseDatabaseExpenses.getAdvancedExpensesStats(clientId)
  }

  // ===== عمليات النظام =====
  static async deleteAllClients(): Promise<boolean> {
    return SupabaseDatabaseSystem.deleteAllClients()
  }

  static async deleteAllInvestors(): Promise<boolean> {
    return SupabaseDatabaseSystem.deleteAllInvestors()
  }

  static async deleteAllPayments(): Promise<boolean> {
    return SupabaseDatabaseSystem.deleteAllPayments()
  }

  static async deleteAllExpenses(): Promise<boolean> {
    return SupabaseDatabaseSystem.deleteAllExpenses()
  }

  static async deleteAllData(): Promise<boolean> {
    return SupabaseDatabaseSystem.deleteAllData()
  }

  static async getSystemStats(): Promise<any> {
    return SupabaseDatabaseSystem.getSystemStats()
  }

  static async performHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error'
    checks: any[]
    timestamp: string
  }> {
    return SupabaseDatabaseSystem.performHealthCheck()
  }
}

// دالة اختبار الاتصال (للتوافق مع الكود القديم)
export async function testSupabaseConnection(): Promise<boolean> {
  return DatabaseAPI.testConnection()
}
