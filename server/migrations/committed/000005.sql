--! Previous: sha1:4f219611cae4b394322367fe4ffe1aad4939d2db
--! Hash: sha1:f2b23fb9e9318c0683e9a6cdcd1b3011eadd344b

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS "mobileMessage" CASCADE;
ALTER TABLE campaigns ADD COLUMN "mobileMessage" JSONB NOT NULL;
