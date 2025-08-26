import { supabase } from '../../services/DatabaseConnection'

/**
 * أداة إصلاح ربط العملاء بالمستثمرين
 * تقوم بتحديث جميع العملاء الموجودين لربطهم بالمستثمر الأول
 */
export class FixInvestorClientLinkage {
  /**
   * إصلاح ربط العملاء بالمستثمرين
   */
  static async fixClientInvestorLinkage(): Promise<{
    success: boolean
    message: string
    updatedCount: number
  }> {
    try {
      console.log('🔧 بدء إصلاح ربط العملاء بالمستثمرين...')

      const { data: investors, error: investorsError } = await supabase
        .from('investors')
        .select('id')
        .order('id', { ascending: true })

      if (investorsError) {
        throw investorsError
      }

      if (!investors || investors.length === 0) {
        return {
          success: false,
          message: 'لا توجد مستثمرين في النظام',
          updatedCount: 0
        }
      }

      const firstInvestorId = investors[0].id
      console.log(`📋 سيتم ربط العملاء بالمستثمر ID: ${firstInvestorId}`)

      const { data: unlinkedClients, error: clientsError } = await supabase
        .from('clients')
        .select('id, name')
        .is('investor_id', null)

      if (clientsError) {
        throw clientsError
      }

      if (!unlinkedClients || unlinkedClients.length === 0) {
        return {
          success: true,
          message: 'جميع العملاء مرتبطين بالفعل بمستثمرين',
          updatedCount: 0
        }
      }

      console.log(`📊 تم العثور على ${unlinkedClients.length} عميل غير مرتبط`)

      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          investor_id: firstInvestorId,
          loan_code: null // سيتم تعيين كود القرض لاحقاً
        })
        .is('investor_id', null)

      if (updateError) {
        throw updateError
      }

      const { data: updatedClients, error: fetchError } = await supabase
        .from('clients')
        .select('id')
        .eq('investor_id', firstInvestorId)
        .is('loan_code', null)

      if (fetchError) {
        throw fetchError
      }

      if (updatedClients && updatedClients.length > 0) {
        for (let i = 0; i < updatedClients.length; i++) {
          const client = updatedClients[i]
          const loanCode = String(i + 1).padStart(5, '0') // 00001, 00002, etc.
          
          await supabase
            .from('clients')
            .update({ loan_code: loanCode })
            .eq('id', client.id)
        }
      }

      console.log(`✅ تم تحديث ${unlinkedClients.length} عميل بنجاح`)

      return {
        success: true,
        message: `تم ربط ${unlinkedClients.length} عميل بالمستثمر بنجاح`,
        updatedCount: unlinkedClients.length
      }

    } catch (error) {
      console.error('❌ خطأ في إصلاح ربط العملاء:', error)
      return {
        success: false,
        message: `حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        updatedCount: 0
      }
    }
  }

  /**
   * التحقق من حالة ربط العملاء
   */
  static async checkLinkageStatus(): Promise<{
    totalClients: number
    linkedClients: number
    unlinkedClients: number
    investors: number
  }> {
    try {
      const [clientsResult, investorsResult] = await Promise.all([
        supabase.from('clients').select('id, investor_id'),
        supabase.from('investors').select('id')
      ])

      const clients = clientsResult.data || []
      const investors = investorsResult.data || []

      const linkedClients = clients.filter(c => c.investor_id !== null).length
      const unlinkedClients = clients.filter(c => c.investor_id === null).length

      return {
        totalClients: clients.length,
        linkedClients,
        unlinkedClients,
        investors: investors.length
      }
    } catch (error) {
      console.error('❌ خطأ في فحص حالة الربط:', error)
      return {
        totalClients: 0,
        linkedClients: 0,
        unlinkedClients: 0,
        investors: 0
      }
    }
  }
}
