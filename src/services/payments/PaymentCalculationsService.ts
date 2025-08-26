import { supabase } from '../DatabaseConnection'

/**
 * خدمة حسابات وإحصائيات المدفوعات
 */
export class PaymentCalculationsService {
  /**
   * حساب إجمالي المدفوعات لعميل معين
   */
  static async getTotalPayments(clientId: number): Promise<number> {
    try {
      console.log('🔍 جاري حساب إجمالي المدفوعات للعميل ID:', clientId)
      
      const { data, error } = await supabase
        .from('payment_records')
        .select('amount')
        .eq('client_id', clientId)

      if (error) {
        console.error('❌ خطأ في حساب إجمالي المدفوعات:', error)
        throw error
      }

      const total = data?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0
      console.log('✅ إجمالي المدفوعات:', total)
      return total
    } catch (error) {
      console.error('❌ خطأ في getTotalPayments:', error)
      return 0
    }
  }

  /**
   * حساب إحصائيات المدفوعات العامة
   */
  static async getPaymentStats(): Promise<any> {
    try {
      console.log('📊 جاري حساب إحصائيات المدفوعات...')
      
      const { data, error } = await supabase
        .from('payment_records')
        .select('amount, date')

      if (error) {
        console.error('❌ خطأ في حساب الإحصائيات:', error)
        throw error
      }

      const stats = {
        totalPayments: data?.length || 0,
        totalAmount: data?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0,
        averagePayment: data?.length ? (data.reduce((sum: number, payment: any) => sum + payment.amount, 0) / data.length) : 0,
        lastPaymentDate: data?.length ? Math.max(...data.map((p: any) => new Date(p.date).getTime())) : null
      }

      console.log('✅ إحصائيات المدفوعات:', stats)
      return stats
    } catch (error) {
      console.error('❌ خطأ في getPaymentStats:', error)
      return { totalPayments: 0, totalAmount: 0, averagePayment: 0, lastPaymentDate: null }
    }
  }

  /**
   * حساب إحصائيات متقدمة للمدفوعات
   */
  static async getAdvancedPaymentStats(clientId?: number): Promise<any> {
    try {
      console.log('📊 جاري حساب الإحصائيات المتقدمة...')
      
      let query = supabase
        .from('payment_records')
        .select('amount, date')

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ خطأ في حساب الإحصائيات المتقدمة:', error)
        throw error
      }

      const payments = data || []
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      // المدفوعات في الشهر الحالي
      const thisMonthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.date)
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
      })

      // المدفوعات في الأشهر الثلاثة الماضية
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const lastThreeMonthsPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.date)
        return paymentDate >= threeMonthsAgo
      })

      const stats = {
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
        averagePayment: payments.length > 0 ? payments.reduce((sum, payment) => sum + payment.amount, 0) / payments.length : 0,
        thisMonthPayments: thisMonthPayments.length,
        thisMonthAmount: thisMonthPayments.reduce((sum, payment) => sum + payment.amount, 0),
        lastThreeMonthsPayments: lastThreeMonthsPayments.length,
        lastThreeMonthsAmount: lastThreeMonthsPayments.reduce((sum, payment) => sum + payment.amount, 0),
        lastPaymentDate: payments.length > 0 ? Math.max(...payments.map(p => new Date(p.date).getTime())) : null
      }

      console.log('✅ الإحصائيات المتقدمة:', stats)
      return stats
    } catch (error) {
      console.error('❌ خطأ في getAdvancedPaymentStats:', error)
      return {
        totalPayments: 0,
        totalAmount: 0,
        averagePayment: 0,
        thisMonthPayments: 0,
        thisMonthAmount: 0,
        lastThreeMonthsPayments: 0,
        lastThreeMonthsAmount: 0,
        lastPaymentDate: null
      }
    }
  }
}
