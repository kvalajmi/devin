import { supabase } from '../../DatabaseConnection'

/**
 * خدمة إدارة سحوبات الشريك
 */
export class PartnerWithdrawalService {
  /**
   * إضافة سجل سحب شريك
   */
  static async addPartnerWithdrawalRecord(record: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة سجل سحب شريك للمستثمر ID:', record.investor_id)
      
      const { data, error } = await supabase
        .from('partner_withdrawal_records')
        .insert([record])
        .select('id')
        .single()
      
      if (error) {
        console.error('❌ خطأ في إضافة سجل سحب الشريك:', error)
        throw error
      }

      console.log('✅ تم إضافة سجل سحب الشريك بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addPartnerWithdrawalRecord:', error)
      return null
    }
  }

  /**
   * الحصول على سجلات سحب الشريك
   */
  static async getPartnerWithdrawalRecords(investorId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب سجلات سحب الشريك...')
      
      let query = supabase.from('partner_withdrawal_records').select('*')
      
      if (investorId) {
        query = query.eq('investor_id', investorId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ خطأ في جلب سجلات سحب الشريك:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} سجل سحب شريك`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getPartnerWithdrawalRecords:', error)
      return []
    }
  }

  /**
   * تحديث سجل سحب شريك
   */
  static async updatePartnerWithdrawalRecord(recordId: number, updates: any): Promise<boolean> {
    try {
      console.log('🔧 جاري تحديث سجل سحب الشريك ID:', recordId)
      
      const { error } = await supabase
        .from('partner_withdrawal_records')
        .update(updates)
        .eq('id', recordId)
      
      if (error) {
        console.error('❌ خطأ في تحديث سجل سحب الشريك:', error)
        throw error
      }

      console.log('✅ تم تحديث سجل سحب الشريك بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updatePartnerWithdrawalRecord:', error)
      return false
    }
  }

  /**
   * حذف سجل سحب شريك
   */
  static async deletePartnerWithdrawalRecord(recordId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف سجل سحب الشريك ID:', recordId)
      
      const { error } = await supabase
        .from('partner_withdrawal_records')
        .delete()
        .eq('id', recordId)
      
      if (error) {
        console.error('❌ خطأ في حذف سجل سحب الشريك:', error)
        throw error
      }

      console.log('✅ تم حذف سجل سحب الشريك بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deletePartnerWithdrawalRecord:', error)
      return false
    }
  }

  /**
   * حساب إجمالي سحوبات الشريك لمستثمر
   */
  static async getTotalPartnerWithdrawals(investorId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('partner_withdrawal_records')
        .select('amount')
        .eq('investor_id', investorId)
      
      if (error) {
        console.error('❌ خطأ في حساب إجمالي سحوبات الشريك:', error)
        throw error
      }

      const total = data?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0
      console.log(`🤝 إجمالي سحوبات الشريك للمستثمر ${investorId}: ${total}`)
      return total
    } catch (error) {
      console.error('❌ خطأ في getTotalPartnerWithdrawals:', error)
      return 0
    }
  }
}
