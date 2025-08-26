-- حذف جميع البيانات الإضافية
-- يمكن تشغيل هذا في SQL Editor في Supabase

-- حذف بيانات التمويل الفعلي
DELETE FROM funding_records;

-- حذف سحوبات المستثمر
DELETE FROM withdrawal_records;

-- حذف سحوبات الشريك
DELETE FROM partner_withdrawal_records;

-- رسالة تأكيد
SELECT 'تم حذف جميع البيانات الإضافية بنجاح!' as message;
