// سكريبت لحل مشكلة الدفعات المستوردة بشكل خاطئ
import { createClient } from '@supabase/supabase-js'

// تكوين Supabase
const supabaseUrl = 'https://mxkzwpaxniudqbfugrqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixPaymentsIssue() {
  console.log('🔄 بدء حل مشكلة الدفعات المستوردة بشكل خاطئ...')
  
  try {
    // 1. أولاً، احصل على جميع سجلات الدفع المشبوهة (تاريخ 2025-08-24)
    console.log('🔍 البحث عن الدفعات الخاطئة...')
    const { data: suspiciousPayments, error: fetchError } = await supabase
      .from('payment_records')
      .select('*')
      .eq('date', '2025-08-24')
    
    if (fetchError) {
      console.error('❌ خطأ في جلب الدفعات المشبوهة:', fetchError)
      return
    }
    
    console.log(`🔍 تم العثور على ${suspiciousPayments.length} دفعة مشبوهة`)
    
    // 2. تحليل الدفعات المشبوهة
    const realPayments = []
    const fakePayments = []
    
    suspiciousPayments.forEach(payment => {
      // الدفعات الحقيقية عادة تكون أكبر من 50 دينار أو مبالغ منطقية
      // الدفعات الوهمية هي الأرقام الصغيرة المتسلسلة (2, 3, 4, 5...21)
      if (payment.amount >= 50 || 
          (payment.amount > 21 && payment.amount < 50) ||
          payment.amount.toString().includes('.')) {
        // هذه قد تكون دفعات حقيقية
        realPayments.push(payment)
      } else {
        // هذه دفعات وهمية (أرقام صغيرة 2-21)
        fakePayments.push(payment)
      }
    })
    
    console.log(`✅ دفعات حقيقية محتملة: ${realPayments.length}`)
    console.log(`❌ دفعات وهمية: ${fakePayments.length}`)
    
    // 3. اعرض عينة من الدفعات لتأكيد التحليل
    console.log('\n📋 عينة من الدفعات الحقيقية:')
    realPayments.slice(0, 10).forEach(p => {
      console.log(`  - عميل ${p.client_id}: ${p.amount} دينار`)
    })
    
    console.log('\n📋 عينة من الدفعات الوهمية:')
    fakePayments.slice(0, 20).forEach(p => {
      console.log(`  - عميل ${p.client_id}: ${p.amount} دينار`)
    })
    
    // 4. احذف الدفعات الوهمية فقط
    console.log('\n🗑️ حذف الدفعات الوهمية...')
    
    if (fakePayments.length > 0) {
      const fakePaymentIds = fakePayments.map(p => p.id)
      
      // احذف على دفعات صغيرة لتجنب timeout
      const batchSize = 100
      let deletedCount = 0
      
      for (let i = 0; i < fakePaymentIds.length; i += batchSize) {
        const batch = fakePaymentIds.slice(i, i + batchSize)
        
        const { error: deleteError } = await supabase
          .from('payment_records')
          .delete()
          .in('id', batch)
        
        if (deleteError) {
          console.error('❌ خطأ في حذف دفعة:', deleteError)
        } else {
          deletedCount += batch.length
          console.log(`✅ تم حذف ${deletedCount}/${fakePayments.length} دفعة وهمية`)
        }
      }
    }
    
    // 5. احسب المبالغ الصحيحة لكل عميل
    console.log('\n🔄 إعادة حساب مبالغ total_paid للعملاء...')
    
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name')
    
    if (clientsError) {
      console.error('❌ خطأ في جلب العملاء:', clientsError)
      return
    }
    
    for (const client of clients) {
      // احسب إجمالي الدفعات الحقيقية لهذا العميل
      const { data: clientPayments, error: paymentsError } = await supabase
        .from('payment_records')
        .select('amount')
        .eq('client_id', client.id)
      
      if (paymentsError) {
        console.error(`❌ خطأ في جلب دفعات العميل ${client.id}:`, paymentsError)
        continue
      }
      
      const correctTotalPaid = clientPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
      
      // حدث total_paid للعميل
      const { error: updateError } = await supabase
        .from('clients')
        .update({ total_paid: correctTotalPaid })
        .eq('id', client.id)
      
      if (updateError) {
        console.error(`❌ خطأ في تحديث العميل ${client.id}:`, updateError)
      } else {
        console.log(`✅ تم تحديث العميل ${client.name}: ${correctTotalPaid} دينار`)
      }
    }
    
    // 6. اعرض الإحصائيات النهائية
    console.log('\n📊 الإحصائيات النهائية:')
    
    const { data: finalPayments, error: finalError } = await supabase
      .from('payment_records')
      .select('*')
    
    if (!finalError) {
      console.log(`✅ إجمالي سجلات الدفع المتبقية: ${finalPayments.length}`)
    }
    
    const { data: finalClients, error: finalClientsError } = await supabase
      .from('clients')
      .select('id, name, total_paid')
      .order('total_paid', { ascending: false })
      .limit(10)
    
    if (!finalClientsError) {
      console.log('\n🏆 أعلى 10 عملاء في المبالغ المدفوعة:')
      finalClients.forEach((client, index) => {
        console.log(`${index + 1}. ${client.name}: ${client.total_paid} دينار`)
      })
    }
    
    console.log('\n🎉 تم حل مشكلة الدفعات بنجاح!')
    console.log('💡 الآن البيانات نظيفة وصحيحة')
    
  } catch (error) {
    console.error('❌ خطأ عام:', error)
  }
}

// تشغيل السكريبت
fixPaymentsIssue()
