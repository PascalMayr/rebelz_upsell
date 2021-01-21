-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS "multiCurrencySupport" CASCADE;
ALTER TABLE campaigns ADD COLUMN "multiCurrencySupport" BOOLEAN;