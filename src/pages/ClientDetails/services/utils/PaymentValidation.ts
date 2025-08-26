/**
 * خدمة التحقق من صحة بيانات المدفوعات
 */
export class PaymentValidation {
  /**
   * التحقق من صحة بيانات الدفعة
   */
  static validatePayment(payment: {
    amount: string | number,
    date: string,
    notes?: string
  }): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    // التحقق من المبلغ
    const amount = typeof payment.amount === 'string' 
      ? parseFloat(payment.amount) 
      : payment.amount

    if (!amount || amount <= 0) {
      errors.push('مبلغ الدفعة يجب أن يكون أكبر من صفر')
    }

    if (amount > 1000000) {
      errors.push('مبلغ الدفعة كبير جداً')
    }

    // التحقق من التاريخ
    if (!payment.date) {
      errors.push('تاريخ الدفعة مطلوب')
    } else {
      const paymentDate = new Date(payment.date)
      const today = new Date()
      
      if (paymentDate > today) {
        errors.push('تاريخ الدفعة لا يمكن أن يكون في المستقبل')
      }

      // التحقق من أن التاريخ ليس قديماً جداً (أكثر من 10 سنوات)
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(today.getFullYear() - 10)
      
      if (paymentDate < tenYearsAgo) {
        errors.push('تاريخ الدفعة قديم جداً')
      }
    }

    // التحقق من الملاحظات
    if (payment.notes && payment.notes.length > 500) {
      errors.push('الملاحظات طويلة جداً (الحد الأقصى 500 حرف)')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * التحقق من عدم تضارب التواريخ
   */
  static checkDateConflicts(payments: any[], newDate: string): string[] {
    const conflicts: string[] = []
    const newPaymentDate = new Date(newDate)

    // التحقق من وجود أكثر من 3 دفعات في نفس اليوم
    const sameDate = payments.filter(p => {
      const paymentDate = new Date(p.date)
      return paymentDate.toDateString() === newPaymentDate.toDateString()
    })

    if (sameDate.length >= 3) {
      conflicts.push('يوجد عدد كبير من الدفعات في نفس التاريخ')
    }

    return conflicts
  }

  /**
   * التحقق من المبالغ المشبوهة
   */
  static checkSuspiciousAmounts(payments: any[], newAmount: number): string[] {
    const warnings: string[] = []

    if (payments.length > 0) {
      const amounts = payments.map(p => p.amount)
      const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length

      // إذا كان المبلغ أكبر من 10 أضعاف المتوسط
      if (newAmount > average * 10) {
        warnings.push('المبلغ أكبر بكثير من المتوسط المعتاد')
      }

      // إذا كان المبلغ أقل من 10% من المتوسط
      if (newAmount < average * 0.1) {
        warnings.push('المبلغ أقل بكثير من المتوسط المعتاد')
      }
    }

    return warnings
  }
}
