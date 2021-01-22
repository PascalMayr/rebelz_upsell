--! Previous: sha1:e93162fdb23913e9ef6913acaf4eac5870fa30fe
--! Hash: sha1:6c8b81111d1ea84d1e1fbda553e11e2b057dcf2a

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS texts CASCADE;
ALTER TABLE campaigns ADD COLUMN texts BOOLEAN;
