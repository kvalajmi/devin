# 🗄️ دليل إعداد Supabase - نظام هارموني إكسل

## 📋 **الخطوات المطلوبة**:

### **1. إنشاء الجداول في Supabase**:

1. **اذهب إلى SQL Editor** في Supabase
2. **اضغط على "New query"**
3. **انسخ الكود** من ملف `supabase-schema.sql`
4. **اضغط على "Run"**

### **2. التحقق من إنشاء الجداول**:

اذهب إلى **Table Editor** وتأكد من وجود الجداول التالية:
- ✅ `clients` - العملاء
- ✅ `investors` - المستثمرين
- ✅ `payment_records` - سجلات الدفع
- ✅ `transaction_expenses` - المصاريف
- ✅ `lawyer_fees` - أتعاب المحاماة
- ✅ `client_attachments` - المرفقات

### **3. اختبار الاتصال**:

افتح **Console** في المتصفح واكتب:
```javascript
// اختبار الاتصال مع Supabase
import { testSupabaseConnection } from './src/utils/supabase'
testSupabaseConnection()
```

## 🔑 **المفاتيح المستخدمة**:

```
URL: https://mxkzwpaxniudqbfugrqa.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3cGF4bml1ZHFiZnVncnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE3MTAsImV4cCI6MjA3MTU3NzcxMH0.DYHdZIh0xT7oXxlZ_8hvKzx-x6NVdKXrPFsMyUS3GqM
```

## 📊 **البيانات التجريبية**:

بعد تشغيل `supabase-schema.sql` ستجد:
- **3 عملاء** مع بيانات تجريبية
- **1 مستثمر** مع بيانات تجريبية

## 🚀 **اختبار النظام**:

1. **شغل النظام**: `npm run dev`
2. **اذهب إلى صفحة المستثمرين**
3. **اضغط على زر "تحديث البيانات"**
4. **تحقق من الكروت** - يجب أن تعرض البيانات من Supabase

## 🔧 **في حالة وجود مشاكل**:

### **مشكلة الاتصال**:
- تحقق من صحة المفاتيح
- تأكد من إنشاء الجداول
- تحقق من سياسات الأمان (RLS)

### **مشكلة البيانات**:
- تحقق من وجود البيانات في الجداول
- تأكد من صحة هيكل البيانات
- تحقق من Console للأخطاء

## 📞 **الدعم**:

إذا واجهت أي مشاكل:
1. **تحقق من Console** للأخطاء
2. **راجع ملفات Log** في Supabase
3. **تأكد من صحة** المفاتيح والجداول

---

**🎯 الهدف**: ربط النظام مع قاعدة بيانات سحابية حقيقية مع الحفاظ على البيانات المحلية كبديل
