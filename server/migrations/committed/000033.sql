--! Previous: sha1:a7bb6b2c7805ce4dfc322b01cecdb656f72f97d2
--! Hash: sha1:1531078b29bfd473aa480a7c8378178991435dc7

-- Enter migration here
DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);
