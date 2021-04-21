--! Previous: sha1:3bf5f8680d7b676cce52f25aa5fe2d05115a0f2f
--! Hash: sha1:a7bb6b2c7805ce4dfc322b01cecdb656f72f97d2

-- Enter migration here
ALTER TABLE ONLY stores ALTER COLUMN enabled SET DEFAULT true;
