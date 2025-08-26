// سكريبت لإضافة الأعمدة المفقودة إلى قاعدة البيانات
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addNewColumns() {
  console.log('🔧 محاولة إضافة الأعمدة المفقودة...')
  
  try {
    // إضافة تاريخ المعاملة
    const { error: error1 } = await supabase.rpc('execute_sql', {
      sql_query: 'ALTER TABLE clients ADD COLUMN IF NOT EXISTS transaction_date TIMESTAMP;'
    })
    
    if (error1) {
      console.error('❌ خطأ في إضافة transaction_date:', error1)
    } else {
      console.log('✅ تم إضافة transaction_date بنجاح')
    }

    // إضافة قيمة القسط
    const { error: error2 } = await supabase.rpc('execute_sql', {
      sql_query: 'ALTER TABLE clients ADD COLUMN IF NOT EXISTS installment_amount DECIMAL(10,3);'
    })
    
    if (error2) {
      console.error('❌ خطأ في إضافة installment_amount:', error2)
    } else {
      console.log('✅ تم إضافة installment_amount بنجاح')
    }

    // إضافة تاريخ أول قسط
    const { error: error3 } = await supabase.rpc('execute_sql', {
      sql_query: 'ALTER TABLE clients ADD COLUMN IF NOT EXISTS first_installment_date TIMESTAMP;'
    })
    
    if (error3) {
      console.error('❌ خطأ في إضافة first_installment_date:', error3)
    } else {
      console.log('✅ تم إضافة first_installment_date بنجاح')
    }

    console.log('🎉 تم الانتهاء من إضافة جميع الأعمدة المفقودة!')

  } catch (error) {
    console.error('🔍 خطأ عام:', error)
  }
}

addNewColumns();
