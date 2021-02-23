--! Previous: sha1:a783b55a1d2c45df54835326020f952758f43978
--! Hash: sha1:59d07ec34f128828b107a2d4418dcb50d0ad29cc

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS animation CASCADE;
