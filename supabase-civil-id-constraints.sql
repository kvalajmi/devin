ALTER TABLE investors ADD CONSTRAINT unique_civil_id UNIQUE (civil_id);
ALTER TABLE investors ADD CONSTRAINT check_civil_id_length CHECK (LENGTH(civil_id) = 12);

ALTER TABLE clients ADD COLUMN IF NOT EXISTS loan_code VARCHAR(5);
CREATE UNIQUE INDEX IF NOT EXISTS unique_loan_code ON clients(loan_code) WHERE loan_code IS NOT NULL;
