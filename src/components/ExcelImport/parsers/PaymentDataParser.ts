import { formatDate, parseNumericValue, cleanText } from '../DateFormatter'

export interface PaymentRecord {
  date: string
  amount: number
  notes: string
}

/**
 * محلل بيانات المدفوعات من Excel
 */
export class PaymentDataParser {
  /**
   * تحليل المدفوعات من صفوف Excel
   */
  static parsePayments(rows: any[]): PaymentRecord[] {
    const payments: PaymentRecord[] = []
    
    rows.forEach((row, index) => {
      try {
        // البحث عن أعمدة المدفوعات
        const paymentColumns = this.findPaymentColumns(row)
        
        paymentColumns.forEach(payment => {
          if (payment && payment.amount > 0) {
            payments.push(payment)
          }
        })
      } catch (error) {
        console.warn(`خطأ في تحليل المدفوعات في الصف ${index + 1}:`, error)
      }
    })

    return this.sortPaymentsByDate(payments)
  }

  /**
   * العثور على أعمدة المدفوعات في الصف
   */
  private static findPaymentColumns(row: any): PaymentRecord[] {
    const payments: PaymentRecord[] = []
    const paymentKeys = Object.keys(row).filter(key => 
      key.includes('دفعة') || 
      key.includes('سداد') || 
      key.includes('قسط') ||
      key.match(/\d+\/\d+\/\d+/) // تواريخ
    )

    // تحليل المدفوعات المرقمة (دفعة 1، دفعة 2، إلخ)
    for (let i = 1; i <= 50; i++) {
      const paymentAmount = row[`دفعة ${i}`] || row[`سداد ${i}`] || row[`قسط ${i}`]
      const paymentDate = row[`تاريخ دفعة ${i}`] || row[`تاريخ ${i}`]
      const paymentNotes = row[`ملاحظات ${i}`] || row[`ملاحظة ${i}`] || ''

      if (paymentAmount && parseNumericValue(paymentAmount) > 0) {
        payments.push({
          date: formatDate(paymentDate) || new Date().toISOString().split('T')[0],
          amount: parseNumericValue(paymentAmount),
          notes: cleanText(paymentNotes)
        })
      }
    }

    // تحليل المدفوعات بالتواريخ كأعمدة
    paymentKeys.forEach(key => {
      if (key.match(/\d+\/\d+\/\d+/)) {
        const amount = parseNumericValue(row[key])
        if (amount > 0) {
          payments.push({
            date: formatDate(key) || new Date().toISOString().split('T')[0],
            amount,
            notes: ''
          })
        }
      }
    })

    return payments
  }

  /**
   * ترتيب المدفوعات حسب التاريخ
   */
  private static sortPaymentsByDate(payments: PaymentRecord[]): PaymentRecord[] {
    return payments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  /**
   * التحقق من صحة بيانات المدفوعة
   */
  static validatePayment(payment: PaymentRecord): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!payment.date) {
      errors.push('تاريخ المدفوعة مطلوب')
    }

    if (payment.amount <= 0) {
      errors.push('مبلغ المدفوعة يجب أن يكون أكبر من صفر')
    }

    if (payment.amount > 1000000) {
      errors.push('مبلغ المدفوعة كبير جداً')
    }

    // التحقق من صحة التاريخ
    const paymentDate = new Date(payment.date)
    if (isNaN(paymentDate.getTime())) {
      errors.push('تاريخ المدفوعة غير صحيح')
    }

    const today = new Date()
    if (paymentDate > today) {
      errors.push('تاريخ المدفوعة لا يمكن أن يكون في المستقبل')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * حساب إحصائيات المدفوعات
   */
  static calculatePaymentStats(payments: PaymentRecord[]): {
    totalAmount: number
    paymentCount: number
    averagePayment: number
    firstPaymentDate: string | null
    lastPaymentDate: string | null
  } {
    if (payments.length === 0) {
      return {
        totalAmount: 0,
        paymentCount: 0,
        averagePayment: 0,
        firstPaymentDate: null,
        lastPaymentDate: null
      }
    }

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const sortedPayments = this.sortPaymentsByDate(payments)

    return {
      totalAmount,
      paymentCount: payments.length,
      averagePayment: totalAmount / payments.length,
      firstPaymentDate: sortedPayments[0]?.date || null,
      lastPaymentDate: sortedPayments[sortedPayments.length - 1]?.date || null
    }
  }

  /**
   * تجميع المدفوعات حسب الشهر
   */
  static groupPaymentsByMonth(payments: PaymentRecord[]): Record<string, PaymentRecord[]> {
    const grouped: Record<string, PaymentRecord[]> = {}

    payments.forEach(payment => {
      const date = new Date(payment.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(payment)
    })

    return grouped
  }

  /**
   * تحويل المدفوعات إلى تنسيق قاعدة البيانات
   */
  static convertToDbFormat(payments: PaymentRecord[], clientId: number): any[] {
    return payments.map((payment, index) => ({
      client_id: clientId,
      date: payment.date,
      amount: payment.amount,
      notes: payment.notes || '',
      type: 'installment'
    }))
  }
}
