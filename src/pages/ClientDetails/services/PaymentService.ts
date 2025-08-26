import { PaymentValidation } from './utils/PaymentValidation'
import { PaymentStatistics } from './utils/PaymentStatistics'

/**
 * خدمة إدارة المدفوعات المحسّنة
 */
export class PaymentService {
  /**
   * إضافة دفعة جديدة
   */
  static addPayment(
    payments: any[],
    newPayment: { amount: string, date: string, notes: string }
  ): any[] {
    if (!newPayment.amount || !newPayment.date) {
      throw new Error('مبلغ الدفعة والتاريخ مطلوبان')
    }

    const paymentRecord = {
      id: payments.length + 1,
      amount: Number(newPayment.amount),
      date: newPayment.date,
      entryUser: 'المستخدم الحالي',
      entryDateTime: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      notes: newPayment.notes || ''
    }

    return [...payments, paymentRecord]
  }

  /**
   * تعديل دفعة موجودة
   */
  static updatePayment(
    payments: any[],
    paymentId: number,
    newAmount: number,
    newNotes?: string
  ): any[] {
    return payments.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            amount: newAmount,
            notes: newNotes || payment.notes,
            lastModified: new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }
        : payment
    )
  }

  /**
   * حذف دفعة
   */
  static deletePayment(payments: any[], paymentId: number): any[] {
    return payments.filter(payment => payment.id !== paymentId)
  }

  /**
   * حساب إجمالي المدفوعات
   */
  static calculateTotalPayments(payments: any[]): number {
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  /**
   * البحث في المدفوعات
   */
  static searchPayments(payments: any[], searchTerm: string): any[] {
    if (!searchTerm.trim()) return payments

    const term = searchTerm.toLowerCase()
    return payments.filter(payment => 
      payment.notes?.toLowerCase().includes(term) ||
      payment.entryUser?.toLowerCase().includes(term) ||
      payment.amount.toString().includes(term) ||
      payment.date.includes(term)
    )
  }

  /**
   * ترتيب المدفوعات
   */
  static sortPayments(
    payments: any[], 
    sortBy: 'date' | 'amount' | 'user',
    direction: 'asc' | 'desc' = 'desc'
  ): any[] {
    return [...payments].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'user':
          comparison = (a.entryUser || '').localeCompare(b.entryUser || '', 'ar')
          break
      }

      return direction === 'desc' ? -comparison : comparison
    })
  }

  /**
   * تصفية المدفوعات حسب الفترة الزمنية
   */
  static filterPaymentsByDateRange(
    payments: any[],
    startDate: string,
    endDate: string
  ): any[] {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return payments.filter(payment => {
      const paymentDate = new Date(payment.date)
      return paymentDate >= start && paymentDate <= end
    })
  }

  /**
   * تصفية المدفوعات حسب المبلغ
   */
  static filterPaymentsByAmount(
    payments: any[],
    minAmount: number,
    maxAmount: number
  ): any[] {
    return payments.filter(payment => 
      payment.amount >= minAmount && payment.amount <= maxAmount
    )
  }

  // إعادة تصدير الخدمات المساعدة
  static validatePayment = PaymentValidation.validatePayment
  static checkDateConflicts = PaymentValidation.checkDateConflicts
  static checkSuspiciousAmounts = PaymentValidation.checkSuspiciousAmounts
  static getPaymentStatistics = PaymentStatistics.getPaymentStatistics
  static analyzePaymentPatterns = PaymentStatistics.analyzePaymentPatterns
  static predictNextPayment = PaymentStatistics.predictNextPayment
}