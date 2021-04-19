--! Previous: sha1:d4c39cac372fa4b632a4ce10b3553833b3257caf
--! Hash: sha1:70816aa9da0a0efdced869d1a1b5efcbead83f6b

-- Enter migration here
ALTER TABLE ONLY stores ALTER COLUMN enabled SET DEFAULT true;
