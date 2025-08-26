import { supabase } from '../DatabaseConnection'

/**
 * خدمة إدارة أتعاب المحامي
 */
export class LawyerFeesService {
  /**
   * جلب جميع أتعاب المحامي
   */
  static async getLawyerFees(clientId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب بيانات أتعاب المحامي...')
      
      let query = supabase.from('lawyer_fees').select('*')
      
      if (clientId) {
        query = query.eq('client_id', clientId)
      }
      
      const { data, error } = await query.order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب أتعاب المحامي:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} أتعاب محامي بنجاح`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getLawyerFees:', error)
      return []
    }
  }

  /**
   * إضافة أتعاب محامي جديدة
   */
  static async addLawyerFee(fee: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة أتعاب محامي جديدة للعميل ID:', fee.client_id)
      
      const { data, error } = await supabase
        .from('lawyer_fees')
        .insert([fee])
        .select('id')
        .single()

      if (error) {
        console.error('❌ خطأ في إضافة أتعاب المحامي:', error)
        throw error
      }

      console.log('✅ تم إضافة أتعاب المحامي بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addLawyerFee:', error)
      return null
    }
  }

  /**
   * تحديث أتعاب المحامي
   */
  static async updateLawyerFee(feeId: number, updates: any): Promise<boolean> {
    try {
      console.log('📝 جاري تحديث أتعاب المحامي ID:', feeId)
      
      const { error } = await supabase
        .from('lawyer_fees')
        .update(updates)
        .eq('id', feeId)

      if (error) {
        console.error('❌ خطأ في تحديث أتعاب المحامي:', error)
        throw error
      }

      console.log('✅ تم تحديث أتعاب المحامي بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updateLawyerFee:', error)
      return false
    }
  }

  /**
   * حذف أتعاب المحامي
   */
  static async deleteLawyerFee(feeId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف أتعاب المحامي ID:', feeId)
      
      const { error } = await supabase
        .from('lawyer_fees')
        .delete()
        .eq('id', feeId)

      if (error) {
        console.error('❌ خطأ في حذف أتعاب المحامي:', error)
        throw error
      }

      console.log('✅ تم حذف أتعاب المحامي بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteLawyerFee:', error)
      return false
    }
  }

  /**
   * البحث في أتعاب المحامي
   */
  static async searchLawyerFees(searchTerm: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث في أتعاب المحامي:', searchTerm)
      
      const { data, error } = await supabase
        .from('lawyer_fees')
        .select('*, clients(name, civil_id)')
                  .or(`description.ilike.%${searchTerm}%`)
          .order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} أتعاب`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchLawyerFees:', error)
      return []
    }
  }

  /**
   * حذف جميع أتعاب المحامي (للمطورين فقط)
   */
  static async deleteAllLawyerFees(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع أتعاب المحامي...')
      
      const { error } = await supabase
        .from('lawyer_fees')
        .delete()
        .neq('id', 0)

      if (error) {
        console.error('❌ خطأ في حذف جميع أتعاب المحامي:', error)
        throw error
      }

      console.log('✅ تم حذف جميع أتعاب المحامي بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteAllLawyerFees:', error)
      return false
    }
  }
}
