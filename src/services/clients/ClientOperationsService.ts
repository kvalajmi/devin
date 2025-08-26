import { supabase } from '../DatabaseConnection'

/**
 * خدمة العمليات الأساسية للعملاء
 */
export class ClientOperationsService {
  /**
   * جلب جميع العملاء
   */
  static async getClients(): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب بيانات العملاء من Supabase...')
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب العملاء:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} عميل بنجاح`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getClients:', error)
      return []
    }
  }

  /**
   * جلب عميل واحد بالمعرف
   */
  static async getClientById(clientId: number): Promise<any | null> {
    try {
      console.log('🔍 جاري جلب العميل ID:', clientId)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()

      if (error) {
        console.error('❌ خطأ في جلب العميل:', error)
        throw error
      }

      console.log('✅ تم جلب بيانات العميل بنجاح')
      return data
    } catch (error) {
      console.error('❌ خطأ في getClientById:', error)
      return null
    }
  }

  /**
   * إضافة عميل جديد
   */
  static async addClient(client: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة عميل جديد:', client.name)
      
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select('id')
        .single()

      if (error) {
        console.error('❌ خطأ في إضافة العميل:', error)
        throw error
      }

      console.log('✅ تم إضافة العميل بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addClient:', error)
      return null
    }
  }

  /**
   * تحديث بيانات عميل
   */
  static async updateClient(clientId: number, updates: any): Promise<boolean> {
    try {
      console.log('📝 جاري تحديث العميل ID:', clientId)
      
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)

      if (error) {
        console.error('❌ خطأ في تحديث العميل:', error)
        throw error
      }

      console.log('✅ تم تحديث العميل بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updateClient:', error)
      return false
    }
  }

  /**
   * حذف عميل
   */
  static async deleteClient(clientId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف العميل ID:', clientId)
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) {
        console.error('❌ خطأ في حذف العميل:', error)
        throw error
      }

      console.log('✅ تم حذف العميل بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteClient:', error)
      return false
    }
  }

  /**
   * حذف جميع العملاء (للمطورين فقط)
   */
  static async deleteAllClients(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع العملاء...')
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .neq('id', 0) // حذف جميع السجلات

      if (error) {
        console.error('❌ خطأ في حذف جميع العملاء:', error)
        throw error
      }

      console.log('✅ تم حذف جميع العملاء بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteAllClients:', error)
      return false
    }
  }
}
