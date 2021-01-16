--! Previous: sha1:49248b774c5580db43d828df598c633f308bcc3a
--! Hash: sha1:c88d3832387567fa50949d5742df6fa323c5a89c

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS sell_type CASCADE;
ALTER TABLE campaigns ADD COLUMN "sellType" TEXT;
