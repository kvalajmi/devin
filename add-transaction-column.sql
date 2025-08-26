-- إضافة عمود transaction_code إلى جدول clients
ALTER TABLE clients ADD COLUMN IF NOT EXISTS transaction_code VARCHAR(10);

-- إنشاء فهرس للعمود الجديد لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_clients_transaction_code ON clients(transaction_code);

-- التحقق من إضافة العمود بنجاح
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clients' AND column_name = 'transaction_code';
