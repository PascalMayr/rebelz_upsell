--! Previous: sha1:4f219611cae4b394322367fe4ffe1aad4939d2db
--! Hash: sha1:cdc0a908ef69e31001656d4da398d970b5f73f99

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS "mobileMessage" CASCADE;
ALTER TABLE campaigns ADD COLUMN "mobileMessage" TEXT NOT NULL;
