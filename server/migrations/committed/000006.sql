--! Previous: sha1:cdc0a908ef69e31001656d4da398d970b5f73f99
--! Hash: sha1:6fd7e8c293aec73501650ecf5039a3fd0571cc12

-- Enter migration here
ALTER TABLE stores DROP COLUMN IF EXISTS enabled CASCADE;
ALTER TABLE stores ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT false;
