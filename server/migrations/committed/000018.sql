--! Previous: sha1:1a79140d9034f3bfd572adcce3f3ab1235eab5f4
--! Hash: sha1:093e14e714dd3b3d8a828272d62f5e91c6e434a7

-- Enter migration here
ALTER TABLE stores ADD COLUMN "access_token" TEXT;
