// سكريبت حذف جميع البيانات من النظام
// يجب تشغيله بحذر - سيحذف جميع البيانات نهائياً!

import { createClient } from '@supabase/supabase-js'

// إعدادات Supabase
const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// دالة لحذف جميع البيانات
async function clearAllData() {
  console.log('🚨 بدء عملية حذف جميع البيانات...')
  console.log('⚠️  تحذير: هذه العملية لا يمكن التراجع عنها!')
  
  let totalDeleted = 0
  let errors = 0

  try {
    // 1. حذف المرفقات أولاً (إن وجدت)
    console.log('\n📎 حذف المرفقات...')
    try {
      const { data: attachments, error: fetchAttachmentsError } = await supabase
        .from('client_attachments')
        .select('id')
      
      if (fetchAttachmentsError) throw fetchAttachmentsError
      
      if (attachments && attachments.length > 0) {
        const { error: deleteAttachmentsError } = await supabase
          .from('client_attachments')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deleteAttachmentsError) throw deleteAttachmentsError
        console.log(`✅ تم حذف ${attachments.length} مرفق`)
        totalDeleted += attachments.length
      } else {
        console.log('ℹ️  لا توجد مرفقات للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف المرفقات:', error)
      errors++
    }

    // 2. حذف أتعاب المحاماة
    console.log('\n⚖️ حذف أتعاب المحاماة...')
    try {
      const { data: lawyerFees, error: fetchFeesError } = await supabase
        .from('lawyer_fees')
        .select('id')
      
      if (fetchFeesError) throw fetchFeesError
      
      if (lawyerFees && lawyerFees.length > 0) {
        const { error: deleteFeesError } = await supabase
          .from('lawyer_fees')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deleteFeesError) throw deleteFeesError
        console.log(`✅ تم حذف ${lawyerFees.length} سجل أتعاب محاماة`)
        totalDeleted += lawyerFees.length
      } else {
        console.log('ℹ️  لا توجد أتعاب محاماة للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف أتعاب المحاماة:', error)
      errors++
    }

    // 3. حذف المصروفات
    console.log('\n💸 حذف المصروفات...')
    try {
      const { data: expenses, error: fetchExpensesError } = await supabase
        .from('transaction_expenses')
        .select('id')
      
      if (fetchExpensesError) throw fetchExpensesError
      
      if (expenses && expenses.length > 0) {
        const { error: deleteExpensesError } = await supabase
          .from('transaction_expenses')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deleteExpensesError) throw deleteExpensesError
        console.log(`✅ تم حذف ${expenses.length} مصروف`)
        totalDeleted += expenses.length
      } else {
        console.log('ℹ️  لا توجد مصروفات للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف المصروفات:', error)
      errors++
    }

    // 4. حذف سجلات الدفعات
    console.log('\n💳 حذف سجلات الدفعات...')
    try {
      const { data: payments, error: fetchPaymentsError } = await supabase
        .from('payment_records')
        .select('id')
      
      if (fetchPaymentsError) throw fetchPaymentsError
      
      if (payments && payments.length > 0) {
        const { error: deletePaymentsError } = await supabase
          .from('payment_records')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deletePaymentsError) throw deletePaymentsError
        console.log(`✅ تم حذف ${payments.length} دفعة`)
        totalDeleted += payments.length
      } else {
        console.log('ℹ️  لا توجد دفعات للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف الدفعات:', error)
      errors++
    }

    // 5. حذف العملاء
    console.log('\n👤 حذف العملاء...')
    try {
      const { data: clients, error: fetchClientsError } = await supabase
        .from('clients')
        .select('id, name')
      
      if (fetchClientsError) throw fetchClientsError
      
      if (clients && clients.length > 0) {
        console.log(`📋 العملاء المراد حذفهم:`)
        clients.forEach((client, index) => {
          console.log(`   ${index + 1}. ${client.name || 'غير محدد'} (ID: ${client.id})`)
        })
        
        const { error: deleteClientsError } = await supabase
          .from('clients')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deleteClientsError) throw deleteClientsError
        console.log(`✅ تم حذف ${clients.length} عميل`)
        totalDeleted += clients.length
      } else {
        console.log('ℹ️  لا يوجد عملاء للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف العملاء:', error)
      errors++
    }

    // 6. حذف سحوبات الشريك
    console.log('\n💸 حذف سحوبات الشريك...')
    try {
      const { data: partnerWithdrawals, error: fetchPartnerError } = await supabase
        .from('partner_withdrawal_records')
        .select('id')
      
      if (fetchPartnerError) throw fetchPartnerError
      
      if (partnerWithdrawals && partnerWithdrawals.length > 0) {
        const { error: deletePartnerError } = await supabase
          .from('partner_withdrawal_records')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deletePartnerError) throw deletePartnerError
        console.log(`✅ تم حذف ${partnerWithdrawals.length} سحب شريك`)
        totalDeleted += partnerWithdrawals.length
      } else {
        console.log('ℹ️  لا توجد سحوبات شريك للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف سحوبات الشريك:', error)
      errors++
    }

    // 7. حذف سحوبات المستثمر
    console.log('\n💸 حذف سحوبات المستثمر...')
    try {
      const { data: withdrawals, error: fetchWithdrawalsError } = await supabase
        .from('withdrawal_records')
        .select('id')
      
      if (fetchWithdrawalsError) throw fetchWithdrawalsError
      
      if (withdrawals && withdrawals.length > 0) {
        const { error: deleteWithdrawalsError } = await supabase
          .from('withdrawal_records')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deleteWithdrawalsError) throw deleteWithdrawalsError
        console.log(`✅ تم حذف ${withdrawals.length} سحب مستثمر`)
        totalDeleted += withdrawals.length
      } else {
        console.log('ℹ️  لا توجد سحوبات مستثمر للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف سحوبات المستثمر:', error)
      errors++
    }

    // 8. حذف التمويل الفعلي
    console.log('\n💰 حذف التمويل الفعلي...')
    try {
      const { data: funding, error: fetchFundingError } = await supabase
        .from('funding_records')
        .select('id')
      
      if (fetchFundingError) throw fetchFundingError
      
      if (funding && funding.length > 0) {
        const { error: deleteFundingError } = await supabase
          .from('funding_records')
          .delete()
          .neq('id', 0) // حذف جميع السجلات
        
        if (deleteFundingError) throw deleteFundingError
        console.log(`✅ تم حذف ${funding.length} سجل تمويل فعلي`)
        totalDeleted += funding.length
      } else {
        console.log('ℹ️  لا يوجد تمويل فعلي للحذف')
      }
    } catch (error) {
      console.error('❌ خطأ في حذف التمويل الفعلي:', error)
      errors++
    }

    // 9. تنظيف localStorage
    console.log('\n🧹 تنظيف البيانات المحلية...')
    try {
      localStorage.removeItem('imported_funding_data')
      localStorage.removeItem('imported_investor_withdrawals')
      localStorage.removeItem('imported_partner_withdrawals')
      console.log('✅ تم تنظيف localStorage')
    } catch (error) {
      console.error('❌ خطأ في تنظيف localStorage:', error)
      errors++
    }

    // النتيجة النهائية
    console.log('\n🎉 تم الانتهاء من عملية الحذف!')
    console.log(`📊 إجمالي السجلات المحذوفة: ${totalDeleted}`)
    console.log(`❌ عدد الأخطاء: ${errors}`)
    
    if (errors === 0) {
      console.log('✅ تم حذف جميع البيانات بنجاح!')
      console.log('🚀 النظام جاهز الآن لاستيراد بيانات جديدة')
    } else {
      console.log('⚠️  تم الانتهاء مع وجود بعض الأخطاء')
    }

  } catch (error) {
    console.error('💥 خطأ عام في عملية الحذف:', error)
  }
}

// تشغيل السكريبت
clearAllData()
