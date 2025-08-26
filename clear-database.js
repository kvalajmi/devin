// سكريبت لحذف جميع العملاء من قاعدة البيانات Supabase
import { createClient } from '@supabase/supabase-js'

// تكوين Supabase (نفس البيانات من ملف supabase-simple.ts)
const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function clearAllData() {
  console.log('🔄 بدء حذف جميع البيانات من قاعدة البيانات...')
  
  try {
    // 1. حذف جميع سجلات الدفع (payment_records)
    console.log('🗑️ حذف جميع سجلات الدفع...')
    const { error: paymentsError } = await supabase
      .from('payment_records')
      .delete()
      .neq('id', 0) // حذف جميع السجلات
    
    if (paymentsError) {
      console.error('❌ خطأ في حذف سجلات الدفع:', paymentsError)
    } else {
      console.log('✅ تم حذف جميع سجلات الدفع')
    }

    // 2. حذف جميع المصروفات (transaction_expenses)
    console.log('🗑️ حذف جميع المصروفات...')
    const { error: expensesError } = await supabase
      .from('transaction_expenses')
      .delete()
      .neq('id', 0)
    
    if (expensesError) {
      console.error('❌ خطأ في حذف المصروفات:', expensesError)
    } else {
      console.log('✅ تم حذف جميع المصروفات')
    }

    // 3. حذف جميع أتعاب المحاماة (lawyer_fees)
    console.log('🗑️ حذف جميع أتعاب المحاماة...')
    const { error: feesError } = await supabase
      .from('lawyer_fees')
      .delete()
      .neq('id', 0)
    
    if (feesError) {
      console.error('❌ خطأ في حذف أتعاب المحاماة:', feesError)
    } else {
      console.log('✅ تم حذف جميع أتعاب المحاماة')
    }

    // 4. حذف جميع المرفقات (client_attachments)
    console.log('🗑️ حذف جميع المرفقات...')
    const { error: attachmentsError } = await supabase
      .from('client_attachments')
      .delete()
      .neq('id', 0)
    
    if (attachmentsError) {
      console.error('❌ خطأ في حذف المرفقات:', attachmentsError)
    } else {
      console.log('✅ تم حذف جميع المرفقات')
    }

    // 5. حذف جميع العملاء (clients) - هذا يجب أن يكون الأخير
    console.log('🗑️ حذف جميع العملاء...')
    const { error: clientsError } = await supabase
      .from('clients')
      .delete()
      .neq('id', 0)
    
    if (clientsError) {
      console.error('❌ خطأ في حذف العملاء:', clientsError)
    } else {
      console.log('✅ تم حذف جميع العملاء')
    }

    console.log('🎉 تم حذف جميع البيانات بنجاح!')
    console.log('💡 يمكنك الآن إضافة العملاء الجدد والبيانات الحقيقية')
    
  } catch (error) {
    console.error('❌ خطأ عام في حذف البيانات:', error)
  }
}

// تشغيل السكريبت
clearAllData()
