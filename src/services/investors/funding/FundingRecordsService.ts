import { supabase } from '../../DatabaseConnection'

/**
 * خدمة إدارة سجلات التمويل
 */
export class FundingRecordsService {
  /**
   * إضافة سجل تمويل
   */
  static async addFundingRecord(record: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة سجل تمويل للمستثمر ID:', record.investor_id)
      
      const { data, error } = await supabase
        .from('funding_records')
        .insert([record])
        .select('id')
        .single()
      
      if (error) {
        console.error('❌ خطأ في إضافة سجل التمويل:', error)
        throw error
      }

      console.log('✅ تم إضافة سجل التمويل بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addFundingRecord:', error)
      return null
    }
  }

  /**
   * الحصول على سجلات التمويل
   */
  static async getFundingRecords(investorId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب سجلات التمويل...')
      
      let query = supabase.from('funding_records').select('*')
      
      if (investorId) {
        query = query.eq('investor_id', investorId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ خطأ في جلب سجلات التمويل:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} سجل تمويل`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getFundingRecords:', error)
      return []
    }
  }

  /**
   * تحديث سجل تمويل
   */
  static async updateFundingRecord(recordId: number, updates: any): Promise<boolean> {
    try {
      console.log('🔧 جاري تحديث سجل التمويل ID:', recordId)
      
      const { error } = await supabase
        .from('funding_records')
        .update(updates)
        .eq('id', recordId)
      
      if (error) {
        console.error('❌ خطأ في تحديث سجل التمويل:', error)
        throw error
      }

      console.log('✅ تم تحديث سجل التمويل بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updateFundingRecord:', error)
      return false
    }
  }

  /**
   * حذف سجل تمويل
   */
  static async deleteFundingRecord(recordId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف سجل التمويل ID:', recordId)
      
      const { error } = await supabase
        .from('funding_records')
        .delete()
        .eq('id', recordId)
      
      if (error) {
        console.error('❌ خطأ في حذف سجل التمويل:', error)
        throw error
      }

      console.log('✅ تم حذف سجل التمويل بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteFundingRecord:', error)
      return false
    }
  }

  /**
   * حساب إجمالي التمويل لمستثمر
   */
  static async getTotalFunding(investorId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('funding_records')
        .select('amount')
        .eq('investor_id', investorId)
      
      if (error) {
        console.error('❌ خطأ في حساب إجمالي التمويل:', error)
        throw error
      }

      const total = data?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0
      console.log(`💰 إجمالي التمويل للمستثمر ${investorId}: ${total}`)
      return total
    } catch (error) {
      console.error('❌ خطأ في getTotalFunding:', error)
      return 0
    }
  }
}
