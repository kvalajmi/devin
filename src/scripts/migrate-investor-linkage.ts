import { supabase } from '../services/DatabaseConnection'

/**
 * سكريبت مباشر لإصلاح ربط العملاء بالمستثمرين
 */
async function migrateInvestorLinkage() {
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
      console.error('❌ لا توجد مستثمرين في النظام')
      return
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
      console.log('✅ جميع العملاء مرتبطين بالفعل بمستثمرين')
      return
    }

    console.log(`📊 تم العثور على ${unlinkedClients.length} عميل غير مرتبط`)

    const { error: updateError } = await supabase
      .from('clients')
      .update({ investor_id: firstInvestorId })
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
        const loanCode = String(i + 1).padStart(5, '0')
        
        await supabase
          .from('clients')
          .update({ loan_code: loanCode })
          .eq('id', client.id)
      }
    }

    console.log(`✅ تم تحديث ${unlinkedClients.length} عميل بنجاح`)
    console.log('🎉 تم إصلاح ربط العملاء بالمستثمرين بنجاح!')

  } catch (error) {
    console.error('❌ خطأ في إصلاح ربط العملاء:', error)
  }
}

migrateInvestorLinkage()
