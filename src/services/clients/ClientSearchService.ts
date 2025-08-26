import { supabase } from '../DatabaseConnection'

/**
 * خدمة البحث في العملاء
 */
export class ClientSearchService {
  /**
   * البحث عن عميل بالاسم أو الرقم المدني أو رقم الهاتف
   */
  static async searchClients(searchTerm: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث عن العملاء:', searchTerm)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,civil_id.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} عميل`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchClients:', error)
      return []
    }
  }

  /**
   * البحث المتقدم في العملاء مع فلاتر متعددة
   */
  static async advancedSearchClients(filters: {
    searchTerm?: string
    governorate?: string
    area?: string
    minLoanAmount?: number
    maxLoanAmount?: number
    pensionDateFrom?: string
    pensionDateTo?: string
  }): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث المتقدم في العملاء:', filters)
      
      let query = supabase.from('clients').select('*')

      // تطبيق الفلاتر
      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,civil_id.ilike.%${filters.searchTerm}%,phone_number.ilike.%${filters.searchTerm}%`)
      }

      if (filters.governorate) {
        query = query.eq('governorate', filters.governorate)
      }

      if (filters.area) {
        query = query.eq('area', filters.area)
      }

      if (filters.minLoanAmount) {
        query = query.gte('loan_amount', filters.minLoanAmount)
      }

      if (filters.maxLoanAmount) {
        query = query.lte('loan_amount', filters.maxLoanAmount)
      }

      if (filters.pensionDateFrom) {
        query = query.gte('pension_date', filters.pensionDateFrom)
      }

      if (filters.pensionDateTo) {
        query = query.lte('pension_date', filters.pensionDateTo)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث المتقدم:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} عميل في البحث المتقدم`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في advancedSearchClients:', error)
      return []
    }
  }

  /**
   * البحث عن العملاء بالرقم المدني
   */
  static async searchClientsByCivilId(civilId: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث بالرقم المدني:', civilId)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .ilike('civil_id', `%${civilId}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث بالرقم المدني:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} عميل بالرقم المدني`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchClientsByCivilId:', error)
      return []
    }
  }

  /**
   * البحث عن العملاء بالاسم
   */
  static async searchClientsByName(name: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث بالاسم:', name)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .ilike('name', `%${name}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث بالاسم:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} عميل بالاسم`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchClientsByName:', error)
      return []
    }
  }

  /**
   * جلب العملاء حسب المحافظة
   */
  static async getClientsByGovernorate(governorate: string): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب العملاء من محافظة:', governorate)
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('governorate', governorate)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب العملاء بالمحافظة:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} عميل من المحافظة`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getClientsByGovernorate:', error)
      return []
    }
  }
}
