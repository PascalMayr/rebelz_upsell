--! Previous: sha1:6fd7e8c293aec73501650ecf5039a3fd0571cc12
--! Hash: sha1:2f19c5bedc295d79f0aa3b0c50064cad986fc75a

-- Enter migration here
ALTER TABLE stores DROP COLUMN IF EXISTS scriptid CASCADE;
ALTER TABLE stores ADD COLUMN scriptid VARCHAR;
