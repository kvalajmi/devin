-- ملف إنشاء جداول قاعدة البيانات في Supabase
-- قم بنسخ هذا الكود ولصقه في SQL Editor في Supabase

-- إنشاء جدول المستثمرين
CREATE TABLE IF NOT EXISTS investors (
  id BIGSERIAL PRIMARY KEY,
  investor_name VARCHAR(255) NOT NULL,
  partner_name VARCHAR(255) NOT NULL,
  partnership_type VARCHAR(100) NOT NULL DEFAULT 'نسبة',
  investor_percentage DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  partner_percentage DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  civil_id VARCHAR(20) UNIQUE NOT NULL,
  join_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول العملاء
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  transaction_code VARCHAR(10),
  name VARCHAR(255) NOT NULL,
  civil_id VARCHAR(20) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  pension_date INTEGER NOT NULL,
  guarantee VARCHAR(255) NOT NULL,
  payment_period INTEGER NOT NULL,
  loan_amount DECIMAL(10,3) NOT NULL,
  profit DECIMAL(10,3) NOT NULL,
  funding_date VARCHAR(20) NOT NULL,
  transaction_date TIMESTAMP,
  installment_amount DECIMAL(10,3),
  first_installment_date TIMESTAMP,
  total_amount DECIMAL(10,2) NOT NULL,
  total_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_remaining DECIMAL(10,2) NOT NULL,
  job VARCHAR(255),
  address TEXT,
  governorate VARCHAR(100),
  area VARCHAR(100),
  block VARCHAR(50),
  street VARCHAR(100),
  avenue VARCHAR(100),
  house_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول سجلات التمويل
CREATE TABLE IF NOT EXISTS funding_records (
  id BIGSERIAL PRIMARY KEY,
  investor_id BIGINT REFERENCES investors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول سجلات السحب
CREATE TABLE IF NOT EXISTS withdrawal_records (
  id BIGSERIAL PRIMARY KEY,
  investor_id BIGINT REFERENCES investors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول سجلات سحب الشريك
CREATE TABLE IF NOT EXISTS partner_withdrawal_records (
  id BIGSERIAL PRIMARY KEY,
  investor_id BIGINT REFERENCES investors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول المصاريف
CREATE TABLE IF NOT EXISTS transaction_expenses (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول أتعاب المحاماة
CREATE TABLE IF NOT EXISTS lawyer_fees (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول سجلات الدفع
CREATE TABLE IF NOT EXISTS payment_records (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  installment_id BIGINT,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'installment' CHECK (type IN ('installment', 'partial')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول المرفقات
CREATE TABLE IF NOT EXISTS client_attachments (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  file_data TEXT NOT NULL, -- Base64 encoded file data
  category VARCHAR(50) NOT NULL DEFAULT 'other' CHECK (category IN ('contract', 'identity', 'guarantee', 'payment', 'legal', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_clients_civil_id ON clients(civil_id);
CREATE INDEX IF NOT EXISTS idx_clients_loan_amount ON clients(loan_amount);
CREATE INDEX IF NOT EXISTS idx_clients_total_paid ON clients(total_paid);
CREATE INDEX IF NOT EXISTS idx_clients_total_remaining ON clients(total_remaining);

CREATE INDEX IF NOT EXISTS idx_investors_civil_id ON investors(civil_id);
CREATE INDEX IF NOT EXISTS idx_investors_investor_name ON investors(investor_name);

CREATE INDEX IF NOT EXISTS idx_payment_records_client_id ON payment_records(client_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_date ON payment_records(date);

CREATE INDEX IF NOT EXISTS idx_transaction_expenses_client_id ON transaction_expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_transaction_expenses_date ON transaction_expenses(date);

CREATE INDEX IF NOT EXISTS idx_lawyer_fees_client_id ON lawyer_fees(client_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_fees_date ON lawyer_fees(date);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء Triggers لتحديث updated_at تلقائياً
CREATE TRIGGER update_investors_updated_at BEFORE UPDATE ON investors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funding_records_updated_at BEFORE UPDATE ON funding_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawal_records_updated_at BEFORE UPDATE ON withdrawal_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_withdrawal_records_updated_at BEFORE UPDATE ON partner_withdrawal_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transaction_expenses_updated_at BEFORE UPDATE ON transaction_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lawyer_fees_updated_at BEFORE UPDATE ON lawyer_fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_records_updated_at BEFORE UPDATE ON payment_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_attachments_updated_at BEFORE UPDATE ON client_attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إدراج بيانات تجريبية للعملاء مع ربطهم بالمستثمر
INSERT INTO clients (
  name, civil_id, phone_number, pension_date, guarantee, payment_period,
  loan_amount, profit, funding_date, installment_value, first_installment_date,
  total_amount, total_paid, total_remaining, investor_id, loan_code
) VALUES 
  ('سعد محمد عبد الكريم العتيبي', '296100601597', '56622626', 23, 'عقد بقيمة 2500', 15, 1069.328, 730.672, '7/6/2022', 120, '23/6/2022', 1800, 0, 1800, 1, '00001'),
  ('أحمد محمد علي', '296100601598', '56622627', 25, 'عقار', 20, 2000, 1000, '10/6/2022', 150, '25/6/2022', 3000, 300, 2700, 1, '00002'),
  ('محمد عبد الله', '296100601599', '56622628', 28, 'سيارة', 18, 1500, 750, '15/6/2022', 125, '30/6/2022', 2250, 250, 2000, 1, '00003')
ON CONFLICT (civil_id) DO NOTHING;

UPDATE clients SET investor_id = 1, loan_code = LPAD(id::text, 5, '0') WHERE investor_id IS NULL;

-- إدراج بيانات تجريبية للمستثمرين
INSERT INTO investors (
  investor_name, partner_name, partnership_type, investor_percentage, partner_percentage, civil_id, join_date
) VALUES 
  ('خالد سعد', 'شركة هارموني بلس', 'نسبة', 50, 50, '1234567890', '2024-01-15')
ON CONFLICT (civil_id) DO NOTHING;

-- إنشاء سياسات الأمان (RLS - Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_attachments ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح بالقراءة للجميع (يمكن تعديلها حسب الحاجة)
CREATE POLICY "Allow public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON investors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON payment_records FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON transaction_expenses FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON lawyer_fees FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON client_attachments FOR SELECT USING (true);

-- سياسة للسماح بالإدراج والتحديث والحذف (يمكن تعديلها حسب الحاجة)
CREATE POLICY "Allow public insert" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON investors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON investors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON investors FOR DELETE USING (true);

-- سياسات سجلات الدفع
CREATE POLICY "Allow public insert" ON payment_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON payment_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON payment_records FOR DELETE USING (true);

-- سياسات المصاريف
CREATE POLICY "Allow public insert" ON transaction_expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON transaction_expenses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON transaction_expenses FOR DELETE USING (true);

-- سياسات أتعاب المحاماة
CREATE POLICY "Allow public insert" ON lawyer_fees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON lawyer_fees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON lawyer_fees FOR DELETE USING (true);

-- سياسات المرفقات
CREATE POLICY "Allow public insert" ON client_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON client_attachments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON client_attachments FOR DELETE USING (true);

-- إضافة حقل كود المعاملة للجدول الموجود (إذا لم يكن موجوداً)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS transaction_code VARCHAR(10);

-- إضافة الحقول المفقودة للجداول الموجودة
ALTER TABLE clients ADD COLUMN IF NOT EXISTS transaction_date TIMESTAMP;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS installment_amount DECIMAL(10,3);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS first_installment_date TIMESTAMP;

-- إضافة حقل معرف المستثمر لربط العملاء بالمستثمرين
ALTER TABLE clients ADD COLUMN IF NOT EXISTS investor_id BIGINT REFERENCES investors(id) ON DELETE CASCADE;

-- إضافة حقل كود القرض
ALTER TABLE clients ADD COLUMN IF NOT EXISTS loan_code VARCHAR(5);

-- إنشاء فهرس لحقل كود المعاملة
CREATE INDEX IF NOT EXISTS idx_clients_transaction_code ON clients(transaction_code);

-- إنشاء فهرس لحقل معرف المستثمر
CREATE INDEX IF NOT EXISTS idx_clients_investor_id ON clients(investor_id);

-- إنشاء فهرس لحقل كود القرض
CREATE INDEX IF NOT EXISTS idx_clients_loan_code ON clients(loan_code);

-- إضافة تعليقات على الجداول
COMMENT ON TABLE clients IS 'جدول العملاء مع تفاصيل القروض والمدفوعات';
COMMENT ON TABLE investors IS 'جدول المستثمرين والشركاء';
COMMENT ON TABLE payment_records IS 'جدول سجلات الدفع للعملاء';
COMMENT ON TABLE transaction_expenses IS 'جدول المصاريف المتعلقة بالعملاء';
COMMENT ON TABLE lawyer_fees IS 'جدول أتعاب المحاماة';
COMMENT ON TABLE client_attachments IS 'جدول المرفقات والوثائق';


