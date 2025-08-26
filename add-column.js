// سكريپت لإضافة عمود transaction_code إلى قاعدة البيانات
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addTransactionCodeColumn() {
  try {
    console.log('🔧 محاولة إضافة عمود transaction_code...')
    
    // محاولة قراءة العمود للتحقق من وجوده
    const { data, error } = await supabase
      .from('clients')
      .select('transaction_code')
      .limit(1)
    
    if (error) {
      if (error.code === '42703') {
        console.log('❌ العمود transaction_code غير موجود')
        console.log('\n📋 يجب إضافة العمود يدوياً في Supabase:')
        console.log('1. اذهب إلى https://supabase.com/dashboard')
        console.log('2. اختر مشروعك')
        console.log('3. Table Editor → clients')
        console.log('4. Add column:')
        console.log('   - Name: transaction_code')
        console.log('   - Type: varchar(10)')
        console.log('   - Allow nullable: true')
        console.log('\n🔧 أو استخدم SQL Editor:')
        console.log('ALTER TABLE clients ADD COLUMN IF NOT EXISTS transaction_code VARCHAR(10);')
        console.log('CREATE INDEX IF NOT EXISTS idx_clients_transaction_code ON clients(transaction_code);')
      } else {
        console.log('🔍 خطأ آخر:', error)
      }
    } else {
      console.log('✅ العمود transaction_code موجود بالفعل!')
      console.log('🎉 يمكنك الآن استخدام أداة الاستيراد')
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message)
  }
}

addTransactionCodeColumn()
