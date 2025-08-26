import { formatDate, parseNumericValue, cleanText } from '../DateFormatter'

export interface ExpenseRecord {
  date: string
  amount: number
  description: string
}

/**
 * محلل المصروفات من Excel
 */
export class ExpenseParser {
  /**
   * تحليل المصروفات من صفوف Excel
   */
  static parseExpenses(rows: any[]): ExpenseRecord[] {
    const expenses: ExpenseRecord[] = []
    
    rows.forEach((row, index) => {
      try {
        const expenseColumns = this.findExpenseColumns(row)
        expenses.push(...expenseColumns)
      } catch (error) {
        console.warn(`خطأ في تحليل المصروفات في الصف ${index + 1}:`, error)
      }
    })

    return this.sortExpensesByDate(expenses)
  }

  /**
   * العثور على أعمدة المصروفات في الصف
   */
  private static findExpenseColumns(row: any): ExpenseRecord[] {
    const expenses: ExpenseRecord[] = []

    // البحث عن المصروفات المرقمة
    for (let i = 1; i <= 20; i++) {
      const expenseAmount = row[`مصروف ${i}`] || row[`مصاريف ${i}`]
      const expenseDate = row[`تاريخ مصروف ${i}`] || row[`تاريخ ${i}`]
      const expenseDesc = row[`وصف مصروف ${i}`] || row[`وصف ${i}`] || `مصروف ${i}`

      if (expenseAmount && parseNumericValue(expenseAmount) > 0) {
        expenses.push({
          date: formatDate(expenseDate) || new Date().toISOString().split('T')[0],
          amount: parseNumericValue(expenseAmount),
          description: cleanText(expenseDesc)
        })
      }
    }

    // البحث عن أعمدة المصروفات العامة
    const generalExpenseKeys = Object.keys(row).filter(key => 
      key.includes('مصروف') || 
      key.includes('مصاريف') ||
      key.includes('رسوم') ||
      key.includes('تكلفة')
    )

    generalExpenseKeys.forEach(key => {
      if (!key.includes('تاريخ') && !key.includes('وصف')) {
        const amount = parseNumericValue(row[key])
        if (amount > 0) {
          expenses.push({
            date: new Date().toISOString().split('T')[0],
            amount,
            description: this.translateExpenseType(key)
          })
        }
      }
    })

    return expenses
  }

  /**
   * ترجمة نوع المصروف
   */
  private static translateExpenseType(key: string): string {
    if (key.includes('رسوم')) return 'رسوم إدارية'
    if (key.includes('تحويل')) return 'رسوم تحويل'
    if (key.includes('بنك')) return 'رسوم بنكية'
    if (key.includes('اتصال')) return 'رسوم اتصالات'
    return 'مصروفات متنوعة'
  }

  /**
   * ترتيب المصروفات حسب التاريخ
   */
  private static sortExpensesByDate(expenses: ExpenseRecord[]): ExpenseRecord[] {
    return expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  /**
   * التحقق من صحة بيانات المصروف
   */
  static validateExpense(expense: ExpenseRecord): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!expense.date) {
      errors.push('تاريخ المصروف مطلوب')
    }

    if (expense.amount <= 0) {
      errors.push('مبلغ المصروف يجب أن يكون أكبر من صفر')
    }

    if (!expense.description.trim()) {
      errors.push('وصف المصروف مطلوب')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * تحويل المصروفات إلى تنسيق قاعدة البيانات
   */
  static convertToDbFormat(expenses: ExpenseRecord[], clientId: number): any[] {
    return expenses.map(expense => ({
      client_id: clientId,
      expense_date: expense.date,
      amount: expense.amount,
      description: expense.description,
      entry_user: 'مستورد من Excel',
      entry_date_time: new Date().toISOString()
    }))
  }
}
