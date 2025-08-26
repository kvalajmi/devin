import { ExpensesService } from '../../services/ExpensesService'

/**
 * واجهة برمجة التطبيقات لإدارة المصروفات
 */
export class ExpensesAPI {
  // ===== عمليات المصروفات =====
  static async getTransactionExpenses(clientId?: number): Promise<any[]> {
    return ExpensesService.getTransactionExpenses(clientId)
  }

  static async addTransactionExpense(expense: any): Promise<number | null> {
    return ExpensesService.addTransactionExpense(expense)
  }

  static async updateTransactionExpense(expenseId: number, updates: any): Promise<boolean> {
    return ExpensesService.updateTransactionExpense(expenseId, updates)
  }

  static async deleteTransactionExpense(expenseId: number): Promise<boolean> {
    return ExpensesService.deleteTransactionExpense(expenseId)
  }

  static async deleteAllExpenses(): Promise<boolean> {
    return ExpensesService.deleteAllExpenses()
  }

  // ===== عمليات أتعاب المحامي =====
  static async getLawyerFees(clientId?: number): Promise<any[]> {
    return ExpensesService.getLawyerFees(clientId)
  }

  static async addLawyerFee(fee: any): Promise<number | null> {
    return ExpensesService.addLawyerFee(fee)
  }

  static async updateLawyerFee(feeId: number, updates: any): Promise<boolean> {
    return ExpensesService.updateLawyerFee(feeId, updates)
  }

  static async deleteLawyerFee(feeId: number): Promise<boolean> {
    return ExpensesService.deleteLawyerFee(feeId)
  }

  // ===== إحصائيات المصروفات =====
  static async getExpensesStats(clientId?: number): Promise<any> {
    return ExpensesService.getExpensesStats(clientId)
  }

  static async searchExpenses(searchTerm: string): Promise<{ expenses: any[], fees: any[] }> {
    return ExpensesService.searchExpenses(searchTerm)
  }

  static async getAdvancedExpensesStats(clientId?: number): Promise<any> {
    return ExpensesService.getAdvancedExpensesStats(clientId)
  }
}
