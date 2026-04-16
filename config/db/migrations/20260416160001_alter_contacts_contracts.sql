-- +goose Up
-- +goose StatementBegin

-- ─────────────────────────────────────────────────────────────────
-- Migrate employee_contacts: ganti schema flat → contact_type/value
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE employee_contacts
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS address_line,
  DROP COLUMN IF EXISTS city,
  DROP COLUMN IF EXISTS province,
  DROP COLUMN IF EXISTS postal_code,
  ADD COLUMN IF NOT EXISTS contact_type  VARCHAR(20) NOT NULL DEFAULT 'phone',
  ADD COLUMN IF NOT EXISTS contact_value TEXT        NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_label VARCHAR(100);

-- ─────────────────────────────────────────────────────────────────
-- Migrate employment_contracts: tambah contract_number dan notes
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE employment_contracts
  ADD COLUMN IF NOT EXISTS contract_number VARCHAR(50) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS notes           TEXT;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- Rollback employment_contracts
ALTER TABLE employment_contracts
  DROP COLUMN IF EXISTS notes,
  DROP COLUMN IF EXISTS contract_number;

-- Rollback employee_contacts (restore old columns)
ALTER TABLE employee_contacts
  DROP COLUMN IF EXISTS contact_label,
  DROP COLUMN IF EXISTS contact_value,
  DROP COLUMN IF EXISTS contact_type,
  ADD COLUMN IF NOT EXISTS phone        VARCHAR(20),
  ADD COLUMN IF NOT EXISTS email        VARCHAR(150),
  ADD COLUMN IF NOT EXISTS address_line TEXT,
  ADD COLUMN IF NOT EXISTS city         VARCHAR(50),
  ADD COLUMN IF NOT EXISTS province     VARCHAR(50),
  ADD COLUMN IF NOT EXISTS postal_code  VARCHAR(10);

-- +goose StatementEnd
