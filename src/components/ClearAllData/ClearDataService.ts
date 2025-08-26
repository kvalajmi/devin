// استخدام العميل الموحد بدلاً من إنشاء عميل منفصل
import { supabase } from '../../services/DatabaseConnection'

export interface ClearDataProgress {
  progress: number
  currentStep: string
  results: string[]
}

export type ProgressCallback = (progress: ClearDataProgress) => void

/**
 * خدمة حذف جميع البيانات من Supabase
 */
export class ClearDataService {
  /**
   * حذف جميع البيانات مع تتبع التقدم
   */
  static async clearAllData(onProgress: ProgressCallback): Promise<void> {
    const results: string[] = []
    let progress = 0
    const totalSteps = 6

    const updateProgress = (step: string, increment: number = 0) => {
      if (increment > 0) progress += increment
      onProgress({
        progress: Math.min(progress, 100),
        currentStep: step,
        results: [...results]
      })
    }

    try {
      results.push('🚀 بدء عملية حذف جميع البيانات...')
      updateProgress('بدء عملية الحذف...', 0)

      // 1. حذف سجلات الدفع
      updateProgress('حذف سجلات الدفع...', 0)
      const { error: paymentError } = await supabase
        .from('payment_records')
        .delete()
        .neq('id', 0)

      if (paymentError) {
        results.push(`❌ خطأ في حذف سجلات الدفع: ${paymentError.message}`)
      } else {
        results.push('✅ تم حذف جميع سجلات الدفع بنجاح')
      }
      updateProgress('تم حذف سجلات الدفع', 100 / totalSteps)

      // 2. حذف مصروفات المعاملات
      updateProgress('حذف مصروفات المعاملات...', 0)
      const { error: expenseError } = await supabase
        .from('transaction_expenses')
        .delete()
        .neq('id', 0)

      if (expenseError) {
        results.push(`❌ خطأ في حذف مصروفات المعاملات: ${expenseError.message}`)
      } else {
        results.push('✅ تم حذف جميع مصروفات المعاملات بنجاح')
      }
      updateProgress('تم حذف مصروفات المعاملات', 100 / totalSteps)

      // 3. حذف أتعاب المحاماة
      updateProgress('حذف أتعاب المحاماة...', 0)
      const { error: lawyerError } = await supabase
        .from('lawyer_fees')
        .delete()
        .neq('id', 0)

      if (lawyerError) {
        results.push(`❌ خطأ في حذف أتعاب المحاماة: ${lawyerError.message}`)
      } else {
        results.push('✅ تم حذف جميع أتعاب المحاماة بنجاح')
      }
      updateProgress('تم حذف أتعاب المحاماة', 100 / totalSteps)

      // 4. حذف العملاء
      updateProgress('حذف العملاء...', 0)
      const { error: clientError } = await supabase
        .from('clients')
        .delete()
        .neq('id', 0)

      if (clientError) {
        results.push(`❌ خطأ في حذف العملاء: ${clientError.message}`)
      } else {
        results.push('✅ تم حذف جميع العملاء بنجاح')
      }
      updateProgress('تم حذف العملاء', 100 / totalSteps)

      // 5. حذف سجلات السحوبات
      updateProgress('حذف سجلات السحوبات...', 0)
      const withdrawalPromises = [
        supabase.from('withdrawal_records').delete().neq('id', 0),
        supabase.from('partner_withdrawal_records').delete().neq('id', 0)
      ]

      const withdrawalResults = await Promise.allSettled(withdrawalPromises)
      withdrawalResults.forEach((result, index) => {
        const tableName = index === 0 ? 'سحوبات المستثمرين' : 'سحوبات الشركاء'
        if (result.status === 'fulfilled' && !result.value.error) {
          results.push(`✅ تم حذف جميع ${tableName} بنجاح`)
        } else {
          const error = result.status === 'rejected' ? result.reason : result.value.error
          results.push(`❌ خطأ في حذف ${tableName}: ${error.message}`)
        }
      })
      updateProgress('تم حذف سجلات السحوبات', 100 / totalSteps)

      // 6. حذف سجلات التمويل
      updateProgress('حذف سجلات التمويل...', 0)
      const { error: fundingError } = await supabase
        .from('funding_records')
        .delete()
        .neq('id', 0)

      if (fundingError) {
        results.push(`❌ خطأ في حذف سجلات التمويل: ${fundingError.message}`)
      } else {
        results.push('✅ تم حذف جميع سجلات التمويل بنجاح')
      }
      updateProgress('تم حذف سجلات التمويل', 100 / totalSteps)

      results.push('🎉 تمت عملية حذف جميع البيانات بنجاح!')
      updateProgress('اكتملت عملية الحذف', 0)

    } catch (error) {
      results.push(`❌ خطأ عام في عملية الحذف: ${error}`)
      updateProgress('حدث خطأ في عملية الحذف', 0)
      throw error
    }
  }

  /**
   * التحقق من حالة قاعدة البيانات
   */
  static async getDatabaseStatus(): Promise<Record<string, number>> {
    const tables = [
      'clients',
      'payment_records',
      'transaction_expenses',
      'lawyer_fees',
      'funding_records',
      'withdrawal_records',
      'partner_withdrawal_records'
    ]

    const status: Record<string, number> = {}

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.error(`خطأ في جلب عدد سجلات ${table}:`, error)
          status[table] = -1
        } else {
          status[table] = count || 0
        }
      } catch (error) {
        console.error(`خطأ في الاتصال بجدول ${table}:`, error)
        status[table] = -1
      }
    }

    return status
  }

  /**
   * تقدير الوقت المطلوب للحذف
   */
  static async estimateClearTime(): Promise<number> {
    const status = await this.getDatabaseStatus()
    const totalRecords = Object.values(status).reduce((sum, count) => sum + Math.max(count, 0), 0)
    
    // تقدير: 100 سجل في الثانية
    return Math.max(totalRecords / 100, 5) // على الأقل 5 ثوان
  }
}
