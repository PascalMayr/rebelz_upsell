--! Previous: sha1:de1f4b6ae8ddcfd92b09f603686b9c3d7fbfedc3
--! Hash: sha1:38522c23842b9adc17e33f3aafb761b50b284f23

-- Enter migration here
ALTER TABLE orders ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'OPEN';
