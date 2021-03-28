--! Previous: sha1:49c8ba34685bdf24fcaac635e22e744ee52b11be
--! Hash: sha1:9ceeed9e726f065aa4d227ebfaf939c51d9b26ad

-- Enter migration here
ALTER TABLE orders ADD COLUMN value_added DECIMAL NOT NULL DEFAULT 0;
