// سكريبت لإصلاح تنسيق أكواد المعاملات لتظهر 5 خانات
import { createClient } from '@supabase/supabase-js'

// تكوين Supabase
const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixTransactionCodeFormat() {
  console.log('🔧 بدء إصلاح تنسيق أكواد المعاملات...')
  
  try {
    // جلب جميع العملاء
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, name, transaction_code')
    
    if (error) {
      console.error('❌ خطأ في جلب العملاء:', error)
      return
    }
    
    if (!clients || clients.length === 0) {
      console.log('ℹ️ لا توجد عملاء في قاعدة البيانات')
      return
    }
    
    console.log(`📊 تم العثور على ${clients.length} عميل`)
    
    let fixedCount = 0
    let alreadyCorrectCount = 0
    
    for (const client of clients) {
      const currentCode = client.transaction_code || ''
      console.log(`\n👤 العميل: ${client.name}`)
      console.log(`📋 الكود الحالي: "${currentCode}"`)
      
      // التحقق من تنسيق الكود
      if (currentCode) {
        // استخراج الجزء الرقمي من الكود
        const match = currentCode.match(/k\s*(\d+)/)
        if (match) {
          const numericPart = match[1]
          console.log(`🔢 الجزء الرقمي: "${numericPart}" (طول: ${numericPart.length})`)
          
          if (numericPart.length < 5) {
            // إضافة أصفار بادئة لجعلها 5 خانات
            const paddedNumber = numericPart.padStart(5, '0')
            const newCode = currentCode.replace(/k\s*\d+/, `k${paddedNumber}`)
            
            console.log(`🔧 الكود الجديد: "${newCode}"`)
            
            // تحديث الكود في قاعدة البيانات
            const { error: updateError } = await supabase
              .from('clients')
              .update({ transaction_code: newCode })
              .eq('id', client.id)
            
            if (updateError) {
              console.error(`❌ خطأ في تحديث العميل ${client.id}:`, updateError)
            } else {
              console.log(`✅ تم تحديث الكود بنجاح`)
              fixedCount++
            }
          } else if (numericPart.length === 5) {
            console.log(`✅ الكود صحيح بالفعل (5 خانات)`)
            alreadyCorrectCount++
          } else {
            console.log(`⚠️ الكود أطول من 5 خانات - لم يتم تعديله`)
          }
        } else {
          console.log(`⚠️ تنسيق الكود غير صحيح - لا يحتوي على k متبوع بأرقام`)
        }
      } else {
        console.log(`⚠️ لا يوجد كود معاملة`)
      }
    }
    
    console.log('\n📊 ملخص النتائج:')
    console.log(`✅ تم إصلاح ${fixedCount} كود`)
    console.log(`✅ ${alreadyCorrectCount} كود كان صحيحاً بالفعل`)
    console.log(`📊 إجمالي العملاء: ${clients.length}`)
    
    if (fixedCount > 0) {
      console.log('\n🎉 تم إصلاح جميع أكواد المعاملات بنجاح!')
      console.log('💡 الآن جميع الأكواد تظهر بـ 5 خانات')
    } else {
      console.log('\n✅ جميع أكواد المعاملات كانت صحيحة بالفعل')
    }
    
  } catch (error) {
    console.error('❌ خطأ عام:', error)
  }
}

// تشغيل السكريبت
fixTransactionCodeFormat()

