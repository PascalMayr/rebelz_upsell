--! Previous: sha1:d4c39cac372fa4b632a4ce10b3553833b3257caf
--! Hash: sha1:28890b4ccce5c04c86c4e7f4cdbad0f691312e7c

-- Enter migration here
ALTER TABLE stores ADD COLUMN google_tracking_enabled BOOLEAN NOT NULL DEFAULT FALSE;
