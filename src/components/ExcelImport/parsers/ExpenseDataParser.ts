// واجهة موحدة للمصروفات وأتعاب المحامي
import { ExpenseParser, ExpenseRecord } from './ExpenseParser'
import { LawyerFeeParser, LawyerFeeRecord } from './LawyerFeeParser'

// إعادة تصدير الواجهات والفئات
export type { ExpenseRecord, LawyerFeeRecord }

/**
 * محلل بيانات المصروفات وأتعاب المحامي الموحد
 */
export class ExpenseDataParser {
  /**
   * تحليل المصروفات من صفوف Excel
   */
  static parseExpenses(rows: any[]): ExpenseRecord[] {
    return ExpenseParser.parseExpenses(rows)
  }

  /**
   * تحليل أتعاب المحامي من صفوف Excel
   */
  static parseLawyerFees(rows: any[]): LawyerFeeRecord[] {
    return LawyerFeeParser.parseLawyerFees(rows)
  }

  /**
   * التحقق من صحة بيانات المصروف
   */
  static validateExpense(expense: ExpenseRecord): { isValid: boolean, errors: string[] } {
    return ExpenseParser.validateExpense(expense)
  }

  /**
   * التحقق من صحة بيانات أتعاب المحامي
   */
  static validateLawyerFee(lawyerFee: LawyerFeeRecord): { isValid: boolean, errors: string[] } {
    return LawyerFeeParser.validateLawyerFee(lawyerFee)
  }

  /**
   * تحويل المصروفات إلى تنسيق قاعدة البيانات
   */
  static convertExpensesToDbFormat(expenses: ExpenseRecord[], clientId: number): any[] {
    return ExpenseParser.convertToDbFormat(expenses, clientId)
  }

  /**
   * تحويل أتعاب المحامي إلى تنسيق قاعدة البيانات
   */
  static convertLawyerFeesToDbFormat(lawyerFees: LawyerFeeRecord[], clientId: number): any[] {
    return LawyerFeeParser.convertToDbFormat(lawyerFees, clientId)
  }

  /**
   * تحليل شامل لجميع المصروفات والأتعاب
   */
  static parseAllExpenseData(rows: any[]): {
    expenses: ExpenseRecord[]
    lawyerFees: LawyerFeeRecord[]
    totalExpenses: number
    totalLawyerFees: number
    summary: string
  } {
    const expenses = this.parseExpenses(rows)
    const lawyerFees = this.parseLawyerFees(rows)
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalLawyerFees = lawyerFees.reduce((sum, fee) => sum + fee.amount, 0)
    
    const summary = `تم تحليل ${expenses.length} مصروف و ${lawyerFees.length} أتعاب محامي`

    return {
      expenses,
      lawyerFees,
      totalExpenses,
      totalLawyerFees,
      summary
    }
  }
}