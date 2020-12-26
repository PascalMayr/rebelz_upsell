--! Previous: sha1:f57e179dfb4abbd59c77b2eadcf1c44beeca88b9
--! Hash: sha1:5e6b167750d075eb0ae7b425643b8881ae0121f6

-- Enter migration here
DROP TABLE IF EXISTS campaigns;

CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) REFERENCES stores(domain),
  styles JSONB NOT NULL,
  message TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  trigger TEXT NOT NULL,
  sell_type TEXT NOT NULL,
  name TEXT NOT NULL
);
