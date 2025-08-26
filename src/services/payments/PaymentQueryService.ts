import { supabase } from '../DatabaseConnection'

/**
 * خدمة البحث والاستعلامات المتقدمة للمدفوعات
 */
export class PaymentQueryService {
  /**
   * جلب المدفوعات في فترة زمنية محددة
   */
  static async getPaymentsByDateRange(startDate: string, endDate: string, clientId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب المدفوعات من', startDate, 'إلى', endDate)
      
      let query = supabase
        .from('payment_records')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
      
      if (clientId) {
        query = query.eq('client_id', clientId)
      }
      
      const { data, error } = await query.order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب المدفوعات:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} مدفوعة في الفترة المحددة`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getPaymentsByDateRange:', error)
      return []
    }
  }

  /**
   * البحث في المدفوعات
   */
  static async searchPayments(searchTerm: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث في المدفوعات:', searchTerm)
      
      const { data, error } = await supabase
        .from('payment_records')
        .select('*, clients(name, civil_id)')
        .or(`notes.ilike.%${searchTerm}%,entry_user.ilike.%${searchTerm}%`)
        .order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} مدفوعة`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchPayments:', error)
      return []
    }
  }

  /**
   * البحث المتقدم في المدفوعات مع فلاتر متعددة
   */
  static async advancedSearchPayments(filters: {
    searchTerm?: string
    clientId?: number
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
  }): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث المتقدم في المدفوعات:', filters)
      
      let query = supabase
        .from('payment_records')
        .select('*, clients(name, civil_id)')

      // تطبيق الفلاتر
      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId)
      }

      if (filters.startDate) {
        query = query.gte('date', filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate)
      }

      if (filters.minAmount) {
        query = query.gte('amount', filters.minAmount)
      }

      if (filters.maxAmount) {
        query = query.lte('amount', filters.maxAmount)
      }

      if (filters.searchTerm) {
        query = query.or(`notes.ilike.%${filters.searchTerm}%,entry_user.ilike.%${filters.searchTerm}%`)
      }

      const { data, error } = await query.order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث المتقدم:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} مدفوعة في البحث المتقدم`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في advancedSearchPayments:', error)
      return []
    }
  }

  /**
   * جلب أحدث المدفوعات
   */
  static async getRecentPayments(limit: number = 10, clientId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب أحدث المدفوعات...')
      
      let query = supabase
        .from('payment_records')
        .select('*, clients(name, civil_id)')

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query
        .order('date', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('❌ خطأ في جلب أحدث المدفوعات:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} من أحدث المدفوعات`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getRecentPayments:', error)
      return []
    }
  }

  /**
   * جلب المدفوعات حسب المبلغ (أعلى/أقل)
   */
  static async getPaymentsByAmount(orderBy: 'highest' | 'lowest' = 'highest', limit: number = 10): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب المدفوعات حسب المبلغ...')
      
      const { data, error } = await supabase
        .from('payment_records')
        .select('*, clients(name, civil_id)')
        .order('amount', { ascending: orderBy === 'lowest' })
        .limit(limit)

      if (error) {
        console.error('❌ خطأ في جلب المدفوعات حسب المبلغ:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} مدفوعة حسب المبلغ (${orderBy})`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getPaymentsByAmount:', error)
      return []
    }
  }
}
