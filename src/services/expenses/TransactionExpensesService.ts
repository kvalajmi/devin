import { supabase } from '../DatabaseConnection'

/**
 * خدمة إدارة المصروفات
 */
export class TransactionExpensesService {
  /**
   * جلب جميع المصروفات
   */
  static async getTransactionExpenses(clientId?: number): Promise<any[]> {
    try {
      console.log('🔍 جاري جلب بيانات المصروفات...')
      
      let query = supabase.from('transaction_expenses').select('*')
      
      if (clientId) {
        query = query.eq('client_id', clientId)
      }
      
      const { data, error } = await query.order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في جلب المصروفات:', error)
        throw error
      }

      console.log(`✅ تم جلب ${data?.length || 0} مصروف بنجاح`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في getTransactionExpenses:', error)
      return []
    }
  }

  /**
   * إضافة مصروف جديد
   */
  static async addTransactionExpense(expense: any): Promise<number | null> {
    try {
      console.log('➕ جاري إضافة مصروف جديد للعميل ID:', expense.client_id)
      
      const { data, error } = await supabase
        .from('transaction_expenses')
        .insert([expense])
        .select('id')
        .single()

      if (error) {
        console.error('❌ خطأ في إضافة المصروف:', error)
        throw error
      }

      console.log('✅ تم إضافة المصروف بنجاح، ID:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ خطأ في addTransactionExpense:', error)
      return null
    }
  }

  /**
   * تحديث مصروف موجود
   */
  static async updateTransactionExpense(expenseId: number, updates: any): Promise<boolean> {
    try {
      console.log('📝 جاري تحديث المصروف ID:', expenseId)
      
      const { error } = await supabase
        .from('transaction_expenses')
        .update(updates)
        .eq('id', expenseId)

      if (error) {
        console.error('❌ خطأ في تحديث المصروف:', error)
        throw error
      }

      console.log('✅ تم تحديث المصروف بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في updateTransactionExpense:', error)
      return false
    }
  }

  /**
   * حذف مصروف
   */
  static async deleteTransactionExpense(expenseId: number): Promise<boolean> {
    try {
      console.log('🗑️ جاري حذف المصروف ID:', expenseId)
      
      const { error } = await supabase
        .from('transaction_expenses')
        .delete()
        .eq('id', expenseId)

      if (error) {
        console.error('❌ خطأ في حذف المصروف:', error)
        throw error
      }

      console.log('✅ تم حذف المصروف بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteTransactionExpense:', error)
      return false
    }
  }

  /**
   * البحث في المصروفات
   */
  static async searchTransactionExpenses(searchTerm: string): Promise<any[]> {
    try {
      console.log('🔍 جاري البحث في المصروفات:', searchTerm)
      
      const { data, error } = await supabase
        .from('transaction_expenses')
        .select('*, clients(name, civil_id)')
                  .or(`description.ilike.%${searchTerm}%`)
          .order('date', { ascending: false })

      if (error) {
        console.error('❌ خطأ في البحث:', error)
        throw error
      }

      console.log(`✅ تم العثور على ${data?.length || 0} مصروف`)
      return data || []
    } catch (error) {
      console.error('❌ خطأ في searchTransactionExpenses:', error)
      return []
    }
  }

  /**
   * حذف جميع المصروفات (للمطورين فقط)
   */
  static async deleteAllTransactionExpenses(): Promise<boolean> {
    try {
      console.log('⚠️ جاري حذف جميع المصروفات...')
      
      const { error } = await supabase
        .from('transaction_expenses')
        .delete()
        .neq('id', 0)

      if (error) {
        console.error('❌ خطأ في حذف جميع المصروفات:', error)
        throw error
      }

      console.log('✅ تم حذف جميع المصروفات بنجاح')
      return true
    } catch (error) {
      console.error('❌ خطأ في deleteAllTransactionExpenses:', error)
      return false
    }
  }
}
