import { supabase } from '../DatabaseConnection'

/**
 * عمليات المستثمرين الأساسية
 */
export class InvestorOperations {
  /**
   * الحصول على جميع المستثمرين
   */
  static async getInvestors(): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب بيانات المستثمرين من Supabase...')
      
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب المستثمرين:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} مستثمر بنجاح`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getInvestors:', error)
      return []
    }
  }

  /**
   * إضافة مستثمر جديد
   */
  static async addInvestor(investor: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة مستثمر جديد:', investor.name)
      
      const { data, error } = await supabase
        .from('investors')
        .insert([investor])
        .select('id')
        .single()

      if (error) {
        console.error('❌ خطأ في إضافة المستثمر:', error)
        throw error
      }

      console.log('✅ تم إضافة المستثمر بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addInvestor:', error)
      return null
    }
  }

  /**
   * تحديث بيانات مستثمر
   */
  static async updateInvestor(investorId: number, updates: any): Promise<boolean> {
    try {
      console.log('📝 جاري تحديث المستثمر ID:', investorId)
      
      const { error } = await supabase
        .from('investors')
        .update(updates)
        .eq('id', investorId)

      if (error) {
        console.error('❌ خطأ في تحديث المستثمر:', error)
        throw error
      }

      console.log('✅ تم تحديث المستثمر بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updateInvestor:', error)
      return false
    }
  }

  /**
   * حذف مستثمر
   */
  static async deleteInvestor(investorId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف المستثمر ID:', investorId)
      
      const { error } = await supabase
        .from('investors')
        .delete()
        .eq('id', investorId)

      if (error) {
        console.error('❌ خطأ في حذف المستثمر:', error)
        throw error
      }

      console.log('✅ تم حذف المستثمر بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteInvestor:', error)
      return false
    }
  }

  /**
   * الحصول على مستثمر واحد بالمعرف
   */
  static async getInvestorById(investorId: number): Promise<any | null> {
    try {
      console.log('🔍 جاري جلب المستثمر ID:', investorId)
      
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('id', investorId)
        .single()

      if (error) {
        console.error('❌ خطأ في جلب المستثمر:', error)
        throw error
      }

      console.log('✅ تم جلب بيانات المستثمر بنجاح')
      return data
    } catch (error) {
      console.error('❌ خطأ في getInvestorById:', error)
      return null
    }
  }

  /**
   * حذف جميع المستثمرين (للمطورين فقط)
   */
  static async deleteAllInvestors(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع المستثمرين...')
      
      const { error } = await supabase
        .from('investors')
        .delete()
        .neq('id', 0)

      if (error) {
        console.error('❌ خطأ في حذف جميع المستثمرين:', error)
        throw error
      }

      console.log('✅ تم حذف جميع المستثمرين بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteAllInvestors:', error)
      return false
    }
  }

  /**
   * البحث في المستثمرين
   */
  static async searchInvestors(searchTerm: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث عن المستثمرين:', searchTerm)
      
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .or(`investorName.ilike.%${searchTerm}%,civilId.ilike.%${searchTerm}%,partnerName.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} مستثمر`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchInvestors:', error)
      return []
    }
  }
}
