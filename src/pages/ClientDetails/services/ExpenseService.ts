import { ExpenseValidation } from './utils/ExpenseValidation'
import { ExpenseAnalysis } from './utils/ExpenseAnalysis'

/**
 * خدمة إدارة المصروفات وأتعاب المحامي المحسّنة
 */
export class ExpenseService {
  /**
   * إضافة مصروف جديد
   */
  static addExpense(
    expenses: any[],
    newExpense: { amount: string, date: string, description: string }
  ): any[] {
    if (!newExpense.amount || !newExpense.date || !newExpense.description) {
      throw new Error('جميع بيانات المصروف مطلوبة')
    }

    const expenseRecord = {
      id: expenses.length + 1,
      amount: Number(newExpense.amount),
      date: newExpense.date,
      description: newExpense.description,
      entryUser: 'المستخدم الحالي',
      entryDateTime: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    return [...expenses, expenseRecord]
  }

  /**
   * تعديل مصروف موجود
   */
  static updateExpense(
    expenses: any[],
    expenseId: number,
    newAmount: number,
    newDescription?: string
  ): any[] {
    return expenses.map(expense => 
      expense.id === expenseId 
        ? { 
            ...expense, 
            amount: newAmount,
            description: newDescription || expense.description,
            lastModified: new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }
        : expense
    )
  }

  /**
   * حذف مصروف
   */
  static deleteExpense(expenses: any[], expenseId: number): any[] {
    return expenses.filter(expense => expense.id !== expenseId)
  }

  /**
   * إضافة أتعاب محامي جديدة
   */
  static addLawyerFee(
    lawyerFees: any[],
    newFee: { amount: string, date: string, description: string }
  ): any[] {
    if (!newFee.amount || !newFee.date || !newFee.description) {
      throw new Error('جميع بيانات أتعاب المحامي مطلوبة')
    }

    const feeRecord = {
      id: lawyerFees.length + 1,
      amount: Number(newFee.amount),
      date: newFee.date,
      description: newFee.description,
      entryUser: 'المستخدم الحالي',
      entryDateTime: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    return [...lawyerFees, feeRecord]
  }

  /**
   * تعديل أتعاب محامي موجودة
   */
  static updateLawyerFee(
    lawyerFees: any[],
    feeId: number,
    newAmount: number,
    newDescription?: string
  ): any[] {
    return lawyerFees.map(fee => 
      fee.id === feeId 
        ? { 
            ...fee, 
            amount: newAmount,
            description: newDescription || fee.description,
            lastModified: new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }
        : fee
    )
  }

  /**
   * حذف أتعاب محامي
   */
  static deleteLawyerFee(lawyerFees: any[], feeId: number): any[] {
    return lawyerFees.filter(fee => fee.id !== feeId)
  }

  /**
   * حساب إجمالي المصروفات
   */
  static calculateTotalExpenses(expenses: any[]): number {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  /**
   * حساب إجمالي أتعاب المحامي
   */
  static calculateTotalLawyerFees(lawyerFees: any[]): number {
    return lawyerFees.reduce((total, fee) => total + fee.amount, 0)
  }

  /**
   * البحث في المصروفات
   */
  static searchExpenses(expenses: any[], searchTerm: string): any[] {
    if (!searchTerm.trim()) return expenses

    const term = searchTerm.toLowerCase()
    return expenses.filter(expense => 
      expense.description?.toLowerCase().includes(term) ||
      expense.entryUser?.toLowerCase().includes(term) ||
      expense.amount.toString().includes(term) ||
      expense.date.includes(term)
    )
  }

  /**
   * البحث في أتعاب المحامي
   */
  static searchLawyerFees(lawyerFees: any[], searchTerm: string): any[] {
    if (!searchTerm.trim()) return lawyerFees

    const term = searchTerm.toLowerCase()
    return lawyerFees.filter(fee => 
      fee.description?.toLowerCase().includes(term) ||
      fee.entryUser?.toLowerCase().includes(term) ||
      fee.amount.toString().includes(term) ||
      fee.date.includes(term)
    )
  }

  /**
   * ترتيب المصروفات
   */
  static sortExpenses(
    expenses: any[], 
    sortBy: 'date' | 'amount' | 'description',
    direction: 'asc' | 'desc' = 'desc'
  ): any[] {
    return [...expenses].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'description':
          comparison = (a.description || '').localeCompare(b.description || '', 'ar')
          break
      }

      return direction === 'desc' ? -comparison : comparison
    })
  }

  // إعادة تصدير الخدمات المساعدة
  static validateExpense = ExpenseValidation.validateExpense
  static checkDuplicateExpenses = ExpenseValidation.checkDuplicateExpenses
  static checkSuspiciousExpenses = ExpenseValidation.checkSuspiciousExpenses
  static suggestCategory = ExpenseValidation.suggestCategory
  static categorizeExpenses = ExpenseAnalysis.categorizeExpenses
  static getExpenseStatistics = ExpenseAnalysis.getExpenseStatistics
  static analyzeExpenseTrends = ExpenseAnalysis.analyzeExpenseTrends
  static suggestOptimizations = ExpenseAnalysis.suggestOptimizations
  static predictFutureExpenses = ExpenseAnalysis.predictFutureExpenses
}