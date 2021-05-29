--! Previous: sha1:1531078b29bfd473aa480a7c8378178991435dc7
--! Hash: sha1:67a295477b1de9563e868c845f04b19befe0174c

-- Enter migration here
ALTER TABLE ONLY stores ALTER COLUMN enabled SET DEFAULT false;
