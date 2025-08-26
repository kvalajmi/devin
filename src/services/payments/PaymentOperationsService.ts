import { supabase } from '../DatabaseConnection'

/**
 * خدمة العمليات الأساسية للمدفوعات
 */
export class PaymentOperationsService {
  /**
   * جلب جميع المدفوعات
   */
  static async getPayments(clientId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب بيانات المدفوعات...')
      
      let query = supabase.from('payment_records').select('*')
      
      if (clientId) {
        query = query.eq('client_id', clientId)
      }
      
      const { data, error } = await query.order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب المدفوعات:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} مدفوعة بنجاح`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getPayments:', error)
      return []
    }
  }

  /**
   * إضافة مدفوعة جديدة
   */
  static async addPaymentRecord(record: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة مدفوعة جديدة للعميل ID:', record.client_id)
      
      const { data, error } = await supabase
        .from('payment_records')
        .insert([record])
        .select('id')
        .single()

      if (error) {
        console.error('❌ خطأ في إضافة المدفوعة:', error)
        throw error
      }

      console.log('✅ تم إضافة المدفوعة بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addPaymentRecord:', error)
      return null
    }
  }

  /**
   * تحديث مدفوعة موجودة
   */
  static async updatePaymentRecord(paymentId: number, updates: any): Promise<boolean> {
    try {
      console.log('📝 جاري تحديث المدفوعة ID:', paymentId)
      
      const { error } = await supabase
        .from('payment_records')
        .update(updates)
        .eq('id', paymentId)

      if (error) {
        console.error('❌ خطأ في تحديث المدفوعة:', error)
        throw error
      }

      console.log('✅ تم تحديث المدفوعة بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updatePaymentRecord:', error)
      return false
    }
  }

  /**
   * حذف مدفوعة
   */
  static async deletePaymentRecord(paymentId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف المدفوعة ID:', paymentId)
      
      const { error } = await supabase
        .from('payment_records')
        .delete()
        .eq('id', paymentId)

      if (error) {
        console.error('❌ خطأ في حذف المدفوعة:', error)
        throw error
      }

      console.log('✅ تم حذف المدفوعة بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deletePaymentRecord:', error)
      return false
    }
  }

  /**
   * حذف جميع المدفوعات (للمطورين فقط)
   */
  static async deleteAllPayments(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع المدفوعات...')
      
      const { error } = await supabase
        .from('payment_records')
        .delete()
        .neq('id', 0)

      if (error) {
        console.error('❌ خطأ في حذف جميع المدفوعات:', error)
        throw error
      }

      console.log('✅ تم حذف جميع المدفوعات بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteAllPayments:', error)
      return false
    }
  }
}
