/**
 * خدمة تصنيف المصروفات
 */
export class ExpenseCategories {
  /**
   * تصنيف المصروفات حسب النوع
   */
  static categorizeExpenses(expenses: any[]): Record<string, any[]> {
    const categories: Record<string, any[]> = {
      'رسوم إدارية': [],
      'رسوم تحويل': [],
      'رسوم قانونية': [],
      'رسوم بنكية': [],
      'أخرى': []
    }

    expenses.forEach(expense => {
      const description = expense.description?.toLowerCase() || ''
      
      if (description.includes('إدار') || description.includes('admin')) {
        categories['رسوم إدارية'].push(expense)
      } else if (description.includes('تحويل') || description.includes('transfer')) {
        categories['رسوم تحويل'].push(expense)
      } else if (description.includes('قانون') || description.includes('legal')) {
        categories['رسوم قانونية'].push(expense)
      } else if (description.includes('بنك') || description.includes('bank')) {
        categories['رسوم بنكية'].push(expense)
      } else {
        categories['أخرى'].push(expense)
      }
    })

    return categories
  }

  /**
   * الحصول على إحصائيات المصروفات
   */
  static getExpenseStatistics(expenses: any[], lawyerFees: any[]): {
    totalExpenses: number
    totalLawyerFees: number
    totalOverall: number
    expenseCount: number
    lawyerFeeCount: number
    averageExpense: number
    averageLawyerFee: number
  } {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0)
    const totalLawyerFees = lawyerFees.reduce((total, fee) => total + fee.amount, 0)

    return {
      totalExpenses,
      totalLawyerFees,
      totalOverall: totalExpenses + totalLawyerFees,
      expenseCount: expenses.length,
      lawyerFeeCount: lawyerFees.length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      averageLawyerFee: lawyerFees.length > 0 ? totalLawyerFees / lawyerFees.length : 0
    }
  }

  /**
   * اقتراح تحسينات للمصروفات
   */
  static suggestOptimizations(expenses: any[]): string[] {
    const suggestions: string[] = []
    const categories = this.categorizeExpenses(expenses)
    
    // تحليل كل فئة
    Object.entries(categories).forEach(([category, categoryExpenses]) => {
      if (categoryExpenses.length === 0) return

      const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      const averageAmount = totalAmount / categoryExpenses.length

      // اقتراحات بناءً على الفئة
      switch (category) {
        case 'رسوم إدارية':
          if (averageAmount > 100) {
            suggestions.push('يمكن تقليل الرسوم الإدارية من خلال الأتمتة')
          }
          break
        case 'رسوم تحويل':
          if (categoryExpenses.length > 10) {
            suggestions.push('كثرة التحويلات - يُنصح بتجميع المدفوعات')
          }
          break
        case 'رسوم قانونية':
          if (totalAmount > 1000) {
            suggestions.push('الرسوم القانونية مرتفعة - مراجعة الاتفاقيات')
          }
          break
      }
    })

    // اقتراحات عامة
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    if (totalExpenses > 5000) {
      suggestions.push('إجمالي المصروفات مرتفع - مراجعة شاملة مطلوبة')
    }

    return suggestions
  }
}
