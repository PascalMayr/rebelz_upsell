--! Previous: sha1:4d0fbb44b86f182fc71d9dc1e8e6a4c0d8a4391e
--! Hash: sha1:54ecc7a7d55b9eca9efae959a1c7fe488835a6a5

-- Enter migration here
ALTER TABLE stores DROP COLUMN IF EXISTS plan_name CASCADE;
ALTER TABLE stores ADD COLUMN plan_name TEXT;

ALTER TABLE stores DROP COLUMN IF EXISTS "subscriptionId" CASCADE;
ALTER TABLE stores ADD COLUMN "subscriptionId" TEXT;

ALTER TABLE stores DROP COLUMN IF EXISTS plan_limit CASCADE;
ALTER TABLE stores ADD COLUMN plan_limit BIGINT DEFAULT 0;
