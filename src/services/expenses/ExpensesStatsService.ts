import { supabase } from '../DatabaseConnection'

/**
 * خدمة إحصائيات المصروفات والأتعاب
 */
export class ExpensesStatsService {
  /**
   * حساب إحصائيات المصروفات والأتعاب
   */
  static async getExpensesStats(clientId?: number): Promise<any> {
    try {
      console.log('📊 جاري حساب إحصائيات المصروفات...')
      
      let expensesQuery = supabase.from('transaction_expenses').select('amount, date')
      let feesQuery = supabase.from('lawyer_fees').select('amount, date')
      
      if (clientId) {
        expensesQuery = expensesQuery.eq('client_id', clientId)
        feesQuery = feesQuery.eq('client_id', clientId)
      }
      
      const [expensesResult, feesResult] = await Promise.all([
        expensesQuery,
        feesQuery
      ])

      if (expensesResult.error) throw expensesResult.error
      if (feesResult.error) throw feesResult.error

      const expenses = expensesResult.data || []
      const fees = feesResult.data || []

      const stats = {
        totalExpenses: expenses.length,
        totalExpensesAmount: expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0),
        totalLawyerFees: fees.length,
        totalLawyerFeesAmount: fees.reduce((sum: number, fee: any) => sum + fee.amount, 0),
        totalOverallAmount: expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0) + 
                           fees.reduce((sum: number, fee: any) => sum + fee.amount, 0)
      }

      console.log('✅ إحصائيات المصروفات:', stats)
      return stats
    } catch (error) {
      console.error('❌ خطأ في getExpensesStats:', error)
      return {
        totalExpenses: 0,
        totalExpensesAmount: 0,
        totalLawyerFees: 0,
        totalLawyerFeesAmount: 0,
        totalOverallAmount: 0
      }
    }
  }

  /**
   * البحث الشامل في المصروفات والأتعاب
   */
  static async searchExpenses(searchTerm: string): Promise<{ expenses: any[], fees: any[] }> {
    try {
      console.log('🔍 جاري البحث في المصروفات والأتعاب:', searchTerm)
      
      const [expensesResult, feesResult] = await Promise.all([
        supabase
          .from('transaction_expenses')
          .select('*, clients(name, civil_id)')
          .or(`description.ilike.%${searchTerm}%`)
          .order('date', { ascending: false }),
        
        supabase
          .from('lawyer_fees')
          .select('*, clients(name, civil_id)')
          .or(`description.ilike.%${searchTerm}%`)
          .order('date', { ascending: false })
      ])

      if (expensesResult.error) throw expensesResult.error
      if (feesResult.error) throw feesResult.error

      console.log(`✅ تم العثور على ${expensesResult.data?.length || 0} مصروف و ${feesResult.data?.length || 0} أتعاب`)
      
      return {
        expenses: expensesResult.data || [],
        fees: feesResult.data || []
      }
    } catch (error) {
      console.error('❌ خطأ في searchExpenses:', error)
      return { expenses: [], fees: [] }
    }
  }

  /**
   * إحصائيات متقدمة للمصروفات
   */
  static async getAdvancedExpensesStats(clientId?: number): Promise<any> {
    try {
      console.log('📊 جاري حساب الإحصائيات المتقدمة...')
      
      const basicStats = await this.getExpensesStats(clientId)
      
      // حساب متوسط المصروفات الشهرية
      let expensesQuery = supabase
        .from('transaction_expenses')
        .select('amount, date, description')
      
      let feesQuery = supabase
        .from('lawyer_fees')
        .select('amount, date, description')
      
      if (clientId) {
        expensesQuery = expensesQuery.eq('client_id', clientId)
        feesQuery = feesQuery.eq('client_id', clientId)
      }

      const [expensesResult, feesResult] = await Promise.all([
        expensesQuery,
        feesQuery
      ])

      if (expensesResult.error) throw expensesResult.error
      if (feesResult.error) throw feesResult.error

      const expenses = expensesResult.data || []
      const fees = feesResult.data || []

      // حساب الإحصائيات المتقدمة
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const thisMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date)
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
      })

      const thisMonthFees = fees.filter(fee => {
        const feeDate = new Date(fee.date)
        return feeDate.getMonth() === currentMonth && feeDate.getFullYear() === currentYear
      })

      const advancedStats = {
        ...basicStats,
        thisMonthExpenses: thisMonthExpenses.length,
        thisMonthExpensesAmount: thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        thisMonthFees: thisMonthFees.length,
        thisMonthFeesAmount: thisMonthFees.reduce((sum, fee) => sum + fee.amount, 0),
        averageExpenseAmount: expenses.length > 0 ? basicStats.totalExpensesAmount / expenses.length : 0,
        averageFeeAmount: fees.length > 0 ? basicStats.totalLawyerFeesAmount / fees.length : 0
      }

      console.log('✅ الإحصائيات المتقدمة:', advancedStats)
      return advancedStats
    } catch (error) {
      console.error('❌ خطأ في getAdvancedExpensesStats:', error)
      return await this.getExpensesStats(clientId)
    }
  }
}
