--! Previous: sha1:49248b774c5580db43d828df598c633f308bcc3a
--! Hash: sha1:6caf24473d28e5d80d9180b84c798e3faba62a19

-- Enter migration here
ALTER TABLE stores DROP COLUMN IF EXISTS plan_name CASCADE;
ALTER TABLE stores ADD COLUMN plan_name TEXT;

ALTER TABLE stores DROP COLUMN IF EXISTS "subscriptionId" CASCADE;
ALTER TABLE stores ADD COLUMN "subscriptionId" TEXT;

ALTER TABLE stores DROP COLUMN IF EXISTS plan_limit CASCADE;
ALTER TABLE stores ADD COLUMN plan_limit BIGINT;
