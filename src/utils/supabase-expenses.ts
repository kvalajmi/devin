import { ExpensesAPI } from './api/ExpensesAPI'

/**
 * خدمة قاعدة البيانات للمصروفات
 * تم فصلها حسب القاعدة الذهبية
 */
export class SupabaseDatabaseExpenses {
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

  static async getExpensesStats(clientId?: number): Promise<any> {
    return ExpensesAPI.getExpensesStats(clientId)
  }

  static async searchExpenses(searchTerm: string): Promise<{ expenses: any[], fees: any[] }> {
    return ExpensesAPI.searchExpenses(searchTerm)
  }

  static async getAdvancedExpensesStats(clientId?: number): Promise<any> {
    return ExpensesAPI.getAdvancedExpensesStats(clientId)
  }
}
