--! Previous: sha1:5e6b167750d075eb0ae7b425643b8881ae0121f6
--! Hash: sha1:4f219611cae4b394322367fe4ffe1aad4939d2db

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS "mobileStyles" CASCADE;
ALTER TABLE campaigns ADD COLUMN "mobileStyles" JSONB NOT NULL;

ALTER TABLE campaigns DROP COLUMN IF EXISTS products CASCADE;
ALTER TABLE campaigns ADD COLUMN products JSONB NOT NULL;
