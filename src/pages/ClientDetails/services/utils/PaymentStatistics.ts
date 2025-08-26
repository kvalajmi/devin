/**
 * خدمة إحصائيات المدفوعات
 */
export class PaymentStatistics {
  /**
   * الحصول على إحصائيات المدفوعات
   */
  static getPaymentStatistics(payments: any[]): {
    total: number
    count: number
    average: number
    min: number
    max: number
    lastPaymentDate: string | null
  } {
    if (payments.length === 0) {
      return {
        total: 0,
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        lastPaymentDate: null
      }
    }

    const amounts = payments.map(p => p.amount)
    const total = amounts.reduce((sum, amount) => sum + amount, 0)
    const sortedDates = payments
      .map(p => p.date)
      .sort()
      .reverse()

    return {
      total,
      count: payments.length,
      average: total / payments.length,
      min: Math.min(...amounts),
      max: Math.max(...amounts),
      lastPaymentDate: sortedDates[0] || null
    }
  }

  /**
   * تحليل أنماط الدفع
   */
  static analyzePaymentPatterns(payments: any[]): {
    monthlyAverage: number
    mostActiveMonth: string
    paymentFrequency: 'منتظم' | 'غير منتظم'
    seasonalTrends: Record<string, number>
  } {
    if (payments.length === 0) {
      return {
        monthlyAverage: 0,
        mostActiveMonth: 'غير محدد',
        paymentFrequency: 'غير منتظم',
        seasonalTrends: {}
      }
    }

    // تجميع المدفوعات حسب الشهر
    const monthlyPayments: Record<string, number> = {}
    const monthlyAmounts: Record<string, number> = {}

    payments.forEach(payment => {
      const date = new Date(payment.date)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      monthlyPayments[monthKey] = (monthlyPayments[monthKey] || 0) + 1
      monthlyAmounts[monthKey] = (monthlyAmounts[monthKey] || 0) + payment.amount
    })

    // حساب المتوسط الشهري
    const months = Object.keys(monthlyAmounts)
    const monthlyAverage = months.length > 0 
      ? Object.values(monthlyAmounts).reduce((sum, amt) => sum + amt, 0) / months.length
      : 0

    // العثور على الشهر الأكثر نشاطاً
    const mostActiveMonth = months.length > 0
      ? Object.entries(monthlyPayments).reduce((max, [month, count]) => 
          count > max.count ? { month, count } : max, 
          { month: '', count: 0 }
        ).month
      : 'غير محدد'

    // تحديد انتظام الدفع
    const paymentIntervals = payments
      .map(p => new Date(p.date).getTime())
      .sort((a, b) => a - b)
      .slice(1)
      .map((time, i) => time - payments.map(p => new Date(p.date).getTime()).sort((a, b) => a - b)[i])

    const avgInterval = paymentIntervals.length > 0
      ? paymentIntervals.reduce((sum, interval) => sum + interval, 0) / paymentIntervals.length
      : 0

    const intervalVariance = paymentIntervals.length > 0
      ? paymentIntervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / paymentIntervals.length
      : 0

    const paymentFrequency = intervalVariance < (avgInterval * 0.3) ? 'منتظم' : 'غير منتظم'

    // اتجاهات موسمية
    const seasonalTrends: Record<string, number> = {
      'الربيع': 0, 'الصيف': 0, 'الخريف': 0, 'الشتاء': 0
    }

    payments.forEach(payment => {
      const month = new Date(payment.date).getMonth() + 1
      if (month >= 3 && month <= 5) seasonalTrends['الربيع'] += payment.amount
      else if (month >= 6 && month <= 8) seasonalTrends['الصيف'] += payment.amount
      else if (month >= 9 && month <= 11) seasonalTrends['الخريف'] += payment.amount
      else seasonalTrends['الشتاء'] += payment.amount
    })

    return {
      monthlyAverage,
      mostActiveMonth,
      paymentFrequency,
      seasonalTrends
    }
  }

  /**
   * توقع الدفعة التالية
   */
  static predictNextPayment(payments: any[]): {
    expectedDate: string | null
    expectedAmount: number
    confidence: 'عالية' | 'متوسطة' | 'منخفضة'
  } {
    if (payments.length < 3) {
      return {
        expectedDate: null,
        expectedAmount: 0,
        confidence: 'منخفضة'
      }
    }

    // ترتيب المدفوعات حسب التاريخ
    const sortedPayments = payments
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // حساب متوسط الفترة بين الدفعات
    const intervals = []
    for (let i = 1; i < sortedPayments.length; i++) {
      const prevDate = new Date(sortedPayments[i - 1].date)
      const currDate = new Date(sortedPayments[i].date)
      intervals.push(currDate.getTime() - prevDate.getTime())
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length

    // توقع التاريخ التالي
    const lastPaymentDate = new Date(sortedPayments[sortedPayments.length - 1].date)
    const expectedDate = new Date(lastPaymentDate.getTime() + avgInterval)

    // حساب متوسط المبلغ
    const recentPayments = sortedPayments.slice(-5) // آخر 5 دفعات
    const expectedAmount = recentPayments.reduce((sum, p) => sum + p.amount, 0) / recentPayments.length

    // تحديد مستوى الثقة
    const intervalVariance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length
    
    const confidence = intervalVariance < (avgInterval * 0.2) ? 'عالية' :
                      intervalVariance < (avgInterval * 0.5) ? 'متوسطة' : 'منخفضة'

    return {
      expectedDate: expectedDate.toISOString().split('T')[0],
      expectedAmount: Math.round(expectedAmount),
      confidence
    }
  }
}
