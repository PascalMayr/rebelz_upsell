--! Previous: sha1:e93162fdb23913e9ef6913acaf4eac5870fa30fe
--! Hash: sha1:4d0fbb44b86f182fc71d9dc1e8e6a4c0d8a4391e

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS texts CASCADE;
ALTER TABLE campaigns ADD COLUMN texts JSONB NOT NULL;
