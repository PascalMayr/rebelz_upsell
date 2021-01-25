--! Previous: sha1:5bae497e83e0ba6c26089acd1d03fea288ec5c76
--! Hash: sha1:e93162fdb23913e9ef6913acaf4eac5870fa30fe

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS "multiCurrencySupport" CASCADE;
ALTER TABLE campaigns ADD COLUMN "multiCurrencySupport" BOOLEAN;
