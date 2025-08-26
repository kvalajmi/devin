#!/usr/bin/env node

// سكريبت بسيط لحذف جميع البيانات من قاعدة البيانات
// يمكن تشغيله من Terminal بالأمر: node clear-database-simple.js

const { createClient } = require('@supabase/supabase-js')

// إعدادات Supabase
const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

// إنشاء client واحد فقط لتجنب التحذيرات مع مفتاح تخزين فريد
let supabaseInstance = null
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'harmuni-clear-script-auth'
      }
    })
  }
  return supabaseInstance
}

const supabase = getSupabaseClient()

async function clearDatabase() {
  console.log('🚨 بدء عملية حذف جميع البيانات من قاعدة البيانات...')
  console.log('⚠️  تحذير: هذه العملية لا يمكن التراجع عنها!')
  console.log('')

  const tables = [
    { name: 'client_attachments', label: 'المرفقات' },
    { name: 'lawyer_fees', label: 'أتعاب المحاماة' },
    { name: 'transaction_expenses', label: 'المصروفات' },
    { name: 'payment_records', label: 'سجلات الدفعات' },
    { name: 'clients', label: 'العملاء' },
    { name: 'partner_withdrawal_records', label: 'سحوبات الشريك' },
    { name: 'withdrawal_records', label: 'سحوبات المستثمر' },
    { name: 'funding_records', label: 'التمويل الفعلي' }
  ]

  let totalDeleted = 0
  let errors = 0

  for (const table of tables) {
    try {
      console.log(`🔄 حذف ${table.label} من جدول ${table.name}...`)
      
      // جلب عدد السجلات أولاً
      const { count, error: countError } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.log(`⚠️  خطأ في عد السجلات لجدول ${table.name}:`, countError.message)
        continue
      }

      if (count === 0) {
        console.log(`ℹ️  لا توجد بيانات في جدول ${table.name}`)
        continue
      }

      // حذف جميع السجلات
      const { error: deleteError } = await supabase
        .from(table.name)
        .delete()
        .neq('id', 0) // حذف جميع السجلات

      if (deleteError) {
        console.log(`❌ خطأ في حذف ${table.label}:`, deleteError.message)
        errors++
      } else {
        console.log(`✅ تم حذف ${count} سجل من ${table.label}`)
        totalDeleted += count
      }

    } catch (error) {
      console.log(`💥 خطأ غير متوقع في جدول ${table.name}:`, error.message)
      errors++
    }
    
    console.log('') // سطر فارغ للوضوح
  }

  // النتيجة النهائية
  console.log('🎉 انتهت عملية الحذف!')
  console.log(`📊 إجمالي السجلات المحذوفة: ${totalDeleted}`)
  console.log(`❌ عدد الأخطاء: ${errors}`)
  
  if (errors === 0) {
    console.log('✅ تم حذف جميع البيانات بنجاح!')
    console.log('🚀 قاعدة البيانات نظيفة وجاهزة لاستيراد بيانات جديدة')
  } else {
    console.log('⚠️  تم الانتهاء مع وجود بعض الأخطاء')
  }
}

// تشغيل السكريبت
clearDatabase().catch(error => {
  console.error('💥 خطأ عام:', error)
  process.exit(1)
})
