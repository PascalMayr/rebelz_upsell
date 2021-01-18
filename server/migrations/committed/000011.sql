--! Previous: sha1:c88d3832387567fa50949d5742df6fa323c5a89c
--! Hash: sha1:5bae497e83e0ba6c26089acd1d03fea288ec5c76

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN IF EXISTS "mobileStyles" CASCADE;
