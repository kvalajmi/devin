// خدمة إدارة المصروفات الموحدة - تم إعادة تنظيمها حسب القاعدة الذهبية
// تم تقسيم الملف الأصلي إلى خدمات متخصصة منفصلة

import { TransactionExpensesService } from './expenses/TransactionExpensesService'
import { LawyerFeesService } from './expenses/LawyerFeesService'
import { ExpensesStatsService } from './expenses/ExpensesStatsService'

/**
 * خدمة إدارة المصروفات وأتعاب المحامي - واجهة موحدة
 * تعمل كواجهة للخدمات المتخصصة المنفصلة
 */
export class ExpensesService {
  // ===== خدمات المصروفات =====
  static async getTransactionExpenses(clientId?: number): Promise<any[]> {
    return TransactionExpensesService.getTransactionExpenses(clientId)
  }

  static async addTransactionExpense(expense: any): Promise<number | null> {
    return TransactionExpensesService.addTransactionExpense(expense)
  }

  static async updateTransactionExpense(expenseId: number, updates: any): Promise<boolean> {
    return TransactionExpensesService.updateTransactionExpense(expenseId, updates)
  }

  static async deleteTransactionExpense(expenseId: number): Promise<boolean> {
    return TransactionExpensesService.deleteTransactionExpense(expenseId)
  }

  // ===== خدمات أتعاب المحامي =====
  static async getLawyerFees(clientId?: number): Promise<any[]> {
    return LawyerFeesService.getLawyerFees(clientId)
  }

  static async addLawyerFee(fee: any): Promise<number | null> {
    return LawyerFeesService.addLawyerFee(fee)
  }

  static async updateLawyerFee(feeId: number, updates: any): Promise<boolean> {
    return LawyerFeesService.updateLawyerFee(feeId, updates)
  }

  static async deleteLawyerFee(feeId: number): Promise<boolean> {
    return LawyerFeesService.deleteLawyerFee(feeId)
  }

  // ===== خدمات الإحصائيات =====
  static async getExpensesStats(clientId?: number): Promise<any> {
    return ExpensesStatsService.getExpensesStats(clientId)
  }

  static async searchExpenses(searchTerm: string): Promise<{ expenses: any[], fees: any[] }> {
    return ExpensesStatsService.searchExpenses(searchTerm)
  }

  static async getAdvancedExpensesStats(clientId?: number): Promise<any> {
    return ExpensesStatsService.getAdvancedExpensesStats(clientId)
  }

  // ===== عمليات الحذف الشامل (للمطورين فقط) =====
  static async deleteAllExpenses(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع المصروفات والأتعاب...')
      
      const [expensesResult, feesResult] = await Promise.all([
        TransactionExpensesService.deleteAllTransactionExpenses(),
        LawyerFeesService.deleteAllLawyerFees()
      ])

      if (expensesResult && feesResult) {
        console.log('✅ تم حذف جميع المصروفات والأتعاب بنجاح')
        return true
      } else {
        console.error('❌ فشل في حذف بعض البيانات')
        return false
      }
    } catch (error) {
      console.error('❌ خطأ في deleteAllExpenses:', error)
      return false
    }
  }
}

// تصدير الخدمات المتخصصة للاستخدام المباشر عند الحاجة
export { TransactionExpensesService, LawyerFeesService, ExpensesStatsService }