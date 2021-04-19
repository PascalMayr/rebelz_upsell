--! Previous: sha1:28890b4ccce5c04c86c4e7f4cdbad0f691312e7c
--! Hash: sha1:3bf5f8680d7b676cce52f25aa5fe2d05115a0f2f

-- Enter migration here
ALTER TABLE stores DROP COLUMN google_tracking_enabled;
