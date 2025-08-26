// سكريبت لإضافة عمود transaction_code إلى قاعدة البيانات
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateSchema() {
  try {
    console.log('🔧 محاولة إضافة عمود transaction_code...')
    
    // محاولة إضافة العمود مباشرة
    const { data, error } = await supabase
      .from('clients')
      .select('transaction_code')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('❌ العمود transaction_code غير موجود')
      console.log('⚠️  يجب إضافة العمود يدوياً من لوحة تحكم Supabase')
      console.log('📝 SQL المطلوب:')
      console.log('ALTER TABLE clients ADD COLUMN IF NOT EXISTS transaction_code VARCHAR(10);')
      console.log('CREATE INDEX IF NOT EXISTS idx_clients_transaction_code ON clients(transaction_code);')
    } else if (!error) {
      console.log('✅ العمود transaction_code موجود بالفعل')
    } else {
      console.log('🔍 خطأ آخر:', error)
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message)
  }
}

updateSchema()
