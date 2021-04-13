--! Previous: sha1:38522c23842b9adc17e33f3aafb761b50b284f23
--! Hash: sha1:b00e9a93fb6d09a8b1f38215bddb8485cad89fd3

-- Enter migration here
ALTER TABLE campaigns DROP COLUMN global;
ALTER TABLE stores ADD COLUMN global_campaign_id INTEGER REFERENCES campaigns(id);
