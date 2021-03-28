--! Previous: sha1:edfd07e1a2fa2f8e06d08197b4fe70be52a2a801
--! Hash: sha1:49c8ba34685bdf24fcaac635e22e744ee52b11be

-- Enter migration here
DROP TABLE IF EXISTS orders;

CREATE TABLE orders(
  order_time TIMESTAMP DEFAULT current_timestamp NOT NULL,
  campaign_id BIGINT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  currency VARCHAR(255) NOT NULL,
  total_price DECIMAL NOT NULL,
  draft_order_id BIGINT NOT NULL
);
