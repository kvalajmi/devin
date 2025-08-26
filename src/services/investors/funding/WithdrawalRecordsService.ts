import { supabase } from '../../DatabaseConnection'

/**
 * خدمة إدارة سجلات السحوبات
 */
export class WithdrawalRecordsService {
  /**
   * إضافة سجل سحب
   */
  static async addWithdrawalRecord(record: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة سجل سحب للمستثمر ID:', record.investor_id)
      
      const { data, error } = await supabase
        .from('withdrawal_records')
        .insert([record])
        .select('id')
        .single()
      
      if (error) {
        console.error('❌ خطأ في إضافة سجل السحب:', error)
        throw error
      }

      console.log('✅ تم إضافة سجل السحب بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addWithdrawalRecord:', error)
      return null
    }
  }

  /**
   * الحصول على سجلات السحب
   */
  static async getWithdrawalRecords(investorId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب سجلات السحب...')
      
      let query = supabase.from('withdrawal_records').select('*')
      
      if (investorId) {
        query = query.eq('investor_id', investorId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ خطأ في جلب سجلات السحب:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} سجل سحب`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getWithdrawalRecords:', error)
      return []
    }
  }

  /**
   * تحديث سجل سحب
   */
  static async updateWithdrawalRecord(recordId: number, updates: any): Promise<boolean> {
    try {
      console.log('🔧 جاري تحديث سجل السحب ID:', recordId)
      
      const { error } = await supabase
        .from('withdrawal_records')
        .update(updates)
        .eq('id', recordId)
      
      if (error) {
        console.error('❌ خطأ في تحديث سجل السحب:', error)
        throw error
      }

      console.log('✅ تم تحديث سجل السحب بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updateWithdrawalRecord:', error)
      return false
    }
  }

  /**
   * حذف سجل سحب
   */
  static async deleteWithdrawalRecord(recordId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف سجل السحب ID:', recordId)
      
      const { error } = await supabase
        .from('withdrawal_records')
        .delete()
        .eq('id', recordId)
      
      if (error) {
        console.error('❌ خطأ في حذف سجل السحب:', error)
        throw error
      }

      console.log('✅ تم حذف سجل السحب بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteWithdrawalRecord:', error)
      return false
    }
  }

  /**
   * حساب إجمالي السحوبات لمستثمر
   */
  static async getTotalWithdrawals(investorId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('withdrawal_records')
        .select('amount')
        .eq('investor_id', investorId)
      
      if (error) {
        console.error('❌ خطأ في حساب إجمالي السحوبات:', error)
        throw error
      }

      const total = data?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0
      console.log(`💸 إجمالي السحوبات للمستثمر ${investorId}: ${total}`)
      return total
    } catch (error) {
      console.error('❌ خطأ في getTotalWithdrawals:', error)
      return 0
    }
  }
}
