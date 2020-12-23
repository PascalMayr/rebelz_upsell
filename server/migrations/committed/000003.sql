--! Previous: sha1:f57e179dfb4abbd59c77b2eadcf1c44beeca88b9
--! Hash: sha1:c1d3a75613e21b3d55ba60cde57515b8175c8b0f

-- Enter migration here
DROP TABLE IF EXISTS campaigns;

CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) REFERENCES stores(domain),
  styles JSONB NOT NULL,
  message TEXT NOT NULL,
  published BOOLEAN NOT NULL,
  trigger TEXT NOT NULL,
  sell_type TEXT NOT NULL,
  name TEXT NOT NULL
);
