// سكريبت شامل لحذف جميع بيانات العملاء وإعادة البداية من الصفر
import { createClient } from '@supabase/supabase-js'

// تكوين Supabase
const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createBackup() {
  console.log('💾 إنشاء نسخة احتياطية من البيانات الحالية...')
  
  try {
    // جلب جميع البيانات الحالية
    const [clients, payments, expenses, fees, attachments] = await Promise.all([
      supabase.from('clients').select('*'),
      supabase.from('payment_records').select('*'),
      supabase.from('transaction_expenses').select('*'),
      supabase.from('lawyer_fees').select('*'),
      supabase.from('client_attachments').select('*')
    ])
    
    const backupData = {
      timestamp: new Date().toISOString(),
      clients: clients.data || [],
      payment_records: payments.data || [],
      transaction_expenses: expenses.data || [],
      lawyer_fees: fees.data || [],
      client_attachments: attachments.data || []
    }
    
    // حفظ النسخة الاحتياطية في ملف JSON
    const fs = await import('fs')
    const backupFileName = `backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
    
    fs.writeFileSync(backupFileName, JSON.stringify(backupData, null, 2), 'utf8')
    
    console.log(`✅ تم إنشاء نسخة احتياطية: ${backupFileName}`)
    console.log(`📊 إحصائيات النسخة الاحتياطية:`)
    console.log(`   - العملاء: ${backupData.clients.length}`)
    console.log(`   - سجلات الدفع: ${backupData.payment_records.length}`)
    console.log(`   - المصاريف: ${backupData.transaction_expenses.length}`)
    console.log(`   - أتعاب المحاماة: ${backupData.lawyer_fees.length}`)
    console.log(`   - المرفقات: ${backupData.client_attachments.length}`)
    
    return backupFileName
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء النسخة الاحتياطية:', error)
    throw error
  }
}

async function completeReset() {
  console.log('🔄 بدء عملية الحذف الشامل لجميع بيانات العملاء...')
  
  try {
    // 1. حذف جميع المرفقات (client_attachments)
    console.log('🗑️ حذف جميع المرفقات...')
    const { error: attachmentsError } = await supabase
      .from('client_attachments')
      .delete()
      .neq('id', 0) // حذف جميع السجلات
    
    if (attachmentsError) {
      console.error('❌ خطأ في حذف المرفقات:', attachmentsError)
    } else {
      console.log('✅ تم حذف جميع المرفقات')
    }

    // 2. حذف جميع أتعاب المحاماة (lawyer_fees)
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

    // 3. حذف جميع المصروفات (transaction_expenses)
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

    // 4. حذف جميع سجلات الدفع (payment_records)
    console.log('🗑️ حذف جميع سجلات الدفع...')
    const { error: paymentsError } = await supabase
      .from('payment_records')
      .delete()
      .neq('id', 0)
    
    if (paymentsError) {
      console.error('❌ خطأ في حذف سجلات الدفع:', paymentsError)
    } else {
      console.log('✅ تم حذف جميع سجلات الدفع')
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

    console.log('🎉 تم الحذف الشامل بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ عام في الحذف الشامل:', error)
    throw error
  }
}

async function verifyCleanDatabase() {
  console.log('🔍 التحقق من نظافة قاعدة البيانات...')
  
  try {
    const [clients, payments, expenses, fees, attachments] = await Promise.all([
      supabase.from('clients').select('*'),
      supabase.from('payment_records').select('*'),
      supabase.from('transaction_expenses').select('*'),
      supabase.from('lawyer_fees').select('*'),
      supabase.from('client_attachments').select('*')
    ])
    
    console.log('📊 إحصائيات قاعدة البيانات بعد التنظيف:')
    console.log(`   - العملاء: ${clients.data?.length || 0}`)
    console.log(`   - سجلات الدفع: ${payments.data?.length || 0}`)
    console.log(`   - المصاريف: ${expenses.data?.length || 0}`)
    console.log(`   - أتعاب المحاماة: ${fees.data?.length || 0}`)
    console.log(`   - المرفقات: ${attachments.data?.length || 0}`)
    
    const allEmpty = [clients, payments, expenses, fees, attachments].every(
      result => !result.data || result.data.length === 0
    )
    
    if (allEmpty) {
      console.log('✅ قاعدة البيانات نظيفة ومستعدة للاستيراد الجديد')
      return true
    } else {
      console.log('⚠️ قاعدة البيانات لا تزال تحتوي على بيانات')
      return false
    }
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من قاعدة البيانات:', error)
    return false
  }
}

async function resetSequences() {
  console.log('🔄 إعادة تعيين تسلسل الأرقام التلقائية...')
  
  try {
    // إعادة تعيين تسلسل الأرقام في PostgreSQL
    const resetQueries = [
      "ALTER SEQUENCE clients_id_seq RESTART WITH 1;",
      "ALTER SEQUENCE payment_records_id_seq RESTART WITH 1;",
      "ALTER SEQUENCE transaction_expenses_id_seq RESTART WITH 1;",
      "ALTER SEQUENCE lawyer_fees_id_seq RESTART WITH 1;",
      "ALTER SEQUENCE client_attachments_id_seq RESTART WITH 1;"
    ]
    
    for (const query of resetQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.warn(`⚠️ تحذير في إعادة تعيين التسلسل: ${error.message}`)
      }
    }
    
    console.log('✅ تم إعادة تعيين تسلسل الأرقام (إن أمكن)')
    
  } catch (error) {
    console.warn('⚠️ تحذير: لم يتم إعادة تعيين تسلسل الأرقام:', error.message)
  }
}

// الدالة الرئيسية
async function main() {
  console.log('🚀 بدء عملية الحذف الشامل وإعادة البداية من الصفر')
  console.log('⚠️  تحذير: هذا السكريبت سيحذف جميع بيانات العملاء!')
  
  try {
    // 1. إنشاء نسخة احتياطية
    const backupFile = await createBackup()
    
    // 2. الحذف الشامل
    await completeReset()
    
    // 3. التحقق من النظافة
    const isClean = await verifyCleanDatabase()
    
    if (isClean) {
      // 4. إعادة تعيين التسلسلات
      await resetSequences()
      
      console.log('\n🎉 تم الانتهاء بنجاح!')
      console.log('✅ قاعدة البيانات نظيفة ومستعدة للاستيراد الجديد')
      console.log(`💾 النسخة الاحتياطية محفوظة في: ${backupFile}`)
      console.log('\n📋 الخطوات التالية:')
      console.log('1. راجع ملف Excel وتأكد من صحة البيانات')
      console.log('2. استورد العملاء أولاً')
      console.log('3. ثم استورد الدفعات الحقيقية فقط')
      console.log('4. أضف المصاريف وأتعاب المحاماة إذا لزم الأمر')
      
    } else {
      console.log('❌ فشل في تنظيف قاعدة البيانات بالكامل')
    }
    
  } catch (error) {
    console.error('❌ خطأ عام:', error)
    process.exit(1)
  }
}

// تشغيل السكريبت
main()
