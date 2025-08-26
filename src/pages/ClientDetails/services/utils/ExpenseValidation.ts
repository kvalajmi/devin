/**
 * خدمة التحقق من صحة بيانات المصروفات
 */
export class ExpenseValidation {
  /**
   * التحقق من صحة بيانات المصروف
   */
  static validateExpense(expense: {
    amount: string | number,
    date: string,
    description: string
  }): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    // التحقق من المبلغ
    const amount = typeof expense.amount === 'string' 
      ? parseFloat(expense.amount) 
      : expense.amount

    if (!amount || amount <= 0) {
      errors.push('مبلغ المصروف يجب أن يكون أكبر من صفر')
    }

    if (amount > 100000) {
      errors.push('مبلغ المصروف كبير جداً')
    }

    // التحقق من التاريخ
    if (!expense.date) {
      errors.push('تاريخ المصروف مطلوب')
    } else {
      const expenseDate = new Date(expense.date)
      const today = new Date()
      
      if (expenseDate > today) {
        errors.push('تاريخ المصروف لا يمكن أن يكون في المستقبل')
      }
    }

    // التحقق من الوصف
    if (!expense.description || expense.description.trim().length === 0) {
      errors.push('وصف المصروف مطلوب')
    }

    if (expense.description && expense.description.length > 200) {
      errors.push('وصف المصروف طويل جداً (الحد الأقصى 200 حرف)')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * التحقق من تكرار المصروفات
   */
  static checkDuplicateExpenses(
    expenses: any[], 
    newExpense: { amount: number, date: string, description: string }
  ): boolean {
    return expenses.some(expense => 
      expense.amount === newExpense.amount &&
      expense.date === newExpense.date &&
      expense.description.toLowerCase() === newExpense.description.toLowerCase()
    )
  }

  /**
   * التحقق من المصروفات المشبوهة
   */
  static checkSuspiciousExpenses(expenses: any[], newAmount: number): string[] {
    const warnings: string[] = []

    if (expenses.length > 0) {
      const amounts = expenses.map(e => e.amount)
      const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length

      // إذا كان المبلغ أكبر من 5 أضعاف المتوسط
      if (newAmount > average * 5) {
        warnings.push('المصروف أكبر بكثير من المتوسط المعتاد')
      }
    }

    // التحقق من المصروفات الكبيرة
    if (newAmount > 10000) {
      warnings.push('مصروف كبير - يُنصح بالمراجعة')
    }

    return warnings
  }

  /**
   * اقتراح تصنيف للمصروف
   */
  static suggestCategory(description: string): string {
    const desc = description.toLowerCase()
    
    if (desc.includes('إدار') || desc.includes('admin')) {
      return 'رسوم إدارية'
    } else if (desc.includes('تحويل') || desc.includes('transfer')) {
      return 'رسوم تحويل'
    } else if (desc.includes('قانون') || desc.includes('legal') || desc.includes('محام')) {
      return 'رسوم قانونية'
    } else if (desc.includes('بنك') || desc.includes('bank')) {
      return 'رسوم بنكية'
    } else if (desc.includes('اتصال') || desc.includes('هاتف') || desc.includes('communication')) {
      return 'رسوم اتصالات'
    } else {
      return 'أخرى'
    }
  }
}
