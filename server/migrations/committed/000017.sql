--! Previous: sha1:59d07ec34f128828b107a2d4418dcb50d0ad29cc
--! Hash: sha1:1a79140d9034f3bfd572adcce3f3ab1235eab5f4

-- Enter migration here
ALTER TABLE campaigns ADD COLUMN global BOOLEAN NOT NULL DEFAULT false;
